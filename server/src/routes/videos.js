import { Router } from "express";
import {
  generateThumbnails,
  getVideo,
  listVideos,
  selectThumbnail,
  uploadVideo
} from "../controllers/videosController.js";
import { uploadVideo as uploadMiddleware } from "../middlewares/upload.js";

const router = Router();

router.post("/", uploadMiddleware.single("video"), uploadVideo);
router.get("/", listVideos);
router.get("/:id", getVideo);
router.post("/:id/thumbnails/generate", generateThumbnails);
router.post("/:id/thumbnails/select", selectThumbnail);

export default router;
