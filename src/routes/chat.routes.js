import express from 'express';
import { chatController } from "../controller/chat.controller.js";
import { isUser } from "../middleware/auth.js";
const chatRouter = express.Router();

chatRouter.get("/", isUser, chatController.createChat);

export default chatRouter;