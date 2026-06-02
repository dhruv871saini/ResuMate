import { Router } from "express";
import userRoute from "./userRoute.js";
import profileRouter from "./profileRoute.js";
import job_desc from "./job_descRoute.js";
const routes = Router();

routes.use('/user',userRoute);
routes.use('/profile',profileRouter);
routes.use('/job_desc',job_desc);

export default routes;