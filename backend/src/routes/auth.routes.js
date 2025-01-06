import { Router } from "express";
import {
  LoginController,
  LogoutController,
  SignUpController,
} from "../controller/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/signup", SignUpController);
authRoutes.post("/login", LoginController);
authRoutes.post("/logout", LogoutController);

export default authRoutes;
