import express from "express";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
dotenv.config();

const app = express();

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

app.listen(3000, () => {
    console.log("Server started on port 3000");
    
})