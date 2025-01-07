import { Router } from "express";
import {
  checkAuth,
  LoginController,
  LogoutController,
  SignUpController,
  updateProfileController,
} from "../controller/auth.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const authRoutes = Router();

authRoutes.post("/signup", SignUpController);
authRoutes.post("/login", LoginController);
authRoutes.post("/logout", LogoutController);
authRoutes.put("/updateProfile", protectedRoute, updateProfileController);
authRoutes.get("/check", protectedRoute, checkAuth);

export default authRoutes;
