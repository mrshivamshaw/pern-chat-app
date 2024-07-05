import { Router } from "express";
import { protectroute } from "../middleware/protectroute";
import { getMessages, getUserForChat, sendMessage } from "../controllers/message.controllers";


const messageRoute = Router();

messageRoute.get("/conversation",protectroute, getUserForChat);
messageRoute.post('/send/:id',protectroute, sendMessage);
messageRoute.get('/:id',protectroute,getMessages)

export default messageRoute