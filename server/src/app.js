import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import videosRouter from "./routes/videos.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: false
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/videos", videosRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err?.message?.includes("Only video files")) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Server error" });
});

export default app;
