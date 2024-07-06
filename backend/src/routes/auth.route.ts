import { Router } from "express";
import { getMe, login, logout, singin } from "../controllers/auth.controllers.ts";
import { protectroute } from "../middleware/protectroute.ts";

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
