"use client";
import { useState } from "react";
import { Sun, Moon, Zap, Star, Briefcase, FileText, BarChart2, Layout } from "lucide-react";
import { useStore } from "@/store/useStore";
import AuthModal from "@/components/ui/AuthModal";

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<false | "login" | "signup">(false);
  const { theme, toggleTheme } = useStore();

  const features = [
    { icon: <BarChart2 size={18} />, title: "Real ATS Scoring", desc: "Paste any job description and get an instant match score. See exactly which skills you have, which are partial, and what's missing." },
    { icon: <Star size={18} />, title: "Fuzzy Skill Matching", desc: 'Your resume says "backend APIs" — the job needs "RESTful APIs". Resumate recognizes the connection and credits you.' },
    { icon: <FileText size={18} />, title: "AI Resume Rewriting", desc: "Get your bullets rewritten to include missing keywords — truthfully. No fabrication, just better phrasing ATS systems understand." },
    { icon: <Layout size={18} />, title: "4 Professional Templates", desc: "Modern, Classic, Purple, and Minimal — all ATS-safe, all beautiful. Live preview as you type." },
    { icon: <Zap size={18} />, title: "Multi-Provider AI", desc: "Powered by Gemini, Groq, and Ollama with automatic fallback. Fast analysis even when one provider is down." },
    { icon: <Briefcase size={18} />, title: "Job Tracking", desc: "Track every job you apply to. See score trends, identify recurring skill gaps, and know which jobs to optimize for." },
  ];

  const steps = [
    { n: "1", title: "Build your profile", desc: "Add your experience, skills, projects, and certifications. One profile, used everywhere." },
    { n: "2", title: "Paste a job description", desc: "Copy any JD from LinkedIn or Naukri. AI extracts every skill, keyword, and requirement automatically." },
    { n: "3", title: "See your score", desc: "Get an exact match score with every exact, partial, and missing skill broken down and explained." },
    { n: "4", title: "Export & apply", desc: "Apply AI rewrites, pick a template, and download a clean PDF. Done." },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0A0F1E]/90 backdrop-blur-md border-b border-white/5 px-8 md:px-12 h-14 flex items-center gap-4">
        <div className="flex items-center gap-2.5 font-display font-bold text-lg text-white">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm font-extrabold">R</div>
          Resumate
        </div>
        <div className="hidden md:flex ml-6 gap-1">
          {["Features", "Templates", "How it works"].map((l) => (
            <button key={l} className="px-3.5 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">{l}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setAuthModal("login")} className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-all">Sign in</button>
          <button onClick={() => setAuthModal("signup")} className="px-3.5 py-1.5 text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all">Get started free</button>
          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 transition-all ml-1">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.14),transparent_70%)] pointer-events-none" />
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-5 font-display">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI-powered · ATS-optimized · Free to start
        </div>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] tracking-tight max-w-3xl mb-5">
          Your resume,<br /><span className="text-indigo-400">finally seen by humans</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mb-8">
          Most resumes are filtered out before a recruiter reads them. Resumate helps you beat ATS scanners, score your match, and get the interview.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={() => setAuthModal("signup")} className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 text-sm">
            <FileText size={15} /> Build my resume — it&apos;s free
          </button>
          <button onClick={() => setAuthModal("login")} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold rounded-xl border border-white/10 transition-all text-sm">
            Sign in
          </button>
        </div>

        {/* Demo widget */}
        <div className="mt-14 bg-slate-800/70 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-left shadow-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-display">Live ATS Score Preview</div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="rotate-[-90deg]" width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#10B981" strokeWidth="5" strokeDasharray="163" strokeDashoffset="29" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-white font-display leading-none">82</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-wide font-bold">score</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">Strong match for Full Stack Dev</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">4 exact · 4 partial · 6 gaps found.<br/>AI suggests 3 resume rewrites.</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Node.js / Express", stat: "✓ In resume", color: "bg-emerald-500", statColor: "text-emerald-400", width: "100%" },
              { label: "TypeScript", stat: "~ Partial match", color: "bg-amber-500", statColor: "text-amber-400", width: "60%" },
              { label: "Redis / Message queues", stat: "✗ Missing", color: "bg-red-500", statColor: "text-red-400", width: "0%" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{row.label}</span>
                  <span className={`font-semibold ${row.statColor}`}>{row.stat}</span>
                </div>
                <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${row.color} transition-all duration-1000`} style={{ width: row.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8 md:px-12 max-w-6xl mx-auto">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2.5 font-display">What Resumate does</div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-3">Everything you need<br/>to land the interview</h2>
        <p className="text-slate-400 text-base max-w-lg leading-relaxed mb-12">From building your resume to understanding exactly why you&apos;re getting filtered out — Resumate handles it all.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors">
              <div className="w-9 h-9 bg-indigo-500/12 rounded-xl flex items-center justify-center text-indigo-400 mb-3">{f.icon}</div>
              <div className="text-sm font-bold text-white font-display mb-1.5">{f.title}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-8 md:px-12 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2.5 font-display">Simple process</div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-12">From blank page to interview-ready</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="text-center px-4">
                <div className="w-10 h-10 border border-indigo-500/30 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3 font-display font-bold text-indigo-400 text-base">{s.n}</div>
                <div className="text-sm font-bold text-white font-display mb-2">{s.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white tracking-tight mb-4">Your next interview<br/>is one resume away</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">Stop guessing why you&apos;re not getting called back. Resumate tells you exactly what to fix.</p>
        <button onClick={() => setAuthModal("signup")} className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/25 text-base">
          Create your resume — free
        </button>
      </section>

      <footer className="border-t border-slate-800 px-8 py-5 flex items-center justify-between text-xs text-slate-500">
        <span>© 2026 Resumate. Built with Node.js, PostgreSQL, and multi-provider AI.</span>
        <div className="flex gap-4"><a href="#" className="hover:text-slate-300 transition-colors">Privacy</a><a href="#" className="hover:text-slate-300 transition-colors">Terms</a></div>
      </footer>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} initialTab={authModal} />}
    </div>
  );
}
