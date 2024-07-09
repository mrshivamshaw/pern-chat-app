"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_js_1 = __importDefault(require("../utils/generateToken.js"));
const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res
                .status(400)
                .json({ message: "Please fill in all fields", success: false });
        }
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ message: "Passwords don't match", success: false });
        }
        const user = await prisma_js_1.default.user.findUnique({ where: { username } });
        if (user) {
            return res
                .status(400)
                .json({ message: "Username already exists", success: false });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = await prisma_js_1.default.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        });
        if (newUser) {
            // generate token in a sec
            (0, generateToken_js_1.default)(newUser.id, res);
            newUser.password = "";
            res.status(201).json({
                message: "User created successfully",
                success: true,
                user: newUser,
            });
        }
        else {
            return res
                .status(400)
                .json({ message: "Invalid user data", success: false });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message, success: false });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma_js_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid credentials", success: false });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Wrong password");
            return res
                .status(400)
                .json({ message: "Invalid credentials", success: false });
        }
        const userId = user.id;
        (0, generateToken_js_1.default)(userId, res);
        user.password = "";
        return res.status(200).json({
            message: "Logged in successfully",
            success: true,
            user: user,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ message: error.message, success: false });
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
        res.status(500).json({ message: error.message, success: false });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await prisma_js_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", success: false });
        }
        user.password = "";
        res.status(200).json({
            message: "User found successfully",
            success: true,
            user: user,
        });
    }
    catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
exports.getMe = getMe;
