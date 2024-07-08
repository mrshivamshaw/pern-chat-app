"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
const message_route_js_1 = __importDefault(require("./routes/message.route.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_js_1 = require("./socket/socket.js");
dotenv_1.default.config();
const PORT = process.env.PORT || 5001;
const __dirname = path_1.default.resolve();
socket_js_1.app.use((0, cookie_parser_1.default)()); // for parsing cookies
socket_js_1.app.use(express_1.default.json()); // for parsing application/json
socket_js_1.app.use((0, cors_1.default)({
    origin: ["https://pern-chat-app.vercel.app/"], // Adjust the origins as necessary
    credentials: true
}));
socket_js_1.app.use("/api/auth", auth_route_js_1.default);
socket_js_1.app.use("/api/messages", message_route_js_1.default);
socket_js_1.server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
