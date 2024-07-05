import jwt from "jsonwebtoken";
import { Response } from "express";

const gnerateToken = (userId : string, res : Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "15d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}

export default gnerateToken