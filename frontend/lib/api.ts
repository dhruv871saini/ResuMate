// lib/api.ts  (updated pdf section — replace the old downloadPDF function)
//
// Old flow: POST /api/pdf → streams raw PDF bytes back → browser download
// New flow: POST /api/pdf → Puppeteer → Cloudinary → returns { pdfUrl }
//           Frontend opens the Cloudinary URL directly

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

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    req<{ message: string; user: { id: string; name: string; email: string } }>(
      'POST', '/user/signup', { name, email, password }),
  login: (email: string, password: string) =>
    req<{ token: string }>('POST', '/user/login', { email, password }),
  forgotPassword: (email: string) =>
    req<{ message: string }>('POST', '/user/forget', { email }),
  resetPassword: (email: string, code: string, password: string) =>
    req<{ message: string }>('POST', '/user/reset', { email, code, password }),
};

export const profileApi = {
  create: (resume_data: object) =>
    req<{ profile: { id: string; resume_data: object } }>('POST', '/profile', { resume_data }),
  update: (id: string, resume_data: object) =>
    req<{ profile: { id: string; resume_data: object } }>('PUT', '/profile', { id, resume_data }),
  get: (id: string) =>
    req<{ profile: { id: string; resume_data: object } }>('GET', `/profile/${id}`),
  parseFromUrl: (fileUrl: string, fileType: string) =>
    req<{ resume_data: object }>('POST', '/profile/parse-resume', { fileUrl, fileType }),
};

export const jobApi = {
  create: (title: string, company_name: string, description: string) =>
    req<{ job: { id: string; title: string; company_name: string } }>(
      'POST', '/job_desc', { title, company_name, description }),
  getAll: () =>
    req<{ jobs: Array<{ id: string; title: string; company_name: string; extracted_data: object | null }> }>(
      'GET', '/job_desc'),
  delete: (id: string) => req<{ message: string }>('DELETE', `/job_desc/${id}`),
};

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
        pdf_url?: string; pdf_template?: string;
      }>
    }>('GET', '/analysis'),
  delete: (id: string) => req<{ message: string }>('DELETE', `/analysis/${id}`),
};

// ── PDF: generate, upload to Cloudinary, get saved resumes ───────────────────
export const pdfApi = {
  // Generate PDF → upload to Cloudinary → returns the Cloudinary URL
  generate: (analysisId: string, template: string) =>
    req<{ pdfUrl: string; template: string; analysisId: string }>(
      'POST', '/api/pdf', { analysisId, template }),

  // Get all previously generated PDFs for this user
  getMyResumes: () =>
    req<{
      resumes: Array<{
        id: string; score: number; pdf_url: string; pdf_template: string;
        pdf_created_at: string; job_title: string; company: string;
      }>
    }>('GET', '/api/pdf/resumes'),

  // Get available templates
  getTemplates: () =>
    req<{ templates: Array<{ id: string; label: string; description: string }> }>(
      'GET', '/api/pdf/templates'),
};

export const conversationApi = {
  getUsage: () =>
    req<{ usage: { total_calls: number; total_tokens: number; tokens_today: number; tokens_this_week: number } }>(
      'GET', '/conversation/usage'),
};

export async function downloadPDF(analysisId: string, template: string, _filename: string) {
  const { pdfUrl } = await pdfApi.generate(analysisId, template);
  window.open(pdfUrl, '_blank');
}
