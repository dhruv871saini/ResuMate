import { Router } from "express";
import userRoute from "./userRoute.js";
import profileRouter from "./profileRoute.js";
import job_desc from "./job_descRoute.js";
import conversationRouter from "./conversationRoute.js";
import analysisRouter from "./analysisRoute.js";
import pdfRouter from "./pdfRoute.js";
const routes = Router();

routes.use('/user',userRoute);
routes.use('/profile',profileRouter);
routes.use('/job_desc',job_desc);
routes.use('/converstion',conversationRouter);
routes.use('/analysis',analysisRouter)
routes.use('/pdf',pdfRouter)

export default routes;