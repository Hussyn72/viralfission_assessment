import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

const videosDir = path.join(process.cwd(), "uploads", "videos");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, `${Date.now()}-${nanoid(6)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

export const uploadVideo = multer({ storage, fileFilter });
