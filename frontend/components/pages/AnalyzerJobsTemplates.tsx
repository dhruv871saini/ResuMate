"use client";
// ─── ANALYZER PAGE ───────────────────────────────────────────────────────────
import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle, XCircle, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";

export function AnalyzerPage() {
  const [tab, setTab] = useState<"score" | "optimized" | "keywords">("score");
  const { showToast, jobs } = useStore();

  const exactMatches = [
    { skill: "Node.js / Express", note: "In skills + experience bullets" },
    { skill: "Redis", note: "Skills + experience (Redis-coordinated architecture)" },
    { skill: "MongoDB", note: "In skills + experience bullets" },
    { skill: "AWS SQS / S3", note: "Explicitly mentioned in experience" },
    { skill: "Microservices", note: "3-service chain refactor in experience" },
  ];
  const partialMatches = [
    { skill: "Event-driven systems", note: "SQS-driven consumers + async patterns = strong implication", conf: "high" },
    { skill: "Performance optimization", note: "85% latency reduction + 60 FPS mentioned directly", conf: "high" },
    { skill: "CI/CD pipelines", note: "GCP automation + scheduled cleanup implies DevOps familiarity", conf: "medium" },
    { skill: "TypeScript", note: "In skills list but not mentioned in experience bullets", conf: "medium" },
  ];
  const missing = ["Kubernetes", "GraphQL", "System Design (explicit)", "Leadership / Mentoring"];

  const optimizedBullets = [
    "Designed Redis-coordinated microservices architecture replacing 3-hop chain — reducing p95 API latency by 85% (2000ms → 300ms) and enabling horizontal scalability",
    "Built async write-behind system for Continue Watching/Watch Later using AWS SQS, MongoDB, and Redis — sub-200ms perceived write latency with event-driven consumers",
    "Architected React Native video feed sustaining 60 FPS; applied TypeScript strict mode and component-level profiling for sub-100ms interaction feedback",
    "Deployed analytics pipelines for real-time revenue tracking and GCP cost monitoring — automated cleanup policies reduced orphaned resource spend",
    "Implemented async job processing pipeline reducing blocking operations by 60%; scoped Redis-backed queue as next performance milestone",
  ];

  const keywords = [
    { name: "Node.js / Express", pct: 100, stat: "5/5 ✓", color: "bg-emerald-500", statColor: "text-emerald-400" },
    { name: "Redis", pct: 80, stat: "4/5 ✓", color: "bg-emerald-500", statColor: "text-emerald-400" },
    { name: "TypeScript", pct: 80, stat: "4/5 (partial)", color: "bg-amber-500", statColor: "text-amber-400" },
    { name: "MongoDB / PostgreSQL", pct: 80, stat: "4/5 ✓", color: "bg-emerald-500", statColor: "text-emerald-400" },
    { name: "Microservices", pct: 60, stat: "3/5 ✓", color: "bg-emerald-500", statColor: "text-emerald-400" },
    { name: "Kubernetes / Docker", pct: 60, stat: "3/5 (partial)", color: "bg-amber-500", statColor: "text-amber-400" },
    { name: "GraphQL", pct: 40, stat: "2/5 missing", color: "bg-red-500", statColor: "text-red-400" },
    { name: "System Design", pct: 40, stat: "2/5 missing", color: "bg-red-500", statColor: "text-red-400" },
  ];

  const confColor = (c: string) => c === "high" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : c === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20";

  // Score ring math: circumference = 2π*44 ≈ 276. dashoffset = 276 * (1 - score/100)
  const score = 82;
  const circ = 276;
  const offset = circ * (1 - score / 100);

  return (
    <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-4 items-start">
      <div className="space-y-4">
        {/* Main card */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                🔍 Mogi I/O · Software Dev Engineer I
              </div>
              <div className="text-xs text-slate-500 mt-1 ml-5">Analyzed Jun 10, 2026 · Groq llama-3.1-8b-instant</div>
            </div>
            <button onClick={() => { showToast("Re-running analysis…", "info"); setTimeout(() => showToast("Analysis refreshed!", "ok"), 2200); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all">
              <RefreshCw size={11} /> Re-analyze
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-slate-700 mb-4">
            {(["score", "optimized", "keywords"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all capitalize font-display ${tab === t ? "text-indigo-400 border-indigo-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
                {t === "score" ? "Score Breakdown" : t === "optimized" ? "Optimized Bullets" : "Keyword Map"}
              </button>
            ))}
          </div>

          {tab === "score" && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-bold text-white font-display mb-2">Exact Matches <span className="text-emerald-400 font-normal">({exactMatches.length} skills)</span></div>
                <div className="space-y-1.5">
                  {exactMatches.map(m => (
                    <div key={m.skill} className="flex items-center gap-2.5 px-3 py-2 bg-slate-700/40 rounded-lg">
                      <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-white">{m.skill}</div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5">{m.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display mb-2">Partial Matches <span className="text-amber-400 font-normal">({partialMatches.length} inferred)</span></div>
                <div className="space-y-1.5">
                  {partialMatches.map(m => (
                    <div key={m.skill} className="flex items-center gap-2.5 px-3 py-2 bg-slate-700/40 rounded-lg">
                      <AlertCircle size={13} className="text-amber-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white">{m.skill}</div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5">{m.note}</div>
                      </div>
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${confColor(m.conf)}`}>{m.conf}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display mb-2">Missing <span className="text-red-400 font-normal">({missing.length} gaps)</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map(m => (
                    <span key={m} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "optimized" && (
            <div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">AI-rewritten bullets that include missing keywords while keeping all claims truthful.</p>
              <div className="text-xs font-bold text-white font-display mb-2">SDE I · Mogi I/O</div>
              <div className="space-y-2 mb-4">
                {optimizedBullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 bg-slate-700/40 rounded-lg text-xs text-slate-300 leading-relaxed">
                    <span className="text-emerald-400 text-xs mt-0.5 shrink-0">↗</span>{b}
                  </div>
                ))}
              </div>
              <div className="p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-xs text-emerald-200 leading-relaxed mb-3">
                <strong className="text-emerald-400 block mb-1">Recommended additions</strong>
                Add Kubernetes (you have Docker — natural extension), mention TypeScript in bullets not just skills, add a line about code reviews if applicable.
              </div>
              <button onClick={() => showToast("Optimized bullets applied to resume!", "ok")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all">
                <CheckCircle size={12} /> Apply to Resume
              </button>
            </div>
          )}

          {tab === "keywords" && (
            <div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Keyword frequency across all 5 tracked jobs.</p>
              <div className="space-y-3">
                {keywords.map(k => (
                  <div key={k.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">{k.name}</span>
                      <span className={`font-bold ${k.statColor}`}>{k.stat}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${k.color} rounded-full transition-all duration-700`} style={{ width: `${k.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="text-sm font-bold text-white font-display mb-3">💡 Suggestions</div>
          <div className="space-y-2.5">
            {[
              { area: "TypeScript in bullets", tip: "You list TypeScript as a skill but never mention it in experience. Add 'with TypeScript strict mode' to at least 2 bullets." },
              { area: "Kubernetes", tip: "You have Docker and GCP infra experience. Adding Kubernetes (even basic cluster management) would unlock 3 more job matches." },
              { area: "Leadership signal", tip: "Senior roles want evidence of mentoring or code review. If you do them, add 'conducted peer code reviews for 3-person team' type bullets." },
            ].map(s => (
              <div key={s.area} className="px-3.5 py-2.5 border-l-2 border-indigo-500 bg-slate-700/40 rounded-r-lg">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide font-display mb-1">{s.area}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{s.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        {/* Score ring */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex flex-col items-center pb-4">
            <div className="relative w-28 h-28">
              <svg className="rotate-[-90deg]" width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <circle cx="56" cy="56" r="44" fill="none" stroke="#10B981" strokeWidth="7"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="ring-fill" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-display leading-none">{score}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Match</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center mt-2 leading-relaxed">Strong match<br />5 exact · 4 partial · 4 gaps</div>
          </div>
          <button onClick={() => { showToast("Re-running analysis…", "info"); setTimeout(() => showToast("Score updated!", "ok"), 2000); }}
            className="flex items-center gap-1.5 w-full justify-center px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all">
            <RefreshCw size={12} /> Re-analyze
          </button>
        </div>

        {/* Job switcher */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <div className="text-xs font-bold text-white font-display mb-3">All Jobs</div>
          <div className="space-y-1.5">
            {[
              { name: "Mogi I/O · SDE I", score: 82, color: "bg-emerald-500", active: true },
              { name: "StartupXYZ · Backend", score: 61, color: "bg-amber-500" },
              { name: "Razorpay · Backend", score: 67, color: "bg-amber-500" },
              { name: "Google · SWE", score: null, color: "bg-red-500" },
            ].map(j => (
              <div key={j.name} onClick={() => !j.active && showToast(`Loading ${j.name}…`, "info")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${j.active ? "bg-indigo-500/12 border border-indigo-500/25" : "hover:bg-slate-700/50"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${j.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{j.name}</div>
                  <div className="text-[10px] text-slate-500">{j.score ? `${j.score}% match` : "Not analyzed"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── JOBS PAGE ───────────────────────────────────────────────────────────────
export function JobsPage() {
  const { jobs, addJob, removeJob, showToast } = useStore();
  const [form, setForm] = useState({ title: "", company: "", description: "" });

  function submit() {
    if (!form.title || !form.company) { showToast("Enter job title and company", "err"); return; }
    addJob(form);
    setForm({ title: "", company: "", description: "" });
    showToast("Saved! Running AI analysis chain…", "info");
    setTimeout(() => showToast("Analysis complete! Check Analyzer.", "ok"), 2500);
  }

  const scoreBg = (s?: number) => !s ? "bg-slate-700/50 text-slate-400 border-slate-600" : s >= 70 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : s >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="max-w-4xl">
      {/* Add form */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 mb-5">
        <div className="text-sm font-bold text-white font-display mb-4 flex items-center gap-2">➕ Add Job Description</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Job Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Backend Engineer"
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Company</label>
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name"
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Full Job Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={6}
              placeholder="Paste the complete job description here. The AI extracts skills, ATS keywords, seniority, and tech stack automatically."
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-y w-full leading-relaxed" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={submit} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-all">
            <CheckCircle size={13} /> Save & Run Analysis
          </button>
          <button onClick={() => setForm({ title: "", company: "", description: "" })} className="px-4 py-2 border border-slate-600 text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-700 transition-all">Clear</button>
          <span className="text-xs text-slate-500 ml-1">Runs via Gemini → Groq → Ollama fallback chain</span>
        </div>
      </div>

      {/* Saved jobs */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-white font-display">Saved Job Descriptions</div>
        <span className="text-xs text-slate-500">{jobs.length} total · {jobs.filter(j => j.analyzed).length} analyzed</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {jobs.map(job => (
          <div key={job.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 relative">
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${job.analyzed ? "bg-emerald-500" : "bg-slate-600"}`} />
            <div className="flex gap-2.5 mb-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-bold text-white font-display shrink-0">{job.company[0]}</div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">{job.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{job.company} · {job.addedAt}</div>
              </div>
            </div>
            {job.score !== undefined && (
              <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mb-3 ${scoreBg(job.score)}`}>
                {job.score}% match
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => showToast(`Loading ${job.company} analysis…`, "info")}
                className="flex-1 py-1.5 text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all">
                {job.analyzed ? "View Analysis" : "Run Analysis"}
              </button>
              <button onClick={() => { removeJob(job.id); showToast("Deleted", "ok"); }}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <XCircle size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEMPLATES PAGE ──────────────────────────────────────────────────────────
import ResumeRenderer from "@/components/resume/ResumeRenderer";
import { CheckCircle as CheckIcon } from "lucide-react";

const TEMPLATES_INFO = [
  { id: "modern" as const, name: "Modern", style: "Two-column · Indigo header", badge: "Most popular", badgeColor: "bg-emerald-500/10 text-emerald-400" },
  { id: "classic" as const, name: "Classic", style: "Single-column · Serif display", badge: "", badgeColor: "" },
  { id: "purple" as const, name: "Purple", style: "Bold headings · Corporate", badge: "Inspired by your upload", badgeColor: "bg-violet-500/10 text-violet-400" },
  { id: "minimal" as const, name: "Minimal", style: "Timeline · Ultra-clean", badge: "", badgeColor: "" },
];

export function TemplatesPage({ goTo }: { goTo: (p: any) => void }) {
  const { activeTemplate, setTemplate } = useStore();

  return (
    <div className="max-w-5xl">
      <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xl">
        All templates are ATS-safe — no tables, no text boxes, no complex columns. Clean, readable, professional.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {TEMPLATES_INFO.map(t => (
          <div key={t.id} onClick={() => setTemplate(t.id)}
            className={`bg-slate-800/60 border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${activeTemplate === t.id ? "border-indigo-500 shadow-glow" : "border-slate-700/60 hover:border-indigo-500/40"}`}>
            <div className="bg-slate-900 p-3 h-48 overflow-hidden">
              <div style={{ transform: "scale(0.27)", transformOrigin: "top center", width: "370%", marginLeft: "-135%" }}>
                <ResumeRenderer template={t.id} />
              </div>
            </div>
            <div className="p-3 flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-white font-display">{t.name}</div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">{t.style}</div>
                {t.badge && <span className={`inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${t.badgeColor}`}>{t.badge}</span>}
              </div>
              {activeTemplate === t.id && <CheckIcon size={14} className="text-indigo-400 shrink-0 mt-0.5" />}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={() => goTo("builder")}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all text-sm">
          Open Resume Builder with this template →
        </button>
      </div>
    </div>
  );
}
