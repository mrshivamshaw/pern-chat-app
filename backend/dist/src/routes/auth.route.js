"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const protectroute_1 = require("../middleware/protectroute");
const authRoute = (0, express_1.Router)();
// login route
authRoute.post("/login", auth_controllers_1.login);
// logout route
authRoute.get("/logout", auth_controllers_1.logout);
//signup route
authRoute.post("/signin", auth_controllers_1.singin);
//get user route
authRoute.get("/user", protectroute_1.protectroute, auth_controllers_1.getMe);
exports.default = authRoute;
