"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, res) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    if (!token) {
        console.error("Error in generating token");
        return res.status(500).json({ message: "Error in generating token", success: false });
    }
    // console.log("Generated Token:", token);
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // prevent XSS cross site scripting
        sameSite: "none", // CSRF attack cross-site request forgery
        secure: true, // Set to false for development
    });
    return token;
};
exports.default = generateToken;
