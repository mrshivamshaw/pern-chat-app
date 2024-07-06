"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./socket/socket");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
socket_1.app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use('/api/auth', auth_route_1.default);
socket_1.app.use('/api/message', message_route_1.default);
socket_1.app.get("/", (req, res) => {
    res.send("Hello World!");
});
if (process.env.NODE_ENV !== "development") {
    socket_1.app.use(express_1.default.static(path_1.default.join(__dirname, "/frontend/dist")));
    socket_1.app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "frontend", "dist", "index.html"));
    });
}
socket_1.server.listen(port, () => {
    console.log("Server started on port ", port);
});
