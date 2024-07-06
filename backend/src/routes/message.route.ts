import { Router } from "express";
import { protectroute } from "../middleware/protectroute.ts";
import { getMessages, getUserForChat, sendMessage } from "../controllers/message.controllers.ts";


const messageRoute = Router();

messageRoute.get("/conversation",protectroute, getUserForChat);
messageRoute.post('/send/:id',protectroute, sendMessage);
messageRoute.get('/:id',protectroute,getMessages)

export default messageRoute