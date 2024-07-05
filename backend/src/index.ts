import express from "express";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoute);
app.use('/api/message',messageRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
    
})