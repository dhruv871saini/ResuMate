// lib/api.ts
// All HTTP calls to your Express backend at NEXT_PUBLIC_API_URL

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('resumate_token');
}
export function setToken(t: string) { localStorage.setItem('resumate_token', t); }
export function clearToken() { localStorage.removeItem('resumate_token'); }

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  signup: (name: string, email: string, password: string) =>
    req<{ message: string; user: { id: string; name: string; email: string } }>(
      'POST', '/user/signup', { name, email, password }),

  login: (email: string, password: string) =>
    req<{ token: string }>('POST', '/user/login', { email, password }),

  forgotPassword: (email: string) =>
    req<{ message: string }>('POST', '/user/forget-password', { email }),

  resetPassword: (email: string, code: string, password: string) =>
    req<{ message: string }>('POST', '/user/reset-password', { email, code, password }),
};

// ── Profile ───────────────────────────────────────────────────
export const profileApi = {
  create: (resume_data: object) =>
    req<{ profile: { id: string } }>('POST', '/profile', { resume_data }),

  update: (id: string, resume_data: object) =>
    req<{ profile: { id: string } }>('PUT', '/profile', { id, resume_data }),

  get: (id: string) =>
    req<{ profile: { id: string; resume_data: object } }>('GET', `/profile/${id}`),

  // Send Cloudinary URL → backend downloads + AI parses → returns structured JSON
  parseFromUrl: (fileUrl: string, fileType: string) =>
    req<{ resume_data: object }>('POST', '/profile/parse-resume', { fileUrl, fileType }),
};

// ── Job Descriptions ──────────────────────────────────────────
export const jobApi = {
  create: (title: string, company_name: string, description: string) =>
    req<{ job: { id: string; title: string; company_name: string } }>(
      'POST', '/job_desc', { title, company_name, description }),

  getAll: () =>
    req<{ jobs: Array<{ id: string; title: string; company_name: string; extracted_data: object | null }> }>(
      'GET', '/job_desc'),

  delete: (id: string) => req<{ message: string }>('DELETE', `/job_desc/${id}`),
};

// ── Analysis ──────────────────────────────────────────────────
export const analysisApi = {
  run: (profileId: string, jobDescId: string) =>
    req<{
      analysis: {
        id: string; score: number;
        matched_skills: string[];
        partial_matches: Array<{ required: string; candidate_has: string; confidence: string; note: string }>;
        missing_keywords: string[];
        strengths: string[]; weaknesses: string[];
        suggestions: Array<{ area: string; tip: string }>;
        optimized_resume: {
          summary: string;
          experience: Array<{ company: string; title: string; start: string; end: string; bullets: string[] }>;
          skills: string[]; skills_to_learn: string[];
        };
        job_analysis: object;
      }
    }>('POST', '/analysis', { profileId, jobDescId }),

  getAll: () =>
    req<{
      analyses: Array<{
        id: string; score: number; updated_at: string;
        has_score: boolean; has_optimized: boolean;
        title: string; company_name: string; job_desc_id: string;
      }>
    }>('GET', '/analysis'),

  delete: (id: string) => req<{ message: string }>('DELETE', `/analysis/${id}`),
};

// ── Conversations ─────────────────────────────────────────────
export const conversationApi = {
  getUsage: () =>
    req<{
      usage: {
        total_calls: number; total_tokens: number;
        tokens_today: number; tokens_this_week: number;
      }
    }>('GET', '/conversation/usage'),
};

// ── PDF download — calls Express /api/pdf, streams back blob ──
export async function downloadPDF(analysisId: string, template: string, filename: string) {
  const token = getToken();
  const res = await fetch(`${BASE}/api/pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ analysisId, template }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'PDF failed'); }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
