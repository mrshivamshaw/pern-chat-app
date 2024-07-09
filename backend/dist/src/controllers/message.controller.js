"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForSidebar = exports.getMessages = exports.sendMessage = void 0;
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const socket_js_1 = require("../socket/socket.js");
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma_js_1.default.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        // the very first message is being sent, that's why we need to create a new conversation
        if (!conversation) {
            conversation = await prisma_js_1.default.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        const newMessage = await prisma_js_1.default.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = await prisma_js_1.default.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                    messageIds: {
                        push: newMessage.id,
                    }
                },
            });
        }
        // Socket io will go here
        const receiverSocketId = (0, socket_js_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_js_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            newMessage: newMessage,
        });
    }
    catch (error) {
        console.error("Error in sendMessage: ", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};
exports.sendMessage = sendMessage;
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma_js_1.default.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            return res.status(200).json({
                message: "No conversation found",
                success: false,
                conversation: [],
            });
        }
        return res.status(200).json({
            message: "Conversation found",
            success: true,
            conversation: conversation.messages
        });
    }
    catch (error) {
        console.error("Error in getMessages: ", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};
exports.getMessages = getMessages;
const getUsersForSidebar = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma_js_1.default.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });
        if (!users) {
            return res
                .status(404)
                .json({ message: "Users not found", success: false });
        }
        res.status(200).json({ users, success: true });
    }
    catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};
exports.getUsersForSidebar = getUsersForSidebar;
