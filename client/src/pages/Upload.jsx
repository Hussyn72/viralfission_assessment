import { useState } from "react";
import { generateThumbnails, selectThumbnail, uploadVideo } from "../api.js";
import ThumbnailGrid from "../components/ThumbnailGrid.jsx";

export default function Upload() {
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [file, setFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "Uploading..." });
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("tags", form.tags);
      if (file) payload.append("video", file);

      const data = await uploadVideo(payload);
      setVideoId(data.videoId);
      setStatus({ loading: true, message: "Generating thumbnails..." });
      const thumbData = await generateThumbnails(data.videoId);
      setThumbnails(thumbData.thumbnails);
      setStatus({ loading: false, message: "Upload complete." });
    } catch (err) {
      setStatus({ loading: false, message: err.message || "Upload failed" });
    }
  };

  const handleSelect = async (thumbnailId) => {
    if (!videoId) return;
    setStatus({ loading: true, message: "Updating primary thumbnail..." });
    try {
      const data = await selectThumbnail(videoId, thumbnailId);
      setThumbnails(data.thumbnails);
      setStatus({ loading: false, message: "Primary thumbnail updated." });
    } catch (err) {
      setStatus({ loading: false, message: err.message || "Update failed" });
    }
  };

  return (
    <section className="section-card p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-2xl">Upload Video</h2>
          <p className="text-sm text-ink/70 mt-2">
            Add metadata, upload the file, and pick your favorite thumbnail.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm uppercase tracking-widest text-moss">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border-ink/10 bg-white/90 px-4 py-3"
                placeholder="Episode title"
              />
            </div>
            <div>
              <label className="text-sm uppercase tracking-widest text-moss">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full rounded-2xl border-ink/10 bg-white/90 px-4 py-3"
                placeholder="Short summary"
              />
            </div>
            <div>
              <label className="text-sm uppercase tracking-widest text-moss">Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border-ink/10 bg-white/90 px-4 py-3"
                placeholder="design, interview, launch"
              />
            </div>
            <div>
              <label className="text-sm uppercase tracking-widest text-moss">Video file</label>
              <input
                type="file"
                accept="video/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="mt-2 w-full rounded-2xl border-ink/10 bg-white/90 px-4 py-3"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status.loading}
              className="w-full rounded-full bg-ink text-white py-3 text-sm uppercase tracking-widest disabled:opacity-60"
            >
              {status.loading ? "Working..." : "Upload & Generate"}
            </button>
          </form>
          {status.message ? (
            <p className="mt-4 text-sm text-ink/70">{status.message}</p>
          ) : null}
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-display text-xl">Thumbnails</h3>
          <p className="text-sm text-ink/70 mt-2">
            Click one to set it as the primary thumbnail.
          </p>
          <div className="mt-6">
            {thumbnails.length === 0 ? (
              <p className="text-sm text-ink/60">Generate thumbnails after upload.</p>
            ) : (
              <ThumbnailGrid thumbnails={thumbnails} onSelect={handleSelect} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
