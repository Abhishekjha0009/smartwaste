import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignWorker,
  updateStatus,
  deleteComplaint
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .post(upload.single('image'), createComplaint)
  .get(getComplaints);

router.route('/:id')
  .get(getComplaintById)
  .delete(deleteComplaint);

router.put('/:id/assign', authorize('Authority', 'Admin'), assignWorker);
router.put('/:id/status', upload.single('afterImage'), updateStatus);

export default router;
