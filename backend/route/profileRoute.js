import express from 'express';
import * as profileController from '../controller/profileController.js';
import authMiddleware from '../middleware/native.auth.js';

const profileRouter = express.Router();

// Protected routes - requires authentication
profileRouter.post('/', authMiddleware, profileController.createProfile);
profileRouter.put('/', authMiddleware, profileController.updateProfile);

// Optional: Get profile by userId
profileRouter.get('/:userId', authMiddleware, profileController.getProfile);

export default profileRouter;
