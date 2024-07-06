import { Router } from "express";
import { protectroute } from "../middleware/protectroute.js";
import { getMessages, getUserForChat, sendMessage } from "../controllers/message.controllers.js";
const messageRoute = Router();
messageRoute.get("/conversation", protectroute, getUserForChat);
messageRoute.post('/send/:id', protectroute, sendMessage);
messageRoute.get('/:id', protectroute, getMessages);
export default messageRoute;
