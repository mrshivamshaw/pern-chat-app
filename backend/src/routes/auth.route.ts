import { Router } from "express";
import { getMe, login, logout, singin } from "../controllers/auth.controllers.js";
import { protectroute } from "../middleware/protectroute.js";

const authRoute = Router();

// login route
authRoute.post("/login", login)

 // logout route
authRoute.get("/logout", logout)
//signup route
authRoute.post("/signin", singin)  
//get user route
authRoute.get("/user", protectroute, getMe)

export default authRoute
