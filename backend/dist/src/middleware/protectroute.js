"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectroute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../db/prisma");
const protectroute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token found",
                success: false
            });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
                success: false
            });
        }
        // console.log(decode);
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: decode.userId
            },
            select: {
                id: true,
                username: true,
                profilepic: true,
                firstname: true,
                lastname: true
            }
        });
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found",
                success: false
            });
        }
        // console.log(user);
        req.user = user;
        next();
    }
    catch (error) {
    }
};
exports.protectroute = protectroute;
