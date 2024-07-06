"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.singin = void 0;
const prisma_1 = require("../db/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const singin = async (req, res) => {
    try {
        const { username, password, confirmPassword, firstname, lastname, gender } = req.body;
        if (!username || !password || !confirmPassword || !firstname || !lastname || !gender) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        // console.log(username);
        const existinguser = await prisma_1.prisma.user.findUnique({
            where: {
                username
            }
        });
        if (existinguser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedpassword = await bcrypt_1.default.hash(password, salt);
        const boypic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlpic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const user = await prisma_1.prisma.user.create({
            data: {
                username,
                password: hashedpassword,
                firstname,
                lastname,
                gender,
                profilepic: gender === "male" ? boypic : girlpic
            }
        });
        user.password = "";
        if (user) {
            //generate token
            (0, generateToken_1.default)(user.id, res);
            return res.status(200).json({
                message: "User created successfully",
                success: true,
                user: user
            });
        }
        else {
            return res.status(400).json({
                message: "Something went wrong",
                success: false
            });
        }
    }
    catch (error) {
        console.log("Catch error in singin ", error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};
exports.singin = singin;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            });
        }
        user.password = "";
        //generate token
        (0, generateToken_1.default)(user.id, res);
        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: user
        });
    }
    catch (error) {
        console.log("catch error in login", error);
        return res.status(500).json({
            error: error.message,
            success: false
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully", success: true });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ messsage: error.message, success: false });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.password = "";
        return res.status(200).json({
            user: user,
            success: true,
            message: "User found"
        });
    }
    catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getMe = getMe;
