import mongoose from "mongoose";

const ThumbnailSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    fileUrl: { type: String, required: true },
    thumbnails: [ThumbnailSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
