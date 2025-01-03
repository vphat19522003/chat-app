import { Router } from "express";
import { LoginController } from "../controller/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login", LoginController);

export default authRoutes;
