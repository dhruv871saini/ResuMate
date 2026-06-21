# ResuMate Frontend

Next.js 15 frontend for ResuMate — AI-powered ATS resume optimizer.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in your values in .env.local
npm run dev
```

## .env.local values needed

| Key | Where to get it |
|-----|----------------|
| `NEXT_PUBLIC_API_URL` | Your Express backend URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Settings → API Keys |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Settings → API Keys |

## Cloudinary setup (5 min)

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Settings → API Keys
3. Copy Cloud Name, API Key, API Secret into `.env.local`
4. Cloudinary auto-creates the folder `resumate/resumes/{userId}` on first upload

## What goes to Cloudinary

- **Resume files** (PDF/DOCX) — uploaded when user drags their existing resume
- **Generated PDFs** — Puppeteer on Express generates, sent back to browser directly (not stored on Cloudinary unless you want to save them)

## Architecture

```
Browser → Next.js API route (/api/upload) → Cloudinary
                                                ↓ URL
Browser → Express backend (/profile/parse-resume) → AI parses → JSON profile

Browser → Express backend (/analysis) → Gemini/Groq/Ollama AI → Analysis result
Browser → Express backend (/api/pdf)  → Puppeteer → PDF buffer → download
```

## Backend expected at localhost:3000

Routes used:
- `POST /user/signup` · `POST /user/login`
- `POST /profile` · `PUT /profile` · `GET /profile/:id`
- `POST /profile/parse-resume` — needs { fileUrl, fileType }
- `POST /job_desc` · `GET /job_desc` · `DELETE /job_desc/:id`
- `POST /analysis` · `GET /analysis` · `DELETE /analysis/:id`
- `GET /conversation/usage`
- `POST /api/pdf` — needs { analysisId, template }
