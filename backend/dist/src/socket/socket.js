"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = exports.io = exports.getReciversSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});
exports.io = io;
const getReciversSocketId = (reciversId) => {
    return userSocketmap[reciversId];
};
exports.getReciversSocketId = getReciversSocketId;
const userSocketmap = {}; //userId : socketId
io.on("connection", socket => {
    //console.log("a user connected",socket.id);
    const userId = socket.handshake.query.userId;
    if (userId)
        userSocketmap[userId] = socket.id;
    //io.emit is used to send message to all connected users
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
    //sockect.on is used to listen for events both from client and server
    socket.on("disconnect", () => {
        //console.log("a user disconnected",socket.id);
        delete userSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketmap));
    });
});
