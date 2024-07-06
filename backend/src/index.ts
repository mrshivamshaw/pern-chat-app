import express from "express";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { app, server } from "./socket/socket";
import path from 'path'
dotenv.config();

const port = process.env.PORT || 3001;
const __dirname = path.resolve();
app.use(cors(
    {
        origin : ['http://localhost:5173','http://localhost:3000'],
        credentials : true,

    }
));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoute);
app.use('/api/message',messageRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

if (process.env.NODE_ENV !== "development") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(port, () => {
    console.log("Server started on port ",port);
    
})