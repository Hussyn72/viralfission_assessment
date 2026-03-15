import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

const thumbnailsDir = path.join(process.cwd(), "uploads", "thumbnails");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const palette = ["#203A43", "#2C5364", "#C1A875", "#F3E9DC", "#5B2C6F", "#1F6F8B"];

function pickColor(index) {
  return palette[index % palette.length];
}

function buildSvg({ title, index, color }) {
  const safeTitle = (title || "Video").slice(0, 22);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#111"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#g)"/>
  <rect x="24" y="24" width="592" height="312" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)"/>
  <text x="48" y="120" font-family="'Georgia', serif" font-size="36" fill="#F8F1E7">${safeTitle}</text>
  <text x="48" y="170" font-family="'Georgia', serif" font-size="20" fill="#E8DAC6">Thumbnail ${index + 1}</text>
  <circle cx="540" cy="270" r="42" fill="#F8F1E7"/>
  <polygon points="528,250 575,270 528,290" fill="#2C5364"/>
</svg>`;
}

export async function generateMockThumbnails({ title, count }) {
  const thumbs = [];
  for (let i = 0; i < count; i += 1) {
    const filename = `${Date.now()}-${nanoid(6)}.svg`;
    const svg = buildSvg({ title, index: i, color: pickColor(i) });
    await fs.writeFile(path.join(thumbnailsDir, filename), svg, "utf8");
    thumbs.push({ url: `/uploads/thumbnails/${filename}` });
  }
  return thumbs;
}

function getDurationSeconds(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, data) => {
      if (err) return reject(err);
      const duration = data?.format?.duration || 0;
      return resolve(duration);
    });
  });
}

function buildTimestamps(duration, count) {
  if (!duration || duration <= 0.5) {
    return Array.from({ length: count }, (_, i) => Math.max(0.1, 0.1 * (i + 1)));
  }
  return Array.from({ length: count }, (_, i) => ((i + 1) * duration) / (count + 1));
}

export async function generateVideoThumbnails({ videoPath, count }) {
  const duration = await getDurationSeconds(videoPath);
  const timestamps = buildTimestamps(duration, count);
  const baseName = `${path.parse(videoPath).name}-${Date.now()}-${nanoid(4)}`;

  return new Promise((resolve, reject) => {
    let filenames = [];
    ffmpeg(videoPath)
      .on("filenames", (names) => {
        filenames = names;
      })
      .on("end", () => {
        const thumbs = filenames.map((name) => ({ url: `/uploads/thumbnails/${name}` }));
        resolve(thumbs);
      })
      .on("error", (error) => reject(error))
      .screenshots({
        timestamps,
        filename: `${baseName}-%i.png`,
        folder: thumbnailsDir,
        size: "640x360"
      });
  });
}
