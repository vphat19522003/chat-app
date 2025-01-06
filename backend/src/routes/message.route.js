import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  getListUserController,
  getUserMessageController,
  sendMessageController,
} from "../controller/message.controller.js";

const messageRoutes = Router();

messageRoutes.get("/users", protectedRoute, getListUserController);
messageRoutes.get("/:id", protectedRoute, getUserMessageController);
messageRoutes.post("/send-message/:id", protectedRoute, sendMessageController);

export default messageRoutes;
