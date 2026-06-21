// store/useStore.ts — full store with real API + Cloudinary upload
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, profileApi, jobApi, analysisApi, setToken, clearToken } from "@/lib/api";

export interface Experience {
  id: string; title: string; company: string;
  start: string; end: string; current: boolean; bullets: string;
}
export interface Project {
  id: string; name: string; year: string; stack: string; desc: string; url: string;
}
export interface Certification { id: string; name: string; issuer: string; }
export interface JobDescription {
  id: string; title: string; company: string; description: string;
  score?: number; analyzed: boolean; addedAt: string;
}
export interface AnalysisResult {
  id: string; jobId: string; score: number;
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
}
export interface ResumeProfile {
  name: string; role: string; email: string; phone: string;
  linkedin: string; github: string; summary: string; skills: string[];
  experience: Experience[]; projects: Project[]; certifications: Certification[];
  degree: string; school: string; eduStart: string; eduEnd: string;
}

interface AppState {
  // Auth
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  profileId: string | null;
  token: string | null;
  loginWithApi: (email: string, password: string) => Promise<void>;
  signupWithApi: (name: string, email: string, password: string) => Promise<void>;
  login: (name: string, email: string) => void;
  logout: () => void;

  // Theme + template
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeTemplate: "modern" | "classic" | "purple" | "minimal";
  setTemplate: (t: "modern" | "classic" | "purple" | "minimal") => void;

  // Profile
  profile: ResumeProfile;
  updateProfile: (data: Partial<ResumeProfile>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  saveProfileToBackend: () => Promise<void>;

  // Cloudinary upload state
  uploadedFileUrl: string | null;
  setUploadedFileUrl: (url: string | null) => void;

  // Jobs
  jobs: JobDescription[];
  addJob: (job: { title: string; company: string; description: string }) => Promise<void>;
  fetchJobs: () => Promise<void>;
  removeJob: (id: string) => Promise<void>;

  // Analysis
  analyses: Record<string, AnalysisResult>;
  runAnalysis: (jobId: string) => Promise<void>;
  fetchAnalyses: () => Promise<void>;
  analyzingJobId: string | null;

  // Toast
  toast: { message: string; type: "ok" | "err" | "info" } | null;
  showToast: (message: string, type?: "ok" | "err" | "info") => void;
  clearToast: () => void;
}

const defaultProfile: ResumeProfile = {
  name: "Dhruv Saini", role: "Software Development Engineer",
  email: "dhruvsaini871@gmail.com", phone: "+91 7011643240",
  linkedin: "linkedin.com/in/dhruv-saini-a88482241", github: "github.com/dhruv871saini",
  summary: "Software Engineer with 1+ years of experience building scalable OTT, video streaming, and media-heavy applications across React Native, React, Node.js, and TypeScript.",
  skills: ["React Native","React.js","Node.js","Express.js","TypeScript","JavaScript","PostgreSQL","MongoDB","Redis","AWS SQS/S3","Docker","RabbitMQ","REST APIs","Microservices","Git"],
  experience: [{
    id: "exp-1", title: "Software Development Engineer I", company: "Mogi I/O",
    start: "April 2025", end: "", current: true,
    bullets: "Refactored 3-service microservice chain into Redis-coordinated architecture, reducing p95 API latency by 85% (2000ms → 300ms)\nRebuilt Continue Watching using async write-behind with AWS SQS, MongoDB, and Redis",
  }],
  projects: [
    { id: "proj-1", name: "Transformer — Media Transcoding Engine", year: "2026", stack: "Node.js, RabbitMQ, FFmpeg, HLS, AWS S3", desc: "Upload-to-playback pipeline with 4 ladder renditions, HLS packaging, async orchestration.", url: "" },
    { id: "proj-2", name: "Chatter Box", year: "2025", stack: "Node.js, Socket.io, MongoDB, React", desc: "WhatsApp-inspired 1:1 chat with event-driven Node.js server and server-backed message persistence.", url: "" },
  ],
  certifications: [],
  degree: "Bachelor of Computer Applications", school: "Indira Gandhi National Open University",
  eduStart: "July 2022", eduEnd: "July 2025",
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────
      isLoggedIn: false, user: null, profileId: null, token: null,

      loginWithApi: async (email, password) => {
        const { token } = await authApi.login(email, password);
        setToken(token);
        const name = email.split("@")[0];
        set({ isLoggedIn: true, user: { name, email }, token });
        await Promise.all([get().fetchJobs(), get().fetchAnalyses()]);
      },

      signupWithApi: async (name, email, password) => {
        await authApi.signup(name, email, password);
        const { token } = await authApi.login(email, password);
        setToken(token);
        set({ isLoggedIn: true, user: { name, email }, token });
        await get().saveProfileToBackend();
      },

      // kept for legacy calls in LandingPage mock
      login: (name, email) => set({ isLoggedIn: true, user: { name, email } }),

      logout: () => {
        clearToken();
        set({ isLoggedIn: false, user: null, token: null, profileId: null, jobs: [], analyses: {} });
      },

      // ── Theme + template ──────────────────────────────────
      theme: "dark",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      activeTemplate: "modern",
      setTemplate: (t) => set({ activeTemplate: t }),

      // ── Profile ───────────────────────────────────────────
      profile: defaultProfile,
      updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),

      addExperience: () => set((s) => ({ profile: { ...s.profile, experience: [...s.profile.experience, { id: `exp-${Date.now()}`, title: "", company: "", start: "", end: "", current: false, bullets: "" }] } })),
      updateExperience: (id, data) => set((s) => ({ profile: { ...s.profile, experience: s.profile.experience.map((e) => e.id === id ? { ...e, ...data } : e) } })),
      removeExperience: (id) => set((s) => ({ profile: { ...s.profile, experience: s.profile.experience.filter((e) => e.id !== id) } })),
      addProject: () => set((s) => ({ profile: { ...s.profile, projects: [...s.profile.projects, { id: `proj-${Date.now()}`, name: "", year: "", stack: "", desc: "", url: "" }] } })),
      updateProject: (id, data) => set((s) => ({ profile: { ...s.profile, projects: s.profile.projects.map((p) => p.id === id ? { ...p, ...data } : p) } })),
      removeProject: (id) => set((s) => ({ profile: { ...s.profile, projects: s.profile.projects.filter((p) => p.id !== id) } })),
      addCertification: () => set((s) => ({ profile: { ...s.profile, certifications: [...s.profile.certifications, { id: `cert-${Date.now()}`, name: "", issuer: "" }] } })),
      updateCertification: (id, data) => set((s) => ({ profile: { ...s.profile, certifications: s.profile.certifications.map((c) => c.id === id ? { ...c, ...data } : c) } })),
      removeCertification: (id) => set((s) => ({ profile: { ...s.profile, certifications: s.profile.certifications.filter((c) => c.id !== id) } })),
      addSkill: (skill) => set((s) => ({ profile: { ...s.profile, skills: [...s.profile.skills, skill] } })),
      removeSkill: (skill) => set((s) => ({ profile: { ...s.profile, skills: s.profile.skills.filter((sk) => sk !== skill) } })),

      saveProfileToBackend: async () => {
        const { profile, profileId } = get();
        const resume_data = {
          name: profile.name, email: profile.email, phone: profile.phone,
          location: "", summary: profile.summary, skills: profile.skills,
          experience: profile.experience.map((e) => ({
            company: e.company, title: e.title, start: e.start,
            end: e.current ? "Present" : e.end,
            bullets: e.bullets.split("\n").filter(Boolean),
          })),
          education: [{ institution: profile.school, degree: profile.degree, field: "", year: `${profile.eduStart}–${profile.eduEnd}` }],
          projects: profile.projects.map((p) => ({ name: p.name, description: p.desc, tech: p.stack.split(",").map((t) => t.trim()) })),
          achievements: [],
        };
        if (profileId) {
          await profileApi.update(profileId, resume_data);
        } else {
          const { profile: saved } = await profileApi.create(resume_data);
          set({ profileId: saved.id });
        }
      },

      // ── Cloudinary upload state ───────────────────────────
      uploadedFileUrl: null,
      setUploadedFileUrl: (url) => set({ uploadedFileUrl: url }),

      // ── Jobs ──────────────────────────────────────────────
      jobs: [],

      fetchJobs: async () => {
        try {
          const { jobs } = await jobApi.getAll();
          set({
            jobs: jobs.map((j) => ({
              id: j.id, title: j.title, company: j.company_name,
              description: "", analyzed: !!j.extracted_data, score: undefined,
              addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            })),
          });
        } catch { /* not logged in */ }
      },

      addJob: async ({ title, company, description }) => {
        const res = await jobApi.create(title, company, description);
        const newJob: JobDescription = {
          id: res.job?.id || `job-${Date.now()}`,
          title, company, description, analyzed: false,
          addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        };
        set((s) => ({ jobs: [...s.jobs, newJob] }));
      },

      removeJob: async (id) => {
        await jobApi.delete(id);
        set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) }));
      },

      // ── Analysis ──────────────────────────────────────────
      analyses: {},
      analyzingJobId: null,

      runAnalysis: async (jobId) => {
        const { profileId } = get();
        if (!profileId) throw new Error("Save your profile first");
        set({ analyzingJobId: jobId });
        try {
          const { analysis } = await analysisApi.run(profileId, jobId);
          set((s) => ({
            analyzingJobId: null,
            analyses: { ...s.analyses, [jobId]: { ...analysis, jobId } },
            jobs: s.jobs.map((j) => j.id === jobId ? { ...j, score: analysis.score, analyzed: true } : j),
          }));
        } catch (err) {
          set({ analyzingJobId: null });
          throw err;
        }
      },

      fetchAnalyses: async () => {
        try {
          const { analyses } = await analysisApi.getAll();
          const map: Record<string, AnalysisResult> = {};
          analyses.forEach((a) => { map[a.job_desc_id] = a as unknown as AnalysisResult; });
          set((s) => ({
            analyses: map,
            jobs: s.jobs.map((j) => { const a = map[j.id]; return a ? { ...j, score: a.score, analyzed: true } : j; }),
          }));
        } catch { /* not logged in */ }
      },

      // ── Toast ─────────────────────────────────────────────
      toast: null,
      showToast: (message, type = "ok") => set({ toast: { message, type } }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "resumate-store",
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn, user: s.user, token: s.token,
        profileId: s.profileId, profile: s.profile,
        theme: s.theme, activeTemplate: s.activeTemplate,
      }),
    }
  )
);
