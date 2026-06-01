import { Router } from "express";
import userRoute from "./userRoute.js";
import profileRouter from "./profileRoute.js";
const routes = Router();

routes.use('/user',userRoute);
routes.use('/profile',profileRouter);

export default routes;