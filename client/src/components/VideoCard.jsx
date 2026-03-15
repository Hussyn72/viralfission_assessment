import { Link } from "react-router-dom";
import { API_URL } from "../api.js";

export default function VideoCard({ video }) {
  const thumbUrl = video.primaryThumbnail?.url
    ? `${API_URL.replace("/api", "")}${video.primaryThumbnail.url}`
    : null;

  return (
    <Link
      to={`/videos/${video._id}`}
      className="group glass-panel overflow-hidden transition hover:-translate-y-1"
    >
      <div className="h-44 bg-ink/10 flex items-center justify-center">
        {thumbUrl ? (
          <img src={thumbUrl} alt={video.title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-ink/60">No thumbnail yet</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl text-ink">{video.title}</h3>
        <p className="text-xs uppercase tracking-widest text-moss mt-2">
          {new Date(video.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(video.tags || []).slice(0, 3).map((tag) => (
            <span
              key={`${video._id}-${tag}`}
              className="text-xs bg-sand text-ink px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
