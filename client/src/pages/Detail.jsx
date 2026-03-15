import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL, getVideo, selectThumbnail } from "../api.js";
import ThumbnailGrid from "../components/ThumbnailGrid.jsx";

export default function Detail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getVideo(id)
      .then((data) => {
        if (!mounted) return;
        setVideo(data.video);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load video");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSelect = async (thumbnailId) => {
    if (!video) return;
    try {
      const data = await selectThumbnail(video._id, thumbnailId);
      setVideo((prev) => ({ ...prev, thumbnails: data.thumbnails }));
    } catch (err) {
      setError(err.message || "Failed to update thumbnail");
    }
  };

  if (loading) {
    return <p className="text-sm text-ink/60">Loading video...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!video) {
    return <p className="text-sm text-ink/60">Video not found.</p>;
  }

  const videoUrl = `${API_URL.replace("/api", "")}${video.fileUrl}`;

  return (
    <section className="section-card p-6 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <video
            controls
            className="w-full rounded-3xl shadow-soft bg-black"
            src={videoUrl}
          />
          <h2 className="font-display text-3xl mt-6">{video.title}</h2>
          <p className="text-sm text-ink/70 mt-2">{video.description || "No description"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(video.tags || []).map((tag) => (
              <span key={`${video._id}-${tag}`} className="text-xs bg-sand px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-display text-xl">All thumbnails</h3>
          <p className="text-sm text-ink/70 mt-2">Primary thumbnail is highlighted.</p>
          <div className="mt-6">
            {video.thumbnails?.length ? (
              <ThumbnailGrid thumbnails={video.thumbnails} onSelect={handleSelect} />
            ) : (
              <p className="text-sm text-ink/60">No thumbnails generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
