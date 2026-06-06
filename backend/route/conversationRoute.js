import { Router } from 'express';
import { getHistory, getHistoryByJob, getUsage } from '../controller/conversationController.js';
import authMiddleware from '../middleware/native.auth.js';

const conversationRouter = Router();
conversationRouter.use(authMiddleware);

conversationRouter.get('/',            getHistory);       
conversationRouter.get('/usage',       getUsage);         
conversationRouter.get('/job/:jobId',  getHistoryByJob);

export default conversationRouter;