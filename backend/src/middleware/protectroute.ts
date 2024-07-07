import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma.js";

interface DecodedToken extends JwtPayload {
	userId: string;
}

declare global {
	namespace Express {
		export interface Request {
			user: {
				id: string;
			};
		}
	}
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.jwt;
		// console.log("middle token",token);
		

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No token provided", success: false });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

		if (!decoded) {
			return res.status(401).json({ message: "Unauthorized - Invalid Token", success: false });
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { id: true, username: true, fullName: true, profilePic: true },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found", success: false });
		}

		req.user = user;

		next();
	} catch (error: any) {
		console.log("Error in protectRoute middleware", error.message);
		res.status(500).json({ message: "Internal Server Error", success: false });
	}
};

export default protectRoute;
