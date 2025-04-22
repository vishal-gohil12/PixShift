import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    originalUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true,
    }
});

export const Image = mongoose.model("Image", imageSchema);