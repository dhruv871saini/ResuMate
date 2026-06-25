import express from 'express';
import * as profileController from '../controller/profileController.js';
import authMiddleware from '../middleware/native.auth.js';

const profileRouter = express.Router();

profileRouter.post('/', authMiddleware, profileController.createProfile);
profileRouter.put('/', authMiddleware, profileController.updateProfile);

profileRouter.post('/parse-resume',  authMiddleware, profileController.parseResume);
profileRouter.get('/:userId', authMiddleware, profileController.getProfile);
export default profileRouter;
