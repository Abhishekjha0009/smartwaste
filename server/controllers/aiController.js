import { analyzeWasteImage } from '../services/aiVisionService.js';

// @desc    Analyze waste image with AI Vision (Live Preview Endpoint)
// @route   POST /api/ai/classify
// @access  Private / Public
export const classifyWasteImage = async (req, res, next) => {
  try {
    let imageUrl = req.body.imageUrl;
    let imageBuffer = null;

    if (req.file) {
      if (req.file.path) {
        imageUrl = req.file.path;
      } else if (req.file.buffer) {
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
        imageBuffer = req.file.buffer;
      }
    }

    if (!imageUrl && !imageBuffer) {
      return res.status(400).json({ success: false, message: 'Waste image file or image URL is required' });
    }

    const analysis = await analyzeWasteImage(imageBuffer || imageUrl, {
      filename: req.file?.originalname || 'waste_sample.jpg',
      description: req.body.description || ''
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};
