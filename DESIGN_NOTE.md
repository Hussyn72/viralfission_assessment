# Design Note

## Architecture
- `client/`: React + Vite frontend.
- `server/`: Express API with Mongoose models.
- Static files served from `server/uploads`.

## Database Schema
`Video`
- `title` (string, required)
- `description` (string)
- `tags` (array of strings)
- `fileUrl` (string)
- `thumbnails` (array of subdocuments)

`Thumbnail` (subdocument)
- `url` (string)
- `isPrimary` (boolean)
- timestamps

## Thumbnail Generation
Primary approach uses ffmpeg to extract 4 frames from the uploaded video and saves them to `server/uploads/thumbnails`. If ffmpeg extraction fails for any reason, the server falls back to mocked SVG thumbnails.

## Search & Filters
Server-side in `GET /api/videos` with `q` (case-insensitive title match) and `tag` (exact match). The client passes user inputs as query params.

## Trade-offs
- Mocked thumbnails instead of real frame extraction.
- Local disk storage instead of cloud storage.
- Minimal validation and no authentication to keep the timebox.
