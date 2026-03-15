# Thumbnail Generator & Video Gallery (MERN)

Classic MERN stack app for uploading videos, generating mock thumbnails, and browsing a searchable gallery.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (via Mongoose)
- Storage: Local disk for uploaded videos + generated thumbnails

## Setup

### 1) Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
npm run dev
```

Frontend expects the backend at `http://localhost:4000`.
To change it, set `VITE_API_URL` in `client/.env`:
```
VITE_API_URL=http://localhost:4000/api
```

## Notes
- Thumbnails are extracted from the video via ffmpeg/ffprobe. If extraction fails, the server falls back to mocked SVGs.
- Search + filter happen server-side with query params `q` and `tag`.

## API Summary
- `POST /api/videos` (multipart form data: `video`, `title`, `description`, `tags`)
- `POST /api/videos/:id/thumbnails/generate`
- `POST /api/videos/:id/thumbnails/select` (json: `thumbnailId`)
- `GET /api/videos?q=...&tag=...`
- `GET /api/videos/:id`
