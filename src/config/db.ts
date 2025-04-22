import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDb = async () => {
    const mongoUrl = process.env.DB_URL?.trim();

    if (!mongoUrl) {
        console.error("❌ DB_URL is not set or is empty in the environment variables.");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ Database is connected.");
    } catch (error) {
        console.error("❌ Failed to connect to the database:", error);
    }
};
