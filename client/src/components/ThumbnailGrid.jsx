import { API_URL } from "../api.js";

export default function ThumbnailGrid({ thumbnails, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {thumbnails.map((thumb) => {
        const url = `${API_URL.replace("/api", "")}${thumb.url}`;
        return (
          <button
            type="button"
            key={thumb._id}
            onClick={() => onSelect(thumb._id)}
            className={`rounded-2xl overflow-hidden border-2 transition ${
              thumb.isPrimary ? "border-moss shadow-soft" : "border-transparent hover:border-ink/20"
            }`}
          >
            <img src={url} alt="thumbnail" className="h-32 w-full object-cover" />
            <div className="px-3 py-2 text-xs uppercase tracking-widest bg-white/80">
              {thumb.isPrimary ? "Primary" : "Select"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
