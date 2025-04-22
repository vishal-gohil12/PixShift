import { Router } from "express";
import { authorizations } from "../middleware/authorization";
import { upload } from "../middleware/cloudinaryStorage";
import ImageController from "../controller/imageController";
import { transformLimiter } from "../middleware/rateLimit";

export const imageRoute = Router();

imageRoute.get("/getAll", authorizations, ImageController.getImage);
imageRoute.get("/:id", authorizations, ImageController.getImageById);

imageRoute.post('/upload', authorizations, upload.single('image'), transformLimiter, ImageController.uploadImage);
imageRoute.post("/transform/:id", authorizations, transformLimiter, ImageController.transformImage);