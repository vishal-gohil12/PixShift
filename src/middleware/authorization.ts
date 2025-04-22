import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
interface jwtPayload {
    id: string;
    username: string;
}

export interface RequsetUser extends Request {
    user?: jwtPayload
}

export const authorizations = async (req: RequsetUser, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT_SECRET is not defined in environment variables");
            res.status(500).json({ message: "Server configuration error" });
            return;
        }

        const decode = jwt.verify(token, secret);
        req.user = decode as jwtPayload;

        next();
    } catch (error) {
        console.error("Token verification error:", error);

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({
                message: "Invalid token signature",
                error: error.message
            });
            return;
        }

        res.status(403).json({
            message: "Token validation failed",
            error: error instanceof Error ? error.message : String(error)
        });
        return;
    }
}