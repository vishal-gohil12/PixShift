import { Router } from "express";
import UserController from "../controller/userController";

export const userRoute = Router();

userRoute.post("/register", UserController.createUser);
userRoute.post("/login", UserController.login);
