import { Router } from 'express';
import { runAnalysis, getAllAnalyses, getAnalysisById, deleteAnalysis } from '../controller/analysisController.js';
import authMiddleware from '../middleware/native.auth.js';

const analysisRouter = Router();
analysisRouter.use(authMiddleware);

analysisRouter.post('/',    runAnalysis);      
analysisRouter.get('/',     getAllAnalyses);   
analysisRouter.get('/:id',  getAnalysisById); 
analysisRouter.delete('/:id', deleteAnalysis);

export default analysisRouter;