import { Router } from "express";
import * as authController from "../controller/authController.js";

const userRoute = Router();

userRoute.post("/signup", authController.signup);
userRoute.post("/login", authController.login);

export default userRoute;