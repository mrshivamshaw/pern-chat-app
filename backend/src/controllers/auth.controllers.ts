import { prisma } from "../db/prisma";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import gnerateToken from "../utils/generateToken";

export const singin = async(req: Request, res : Response) => {
    try {
        const { username, password, confirmPassword, firstname, lastname, gender } = req.body;

        if(!username || !password || !confirmPassword || !firstname || !lastname || !gender){   
            return res.status(400).json({
                message : "All fields are required",
                success : false
            })
        }
        console.log(username);
        
        const existinguser = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if(existinguser){
            return res.status(400).json({
                message : "User already exists",
                success : false
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                message : "Passwords do not match", 
                success : false
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const boypic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlpic =`https://avatar.iran.liara.run/public/girl?username=${username}`

        const user = await prisma.user.create({
            data : {
                username,
                password : hashedpassword,
                firstname,
                lastname,
                gender,
                profilepic : gender === "male" ? boypic : girlpic
            }
        })

        user.password = ""

        if(user) {
            //generate token
            gnerateToken(user.id, res);
            return res.status(200).json({
                message : "User created successfully",
                success : true,
                data : user
            })
        }else{
            return res.status(400).json({
                message : "Something went wrong",
                success : false
            })
        }

    } catch (error: any) {
        console.log("Catch error in singin ",error);
        
        return res.status(500).json({
            message : error.message,
            success : false
        })
    }
}

export const login = async(req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({
                message : "All fields are required",
                success : false
            })
        }
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(!user){
            return res.status(404).json({
                message : "User not found",
                success : false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message : "Invalid credentials",
                success : false
            })
        }

        user.password = "";

        //generate token
        gnerateToken(user.id, res);
        return res.status(200).json({
            message : "Login successful",   
            success : true,
            data : user
        })

    } catch (error : any) {
        console.log("catch error in login", error);
        return res.status(500).json({
            error : error.message,
            success : false
        })
        
    }
}

export const logout = async (req: Request, res: Response) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error: any) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const getMe = async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			profilePic: user.profilepic,
		});
	} catch (error: any) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};