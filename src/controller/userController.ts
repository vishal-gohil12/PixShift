import { Request, Response } from "express";
import { User } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

type UserType = {
    username: string;
    password: string;
}

class UserController {
    static async createUser(req: Request, res: Response) {
        const { username, password }: UserType = req.body;

        if (!username && !password) {
            res.status(404).json({
                status: false,
                message: "username and password is require"
            });
            return;
        }

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                res.status(409).json({
                    status: false,
                    message: "Username already exists.",
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, password: hashedPassword });

            const secret = process.env.JWT_SECRET;
            if(!secret) {
                res.status(409).json({
                    status: false,
                    message: "token is not loaded.",
                });
                return;
            }

            const token = jwt.sign({ id: user._id, username: user.username }, secret, {
                expiresIn: "1h",
            });

            res.status(201).json({
                status: true,
                message: "User created successfully.",
                token,
            });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({
                status: false,
                message: "Server error.",
            });
            return;
        }
    }

    static async login(req: Request, res: Response) {
        const { username, password }: UserType = req.body;

        if (!username || !password) {
            res.status(400).json({
                status: false,
                message: "Username and password are required.",
            });
            return
        }

        try {
            const user = await User.findOne({ username });
            if (!user) {
                res.status(401).json({
                    status: false,
                    message: "Invalid credentials.",
                });
                return
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    status: false,
                    message: "Invalid credentials.",
                });
                return
            }

            const secret = process.env.JWT_SECRET;
            if(!secret) {
                res.status(409).json({
                    status: false,
                    message: "token is not loaded.",
                });
                return;
            }

            const token = jwt.sign({ id: user._id, username: user.username }, secret, {
                expiresIn: "1h",
            });

            res.status(200).json({
                status: true,
                message: "Login successful.",
                token,
            });
            return
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({
                status: false,
                message: "Server error.",
            });
            return
        }
    }
}

export default UserController;