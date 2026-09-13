import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { analyzeWasteImage, checkDuplicateReport } from '../services/aiVisionService.js';
import { emitComplaintCreated, emitTaskAssigned, emitTaskStatusUpdated, emitTaskResolved } from '../services/socketService.js';

// @desc    Create a new waste report complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, latitude, longitude, address, area, category, severity } = req.body;

    let imageUrl = '';
    let imageBuffer = null;

    if (req.file) {
      if (req.file.path) {
        imageUrl = req.file.path; // Cloudinary URL
      } else if (req.file.buffer) {
        // Fallback local base64 data URI for instant testing
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
        imageBuffer = req.file.buffer;
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      // High-quality fallback placeholder waste image for demo convenience
      imageUrl = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800';
    }

    const parsedLat = parseFloat(latitude) || 28.6139;
    const parsedLng = parseFloat(longitude) || 77.2090;

    // 1. Run AI Vision Analysis
    const aiResult = await analyzeWasteImage(imageBuffer || imageUrl, {
      filename: req.file?.originalname || title,
      description
    });

    const finalCategory = category || aiResult.detectedCategory || 'Plastic';
    const finalSeverity = severity || aiResult.severity || 'Medium';

    // 2. Check for Duplicate Reports
    const dupCheck = await checkDuplicateReport(Complaint, parsedLat, parsedLng, finalCategory);

    // 3. Create Complaint Document
    const complaint = new Complaint({
      citizenId: req.user._id,
      citizenName: req.user.name,
      title: title || `${finalCategory} Waste Identified`,
      description: description || `Reported ${finalCategory.toLowerCase()} waste mound requiring pickup.`,
      imageUrl,
      beforeImage: imageUrl,
      location: {
        latitude: parsedLat,
        longitude: parsedLng,
        address: address || 'Current Detected Location',
        area: area || 'Downtown Central'
      },
      category: finalCategory,
      severity: finalSeverity,
      aiClassification: {
        detectedCategory: aiResult.detectedCategory,
        severity: aiResult.severity,
        confidence: aiResult.confidence,
        recyclable: aiResult.recyclable,
        recommendation: aiResult.recommendation,
        tags: aiResult.tags
      },
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          note: dupCheck.isDuplicate ? `Report logged (Potential duplicate of #${dupCheck.existingId})` : 'Complaint reported by citizen and analyzed by AI Vision System.',
          updatedBy: req.user.name
        }
      ]
    });

    await complaint.save();

    // Increment Citizen total reported stat
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.totalReported': 1, 'stats.pointsEarned': 10 } });

    // Emit Real-time Socket Event to Authority Dashboard
    emitComplaintCreated(complaint);

    res.status(201).json({
      success: true,
      message: 'Waste complaint reported successfully!',
      complaint,
      duplicateWarning: dupCheck.isDuplicate ? dupCheck : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints (filtered by role & status)
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res, next) => {
  try {
    const { status, category, severity, page = 1, limit = 50 } = req.query;
    let query = {};

    // Role filtering
    if (req.user.role === 'Citizen') {
      query.citizenId = req.user._id;
    } else if (req.user.role === 'Worker') {
      query.assignedWorkerId = req.user._id;
    }

    // Additional query filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (severity) query.severity = severity;

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedWorkerId', 'name phone email avatar');

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      count: complaints.length,
      total,
      complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizenId', 'name email phone avatar')
      .populate('assignedWorkerId', 'name email phone avatar assignedZone');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign worker to complaint
// @route   PUT /api/complaints/:id/assign
// @access  Private (Authority / Admin)
export const assignWorker = async (req, res, next) => {
  try {
    const { workerId } = req.body;
    const worker = await User.findById(workerId);

    if (!worker || worker.role !== 'Worker') {
      return res.status(400).json({ success: false, message: 'Valid sanitation worker required for assignment' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.assignedWorkerId = worker._id;
    complaint.assignedWorkerName = worker.name;
    complaint.assignedBy = req.user._id;
    complaint.status = 'Assigned';
    complaint.timeline.push({
      status: 'Assigned',
      note: `Assigned to worker ${worker.name} (${worker.phone || 'Zone Crew'})`,
      updatedBy: req.user.name
    });

    await complaint.save();

    // Emit Real-time Socket Event to Worker
    emitTaskAssigned(complaint, worker._id);

    res.json({
      success: true,
      message: `Task successfully assigned to ${worker.name}`,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status & complete task (with before/after image proof)
// @route   PUT /api/complaints/:id/status
// @access  Private (Worker / Authority / Admin)
export const updateStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    let afterImageUrl = complaint.afterImage;
    if (req.file) {
      if (req.file.path) {
        afterImageUrl = req.file.path;
      } else if (req.file.buffer) {
        const base64 = req.file.buffer.toString('base64');
        afterImageUrl = `data:${req.file.mimetype};base64,${base64}`;
      }
    } else if (req.body.afterImage) {
      afterImageUrl = req.body.afterImage;
    } else if (status === 'Resolved' && !afterImageUrl) {
      // High-quality cleaned site photo fallback
      afterImageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800';
    }

    complaint.status = status;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (afterImageUrl) complaint.afterImage = afterImageUrl;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
      // Increment worker completed tasks stat
      if (complaint.assignedWorkerId) {
        await User.findByIdAndUpdate(complaint.assignedWorkerId, {
          $inc: { 'stats.tasksCompleted': 1 }
        });
      }
      // Reward Citizen with bonus points for verified report
      await User.findByIdAndUpdate(complaint.citizenId, {
        $inc: { 'stats.pointsEarned': 50 }
      });
    }

    complaint.timeline.push({
      status,
      note: resolutionNotes || `Status updated to ${status}`,
      updatedBy: req.user.name
    });

    await complaint.save();

    // Trigger Socket.IO alerts
    if (status === 'Resolved') {
      emitTaskResolved(complaint);
    } else {
      emitTaskStatusUpdated(complaint);
    }

    res.json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin or Citizen creator)
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role !== 'Admin' && complaint.citizenId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};
