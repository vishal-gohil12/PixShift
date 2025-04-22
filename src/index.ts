import express from "express";
import cors from "cors";
import { userRoute } from "./route/userRoute";
import { connectDb } from "./config/db";
import { imageRoute } from "./route/imageRoute";
import * as dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

const app = express();
const port = process.env.PORT;

connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/image", imageRoute);

app.get("/", (req, res) => {
  res.send("Hello world");
})

app.listen(port, () => console.log(`[server] : localhost:${port}`));