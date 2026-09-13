import express from 'express';
import { classifyWasteImage } from '../controllers/aiController.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/classify', upload.single('image'), classifyWasteImage);

export default router;
