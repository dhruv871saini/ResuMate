# 🚀 Resumate — AI-Powered ATS Resume Optimizer

<p align="center">
  <img src="docs/logo.png" alt="Resumate Logo" width="120"/>
</p>

<p align="center">

An AI-powered Resume Optimization Platform that helps job seekers improve their resumes for Applicant Tracking Systems (ATS). Upload your resume, analyze it against any job description, receive an ATS compatibility score, AI-powered recommendations, keyword matching, and generate an optimized resume ready for recruiters.

</p>

<p align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge)
![Groq](https://img.shields.io/badge/Fallback-Groq-F55036?style=for-the-badge)
![Ollama](https://img.shields.io/badge/Local-Ollama-000000?style=for-the-badge)

</p>

---

# 🌐 Live Demo

### Frontend

https://your-app.vercel.app

### Backend API

https://your-api.onrender.com

---

# 📸 Application Screenshots

> Replace these images with your own screenshots.

| Dashboard | Resume Upload |
|------------|---------------|
| ![](docs/dashboard.png) | ![](docs/upload.png) |

| ATS Analysis | Resume Optimization |
|--------------|----------------------|
| ![](docs/analysis.png) | ![](docs/optimized.png) |

| PDF Resume | AI Suggestions |
|------------|----------------|
| ![](docs/pdf.png) | ![](docs/chat.png) |

---

# ✨ Features

## Authentication

- Secure User Registration
- JWT Authentication
- Login / Logout
- Password Encryption using bcrypt
- Forgot Password
- Reset Password
- Protected API Routes

---

## Resume Management

- Upload Resume
- PDF Parsing
- Resume Text Extraction
- Resume Storage
- Resume Version Management
- Cloud Storage Integration

---

## Job Description

- Save Multiple Job Descriptions
- Company Information
- Keyword Extraction
- AI Job Analysis

---

## AI Resume Optimization

- ATS Compatibility Score
- Resume Match Percentage
- Keyword Matching
- Missing Skills Detection
- Resume Improvement Suggestions
- Resume Rewriting
- Resume Optimization
- ATS-Friendly Formatting

---

## AI Conversation

- Resume Chat
- Job Description Chat
- Resume Recommendations
- Previous AI Conversations
- Conversation History

---

## PDF Generation

- AI Generated Resume
- Download PDF
- Resume Templates
- Cloud Storage

---

## Dashboard

- User Profile
- Resume History
- Analysis History
- Previous Job Descriptions
- AI Conversation History

---

# 🤖 AI Providers

Resumate supports multiple AI providers to ensure high availability, flexibility, and reliable resume analysis.

| Priority | Provider | Purpose |
|----------|----------|---------|
| 🥇 Primary | Google Gemini | Resume Analysis, ATS Score, Optimization |
| 🥈 Fallback | Groq | High-Speed AI Inference |
| 🥉 Local | Ollama | Offline & Self-hosted AI |

---

## AI Processing Flow

```text
                    User Uploads Resume
                              │
                              ▼
                Upload Job Description
                              │
                              ▼
                 Google Gemini (Primary)
                              │
                    Success?──────────────Yes
                              │
                             No
                              ▼
                      Groq (Fallback)
                              │
                    Success?──────────────Yes
                              │
                             No
                              ▼
                    Ollama (Local Model)
                              │
                              ▼
                ATS Analysis + Optimization
                              │
                              ▼
                    Generate Optimized Resume
                              │
                              ▼
                     Store Results in Database
```

---

## Supported AI Models

### 🥇 Google Gemini

- Gemini 2.5 Flash
- Gemini 2.5 Pro

Used for

- Resume Parsing
- ATS Analysis
- Keyword Matching
- Resume Optimization
- Resume Suggestions
- Resume Generation

---

### 🥈 Groq

Supported Models

- Llama 3.3 70B
- Llama 3.1 8B
- Mixtral 8x7B

Used for

- Fast AI Inference
- Resume Optimization
- ATS Score
- AI Suggestions

---

### 🥉 Ollama

Supported Models

- Llama 3
- Gemma
- Mistral
- DeepSeek
- Qwen

Used for

- Offline Development
- Local AI
- Privacy Focused Deployments

---

# 🏗️ System Architecture

```text
                           +-----------------------+
                           |      User Browser     |
                           +-----------+-----------+
                                       |
                                       |
                                 HTTPS Requests
                                       |
                                       ▼
                          +-------------------------+
                          |   React Frontend        |
                          |        Vercel           |
                          +-----------+-------------+
                                      |
                                      |
                                 REST API
                                      |
                                      ▼
                        +---------------------------+
                        |    Express Backend        |
                        |         Render            |
                        +-----------+---------------+
                                    |
      ---------------------------------------------------------------
      |                     |                    |                   |
      ▼                     ▼                    ▼                   ▼
Google Gemini         Groq API             Ollama API        Cloudinary
Primary AI            Fallback AI          Local AI          Resume Storage

                                    |
                                    ▼
                          Neon PostgreSQL Database
```

---

# ⚙️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Tailwind CSS
- Axios
- React Hook Form
- Context API

---

## Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Multer
- Cloudinary

---

## AI

- Google Gemini
- Groq
- Ollama

---

## Database

- PostgreSQL
- Neon Database

---

## Deployment

| Layer | Service |
|--------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| File Storage | Cloudinary |
| AI | Gemini + Groq + Ollama |


---

# 🚀 Deployment

## Frontend

- **Platform:** Vercel

## Backend

- **Platform:** Render

## Database

- **Platform:** Neon PostgreSQL

## File Storage

- **Platform:** Cloudinary

## AI Providers

- Google Gemini
- Groq
- Ollama

---
