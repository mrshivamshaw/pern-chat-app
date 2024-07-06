"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserForChat = exports.getMessages = exports.sendMessage = void 0;
const prisma_1 = require("../db/prisma");
const socket_1 = require("../socket/socket");
const sendMessage = async (req, res) => {
    try {
        const { id: reciversid } = req.params;
        const { message } = req.body;
        const senderId = req.user.id;
        // console.log(reciversid, message, senderId);
        if (!senderId || !message || !reciversid) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        let conversation = await prisma_1.prisma.conversations.findFirst({
            where: {
                participantsid: {
                    hasEvery: [senderId, reciversid]
                }
            }
        });
        if (!conversation) {
            conversation = await prisma_1.prisma.conversations.create({
                data: {
                    participantsid: [senderId, reciversid]
                }
            });
        }
        const newMessage = await prisma_1.prisma.message.create({
            data: {
                senderid: senderId,
                body: message,
                conversationid: conversation.id
            }
        });
        if (newMessage) {
            conversation = await prisma_1.prisma.conversations.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                }
            });
        }
        const receiverSocketId = (0, socket_1.getReciversSocketId)(reciversid);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(200).json({ message: "Message sent successfully", success: true, data: newMessage });
    }
    catch (error) {
        console.log("Catch Error in sendMessage controller", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};
exports.sendMessage = sendMessage;
const getMessages = async (req, res) => {
    try {
        const { id: uerToChat } = req.params;
        const userId = req.user.id;
        if (!uerToChat || !userId) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        // console.log(uerToChat, userId);
        const conversation = await prisma_1.prisma.conversations.findMany({
            where: {
                participantsid: {
                    hasEvery: [userId, uerToChat]
                }
            },
            include: {
                messages: true
            }
        });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found", success: false });
        }
        return res.status(200).json({ message: "Conversation found", success: true, messages: conversation[0]?.messages });
    }
    catch (error) {
        console.log("Catch Error in getMessages controller", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};
exports.getMessages = getMessages;
const getUserForChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await prisma_1.prisma.user.findMany({
            where: {
                id: {
                    not: userId
                }
            },
            select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                profilepic: true
            }
        });
        return res.status(200).json({ message: "Users found", success: true, data: users });
    }
    catch (error) {
        console.log("Error in getUserForChat controller", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};
exports.getUserForChat = getUserForChat;
