import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
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

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res
        .status(400)
        .json({ message: "Username already exists", success: false });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
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
      generateToken(newUser.id, res);
      newUser.password = "";
      res.status(201).json({
        message: "User created successfully",
        success: true,
        user: newUser,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid user data", success: false });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log("Wrong password");
      
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const userId = user.id;
    generateToken(userId, res);
    user.password = "";
    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: user,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0,httpOnly: true, sameSite: "none", secure: true });
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

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
  } catch (error: any) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
