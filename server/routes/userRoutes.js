import express from 'express';
import { getWorkers, getAllUsers, updateUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/workers', authorize('Authority', 'Admin'), getWorkers);
router.get('/', authorize('Admin'), getAllUsers);
router.put('/:id', authorize('Admin'), updateUser);

export default router;
