// store/useStore.ts
"use client";
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
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  profileId: string | null;
  token: string | null;
  isNewUser: boolean;                   // ← new: true when no data yet
  loginWithApi: (email: string, password: string) => Promise<void>;
  signupWithApi: (name: string, email: string, password: string) => Promise<void>;
  login: (name: string, email: string) => void;
  logout: () => void;

  theme: "dark" | "light";
  toggleTheme: () => void;
  activeTemplate: "modern" | "classic" | "purple" | "minimal";
  setTemplate: (t: "modern" | "classic" | "purple" | "minimal") => void;

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

  uploadedFileUrl: string | null;
  setUploadedFileUrl: (url: string | null) => void;

  jobs: JobDescription[];
  addJob: (job: { title: string; company: string; description: string }) => Promise<void>;
  fetchJobs: () => Promise<void>;
  removeJob: (id: string) => Promise<void>;

  analyses: Record<string, AnalysisResult>;
  runAnalysis: (jobId: string) => Promise<void>;
  fetchAnalyses: () => Promise<void>;
  analyzingJobId: string | null;

  toast: { message: string; type: "ok" | "err" | "info" } | null;
  showToast: (message: string, type?: "ok" | "err" | "info") => void;
  clearToast: () => void;
}

// ── Blank profile for new users — no personal data ──────────────────────────
const emptyProfile: ResumeProfile = {
  name: "", role: "", email: "", phone: "",
  linkedin: "", github: "", summary: "",
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  degree: "", school: "", eduStart: "", eduEnd: "",
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false, user: null, profileId: null, token: null,
      isNewUser: false,

      // ── Login: load existing data from backend ──────────────────────────────
      loginWithApi: async (email, password) => {
        const { token } = await authApi.login(email, password);
        setToken(token);
        const name = email.split("@")[0];
        set({ isLoggedIn: true, user: { name, email }, token, isNewUser: false });
        // Load their real jobs and analyses from DB
        await Promise.all([get().fetchJobs(), get().fetchAnalyses()]);
      },

      // ── Signup: start with a completely blank slate ─────────────────────────
      signupWithApi: async (name, email, password) => {
        await authApi.signup(name, email, password);
        const { token } = await authApi.login(email, password);
        setToken(token);

        // Reset profile to empty — new user has no data yet
        set({
          isLoggedIn: true,
          user: { name, email },
          token,
          isNewUser: true,       // triggers onboarding state in dashboard
          profileId: null,
          jobs: [],
          analyses: {},
          profile: {
            ...emptyProfile,
            name,                // pre-fill name from signup
            email,               // pre-fill email from signup
          },
        });
        // Create a blank profile row in the DB so analysis has something to link to
        await get().saveProfileToBackend();
      },

      login: (name, email) => set({ isLoggedIn: true, user: { name, email } }),

      logout: () => {
        clearToken();
        set({
          isLoggedIn: false, user: null, token: null, profileId: null,
          jobs: [], analyses: {}, isNewUser: false,
          profile: emptyProfile,   // clear profile on logout
        });
      },

      theme: "dark",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      activeTemplate: "modern",
      setTemplate: (t) => set({ activeTemplate: t }),

      profile: emptyProfile,
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

      // Sync profile to DB
      saveProfileToBackend: async () => {
        const { profile, profileId } = get();
        const resume_data = {
          name: profile.name, email: profile.email, phone: profile.phone,
          location: "", summary: profile.summary,
          skills: profile.skills,
          experience: profile.experience.map((e) => ({
            company: e.company, title: e.title,
            start: e.start, end: e.current ? "Present" : e.end,
            bullets: e.bullets.split("\n").filter(Boolean),
          })),
          education: [{
            institution: profile.school, degree: profile.degree,
            field: "", year: `${profile.eduStart} – ${profile.eduEnd}`,
          }],
          projects: profile.projects.map((p) => ({
            name: p.name, description: p.desc,
            tech: p.stack.split(",").map((t) => t.trim()).filter(Boolean),
          })),
          achievements: [],
        };
        if (profileId) {
          await profileApi.update(profileId, resume_data);
        } else {
          const { profile: saved } = await profileApi.create(resume_data);
          set({ profileId: saved.id });
        }
      },

      uploadedFileUrl: null,
      setUploadedFileUrl: (url) => set({ uploadedFileUrl: url }),

      // ── Jobs ─────────────────────────────────────────────────────────────────
      jobs: [],

      fetchJobs: async () => {
        try {
          const { jobs } = await jobApi.getAll();
          set({
            jobs: jobs.map((j) => ({
              id: j.id, title: j.title, company: j.company_name,
              description: "", analyzed: !!j.extracted_data,
              score: undefined,
              addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            })),
          });
        } catch { /* not logged in yet */ }
      },

      addJob: async ({ title, company, description }) => {
        const { job } = await jobApi.create(title, company, description);
        const newJob: JobDescription = {
          id: job.id, title, company, description, analyzed: false,
          addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        };
        set((s) => ({ jobs: [...s.jobs, newJob] }));
      },

      removeJob: async (id) => {
        await jobApi.delete(id);
        set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) }));
      },

      // ── Analysis ─────────────────────────────────────────────────────────────
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
          const map: Record<string, unknown> = {};
          analyses.forEach((a) => { map[a.job_desc_id] = a; });
          set((s) => ({
            analyses: map as Record<string, AnalysisResult>,
            jobs: s.jobs.map((j) => {
              const a = analyses.find((a) => a.job_desc_id === j.id);
              return a ? { ...j, score: a.score, analyzed: true } : j;
            }),
          }));
        } catch { /* not logged in yet */ }
      },

      toast: null,
      showToast: (message, type = "ok") => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3500);
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "resumate-store",
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        user: s.user,
        token: s.token,
        profileId: s.profileId,
        profile: s.profile,
        isNewUser: s.isNewUser,
        theme: s.theme,
        activeTemplate: s.activeTemplate,
      }),
    }
  )
);