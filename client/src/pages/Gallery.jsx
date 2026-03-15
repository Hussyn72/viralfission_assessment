import { useEffect, useMemo, useState } from "react";
import { listVideos } from "../api.js";
import VideoCard from "../components/VideoCard.jsx";

export default function Gallery() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    videos.forEach((video) => (video.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [videos]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    listVideos({ q: query, tag })
      .then((data) => {
        if (!mounted) return;
        setVideos(data.videos || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load videos");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [query, tag]);

  return (
    <section className="section-card p-6 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl">Gallery</h2>
          <p className="text-sm text-ink/70 mt-2">
            Search by title or filter by tag. Results are fetched from the API.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles"
            className="rounded-full border-ink/10 bg-white/80 px-4 py-2 text-sm"
          />
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="rounded-full border-ink/10 bg-white/80 px-4 py-2 text-sm"
          >
            <option value="">All tags</option>
            {uniqueTags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink/60">Loading videos...</p>
      ) : error ? (
        <p className="mt-8 text-sm text-red-600">{error}</p>
      ) : videos.length === 0 ? (
        <p className="mt-8 text-sm text-ink/60">No videos yet. Upload one to get started.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </section>
  );
}
