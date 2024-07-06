import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import dotenv from "dotenv";
import { app, server } from "./socket/socket.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirpath = dirname(__filename);  // Use a different variable name

const PORT = process.env.PORT || 5001;

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV !== "development") {
    app.use(express.static(path.join(__dirpath, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirpath, "frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
