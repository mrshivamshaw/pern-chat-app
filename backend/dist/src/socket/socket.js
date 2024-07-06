import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});
export const getReciversSocketId = (reciversId) => {
    return userSocketmap[reciversId];
};
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
export { io, server, app };
