const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const message = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(message.message || "Request failed");
  }
  return response.json();
}

export async function uploadVideo(formData) {
  return apiFetch("/videos", { method: "POST", body: formData });
}

export async function generateThumbnails(videoId) {
  return apiFetch(`/videos/${videoId}/thumbnails/generate`, { method: "POST" });
}

export async function selectThumbnail(videoId, thumbnailId) {
  return apiFetch(`/videos/${videoId}/thumbnails/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thumbnailId })
  });
}

export async function listVideos({ q, tag }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  return apiFetch(`/videos?${params.toString()}`);
}

export async function getVideo(id) {
  return apiFetch(`/videos/${id}`);
}

export { API_URL };
