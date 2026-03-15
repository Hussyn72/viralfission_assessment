import path from "path";
import Video from "../models/Video.js";
import { generateMockThumbnails, generateVideoThumbnails } from "../services/thumbnailService.js";

export async function uploadVideo(req, res) {
  try {
    const { title, description = "", tags = "" } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const fileUrl = `/uploads/videos/${req.file.filename}`;

    const video = await Video.create({
      title: title.trim(),
      description: description.trim(),
      tags: tagList,
      fileUrl,
      thumbnails: []
    });

    return res.status(201).json({
      videoId: video._id,
      video
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload video" });
  }
}

export async function generateThumbnails(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let generated = [];
    try {
      const videoPath = path.join(process.cwd(), "uploads", "videos", path.basename(video.fileUrl));
      generated = await generateVideoThumbnails({ videoPath, count: 4 });
    } catch (error) {
      generated = await generateMockThumbnails({
        title: video.title,
        count: 4
      });
    }

    const nextThumbs = generated.map((thumb, index) => ({
      ...thumb,
      isPrimary: index === 0
    }));

    video.thumbnails = nextThumbs;
    await video.save();

    return res.json({ thumbnails: video.thumbnails });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate thumbnails" });
  }
}

export async function selectThumbnail(req, res) {
  try {
    const { id } = req.params;
    const { thumbnailId } = req.body;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const target = video.thumbnails.id(thumbnailId);
    if (!target) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    video.thumbnails.forEach((thumb) => {
      thumb.isPrimary = thumb._id.toString() === thumbnailId;
    });

    await video.save();
    return res.json({ thumbnails: video.thumbnails });
  } catch (error) {
    return res.status(500).json({ message: "Failed to select thumbnail" });
  }
}

export async function listVideos(req, res) {
  try {
    const { q, tag } = req.query;
    const query = {};
    if (q) {
      query.title = { $regex: q, $options: "i" };
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const videos = await Video.find(query).sort({ createdAt: -1 });
    const response = videos.map((video) => {
      const primary = video.thumbnails.find((t) => t.isPrimary) || video.thumbnails[0];
      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        tags: video.tags,
        fileUrl: video.fileUrl,
        createdAt: video.createdAt,
        primaryThumbnail: primary || null
      };
    });
    return res.json({ videos: response });
  } catch (error) {
    return res.status(500).json({ message: "Failed to list videos" });
  }
}

export async function getVideo(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    return res.json({ video });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch video" });
  }
}
