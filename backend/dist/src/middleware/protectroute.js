import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
export const protectroute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token found",
                success: false
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
                success: false
            });
        }
        // console.log(decode);
        const user = await prisma.user.findUnique({
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
