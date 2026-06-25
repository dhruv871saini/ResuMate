import { Router } from "express";
import authMiddleware from "../middleware/native.auth.js";
import * as jobDescription from "../controller/job_descConstroller.js"
const job_desc = Router();


job_desc.get('/', authMiddleware, jobDescription.getAllDescriptions);
job_desc.post('/',authMiddleware,jobDescription.createDescription);
job_desc.put('/',authMiddleware,jobDescription.updateDescription);
job_desc.delete('/:id',authMiddleware,jobDescription.deleteDescription);


export default job_desc;