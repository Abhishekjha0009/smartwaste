import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  citizenName: {
    type: String,
    default: 'Anonymous Citizen'
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Waste image is required']
  },
  beforeImage: {
    type: String,
    default: ''
  },
  afterImage: {
    type: String,
    default: ''
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: 'Location detected via GPS' },
    area: { type: String, default: 'Central Sector' }
  },
  category: {
    type: String,
    enum: ['Plastic', 'Organic', 'Hazardous', 'E-Waste', 'Bulky', 'Construction', 'Mixed'],
    default: 'Mixed'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  aiClassification: {
    detectedCategory: { type: String, default: 'Mixed Waste' },
    severity: { type: String, default: 'Medium' },
    confidence: { type: Number, default: 0.88 },
    recyclable: { type: Boolean, default: false },
    recommendation: { type: String, default: 'Standard dispatch required.' },
    tags: [{ type: String }]
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  assignedWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedWorkerName: {
    type: String,
    default: ''
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  timeline: [
    {
      status: String,
      note: String,
      updatedBy: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// Index for geo-spatial queries
complaintSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
