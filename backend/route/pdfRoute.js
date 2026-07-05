import express from "express";
import {
  generateAndUploadPDF,
  getMyResumes,
  getTemplates,
} from "../controller/pdfController.js";
import authMiddleware from "../middleware/native.auth.js";

const pdfRouter = express.Router();
pdfRouter.use(authMiddleware);

pdfRouter.post("/", generateAndUploadPDF);
pdfRouter.get("/resumes", getMyResumes);
pdfRouter.get("/templates", getTemplates);

export default pdfRouter;
