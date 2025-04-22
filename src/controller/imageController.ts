import { Response } from "express";
import { RequsetUser } from "../middleware/authorization";
import { Image } from "../model/Image";
import { ImageTransformationOptions } from "../types/types";
import axios from "axios";
import sharp from "sharp";

class ImageController {
    static async uploadImage(req: RequsetUser, res: Response) {
        try {
            const userId = req.user?.id;
            const file = req.file;

            const newImg = new Image({
                user: userId,
                originalUrl: file?.path,
                cloudinaryId: file?.filename,
            });

            await newImg.save();
            res.status(201).json({ success: true, image: newImg });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Image upload failed' });
            return;
        }
    }

    static async getImage(req: RequsetUser, res: Response) {
        try {
            const userId = req.user?.id;
            const images = await Image.find({ user: userId });

            res.status(200).json({ success: true, images });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to fetch images" });
        }
    }

    static async getImageById(req: RequsetUser, res: Response) {
        try {
            const imageId = req.params.id;

            const image = await Image.findById(imageId);
            if (!image) {
                res.status(404).json({ success: false, message: "Image not found" });
                return;
            }

            res.status(200).json({ success: true, image });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to fetch image" });
        }
    }

    static async transformImage(req: RequsetUser, res: Response) {
        try {
            const imageId = req.params.id;
            const transformations: ImageTransformationOptions = req.body.transformations;

            const imageDoc = await Image.findById(imageId);
            if (!imageDoc) {
                res.status(404).json({ success: false, message: "Image not found" });
                return;
            }

            const imageRes = await axios.get(imageDoc.originalUrl, {
                responseType: "arraybuffer"
            });

            let pipeline = sharp(imageRes.data);
            if (transformations.resize) {
                pipeline = pipeline.resize({
                    width: transformations.resize.width,
                    height: transformations.resize.height
                });
            }

            if (transformations.crop) {
                pipeline = pipeline.extract({
                    width: transformations.crop.width,
                    height: transformations.crop.height,
                    left: transformations.crop.x,
                    top: transformations.crop.y
                })
            }

            if (typeof transformations.rotate === "number") {
                pipeline = pipeline.rotate(transformations.rotate);
            }

            if (transformations.filters) {
                if (transformations.filters.grayscale) {
                    pipeline = pipeline.grayscale();
                }
                if (transformations.filters.sepia) {
                    pipeline = pipeline.modulate({
                        saturation: 0.3,
                        brightness: 1.05
                    }).tint('#704214');
                }
            }

            if (transformations.format) {
                pipeline = pipeline.toFormat(transformations.format);
            }

            const buffer = await pipeline.toBuffer();
            res.set("Content-Type", `image/${transformations.format || "jpeg"}`);
            res.send(buffer);

        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Image transformation failed" });
        }
    }
}

export default ImageController;