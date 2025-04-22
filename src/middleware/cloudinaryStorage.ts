import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'image-service',
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        transformation: [{ quality: 'auto' }],
    } as any,
});

export const upload = multer({ storage });