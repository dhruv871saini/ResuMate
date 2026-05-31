import express from 'express';
import profileController from '../controller/profileController.js';
import authMiddleware from '../middleware/native.auth.js';

const router = express.Router();

// Protected routes - requires authentication
router.post('/create', authMiddleware, profileController.createProfile);
router.put('/update', authMiddleware, profileController.updateProfile);

// Optional: Get profile by userId
router.get('/:userId', authMiddleware, profileController.getProfile);

export default router;
