"use client";
// ─── ANALYZER PAGE ─────────────────────────────────────────────────────────
import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle, XCircle, Loader2, Zap, Plus } from "lucide-react";
import { useStore, AnalysisResult } from "@/store/useStore";

export function AnalyzerPage() {
  const {
    jobs, analyses, runAnalysis, analyzingJobId,
    profileId, showToast,
  } = useStore();

  // Which job is selected in the sidebar
  const analyzedJobs = jobs.filter(j => j.analyzed || analyses[j.id]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    analyzedJobs[0]?.id ?? jobs[0]?.id ?? null
  );
  const [tab, setTab] = useState<"score" | "optimized" | "keywords">("score");

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const analysis: AnalysisResult | undefined = selectedJobId ? analyses[selectedJobId] : undefined;
  const isAnalyzing = analyzingJobId === selectedJobId;

  const score  = analysis?.score ?? 0;
  const circ   = 276;
  const offset = circ * (1 - score / 100);
  const ringColor = score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  async function handleRunAnalysis() {
    if (!selectedJobId) { showToast("Select a job first", "err"); return; }
    if (!profileId)     { showToast("Save your profile first in Resume Builder", "err"); return; }
    try {
      showToast("Running AI analysis… (15–30s)", "info");
      await runAnalysis(selectedJobId);
      showToast("Analysis complete!", "ok");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Analysis failed", "err");
    }
  }

  const confColor = (c: string) =>
    c === "high"   ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : c === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    :                  "bg-red-500/10 text-red-400 border-red-500/20";

  const scoreDotColor = (s?: number) =>
    !s           ? "bg-slate-600"
    : s >= 70    ? "bg-emerald-500"
    : s >= 50    ? "bg-amber-500"
    :              "bg-red-500";

  return (
    <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-4 items-start">

      {/* ── LEFT: main panel ── */}
      <div className="space-y-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                🔍 {selectedJob ? `${selectedJob.company} · ${selectedJob.title}` : "Select a job →"}
              </div>
              {analysis && (
                <div className="text-xs text-slate-500 mt-1 ml-5">
                  Score: {score}% · {analysis.matched_skills?.length ?? 0} exact ·{" "}
                  {analysis.partial_matches?.length ?? 0} partial ·{" "}
                  {analysis.missing_keywords?.length ?? 0} gaps
                </div>
              )}
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !selectedJobId}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              {isAnalyzing
                ? <><Loader2 size={11} className="animate-spin" /> Analyzing…</>
                : <><RefreshCw size={11} /> {analysis ? "Re-analyze" : "Run Analysis"}</>}
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-slate-700 mb-4">
            {(["score", "optimized", "keywords"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all capitalize font-display
                  ${tab === t ? "text-indigo-400 border-indigo-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
                {t === "score" ? "Score Breakdown" : t === "optimized" ? "Optimized Bullets" : "Keyword Map"}
              </button>
            ))}
          </div>

          {/* ── No job selected ── */}
          {!selectedJobId && (
            <div className="text-center py-12 text-slate-500 text-sm">
              Add a job from Job Descriptions, then run analysis here.
            </div>
          )}

          {/* ── Loading ── */}
          {isAnalyzing && (
            <div className="text-center py-10">
              <Loader2 size={28} className="text-indigo-400 animate-spin mx-auto mb-3" />
              <div className="text-sm text-slate-400">AI is reading your resume and the job description…</div>
              <div className="text-xs text-slate-500 mt-1">Gemini → Groq → Ollama fallback chain</div>
            </div>
          )}

          {/* ── No analysis yet ── */}
          {selectedJobId && !analysis && !isAnalyzing && (
            <div className="text-center py-10">
              <div className="text-slate-400 text-sm mb-3">No analysis yet for this job.</div>
              <button
                onClick={handleRunAnalysis}
                disabled={!profileId}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all mx-auto"
              >
                <Zap size={13} /> Run Analysis
              </button>
              {!profileId && (
                <div className="text-xs text-amber-400 mt-2">Save your profile first in Resume Builder</div>
              )}
            </div>
          )}

          {/* ── Real analysis data ── */}
          {analysis && !isAnalyzing && (
            <>
              {/* SCORE TAB */}
              {tab === "score" && (
                <div className="space-y-5">
                  {/* Exact matches */}
                  {(analysis.matched_skills?.length ?? 0) > 0 && (
                    <div>
                      <div className="text-xs font-bold text-white font-display mb-2">
                        Exact Matches{" "}
                        <span className="text-emerald-400 font-normal">({analysis.matched_skills.length} skills)</span>
                      </div>
                      <div className="space-y-1.5">
                        {analysis.matched_skills.map(skill => (
                          <div key={skill} className="flex items-center gap-2.5 px-3 py-2 bg-slate-700/40 rounded-lg">
                            <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                            <div className="text-xs font-semibold text-white">{skill}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partial matches */}
                  {(analysis.partial_matches?.length ?? 0) > 0 && (
                    <div>
                      <div className="text-xs font-bold text-white font-display mb-2">
                        Partial Matches{" "}
                        <span className="text-amber-400 font-normal">({analysis.partial_matches.length} inferred)</span>
                      </div>
                      <div className="space-y-1.5">
                        {analysis.partial_matches.map(m => (
                          <div key={m.required} className="flex items-center gap-2.5 px-3 py-2 bg-slate-700/40 rounded-lg">
                            <AlertCircle size={13} className="text-amber-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white">{m.required}</div>
                              <div className="text-[10.5px] text-slate-400 mt-0.5">{m.note}</div>
                            </div>
                            <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${confColor(m.confidence)}`}>
                              {m.confidence}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing */}
                  {(analysis.missing_keywords?.length ?? 0) > 0 && (
                    <div>
                      <div className="text-xs font-bold text-white font-display mb-2">
                        Missing{" "}
                        <span className="text-red-400 font-normal">({analysis.missing_keywords.length} gaps)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.missing_keywords.map(m => (
                          <span key={m} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* OPTIMIZED TAB */}
              {tab === "optimized" && analysis.optimized_resume && (
                <div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    AI-rewritten bullets that naturally include missing keywords while keeping all claims truthful.
                  </p>
                  {analysis.optimized_resume.experience?.map((exp, i) => (
                    <div key={i} className="mb-4">
                      <div className="text-xs font-bold text-white font-display mb-2">
                        {exp.title} · {exp.company}
                      </div>
                      <div className="space-y-2">
                        {exp.bullets.map((b, j) => (
                          <div key={j} className="flex items-start gap-2 px-3 py-2.5 bg-slate-700/40 rounded-lg text-xs text-slate-300 leading-relaxed">
                            <span className="text-emerald-400 mt-0.5 shrink-0">↗</span>{b}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(analysis.optimized_resume.skills_to_learn?.length ?? 0) > 0 && (
                    <div className="p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-xs text-emerald-200 leading-relaxed mt-3">
                      <strong className="text-emerald-400 block mb-1">Skills to learn next</strong>
                      {analysis.optimized_resume.skills_to_learn.join(", ")}
                    </div>
                  )}
                </div>
              )}

              {/* KEYWORD MAP TAB */}
              {tab === "keywords" && (
                <div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Keyword presence in your resume for this job.
                  </p>
                  <div className="space-y-3">
                    {analysis.matched_skills?.map(k => (
                      <div key={k}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300">{k}</span>
                          <span className="font-bold text-emerald-400">✓ matched</span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-full" />
                        </div>
                      </div>
                    ))}
                    {analysis.partial_matches?.map(m => (
                      <div key={m.required}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300">{m.required}</span>
                          <span className="font-bold text-amber-400">⚠ partial</span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full w-3/5" />
                        </div>
                      </div>
                    ))}
                    {analysis.missing_keywords?.map(k => (
                      <div key={k}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300">{k}</span>
                          <span className="font-bold text-red-400">✗ missing</span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full w-1/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {(analysis.suggestions?.length ?? 0) > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-700">
                  <div className="text-xs font-bold text-white font-display mb-3">💡 Suggestions</div>
                  <div className="space-y-2.5">
                    {analysis.suggestions.map(s => (
                      <div key={s.area} className="px-3.5 py-2.5 border-l-2 border-indigo-500 bg-slate-700/40 rounded-r-lg">
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide font-display mb-1">{s.area}</div>
                        <div className="text-xs text-slate-300 leading-relaxed">{s.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT: score ring + job switcher ── */}
      <div className="space-y-4">
        {/* Score ring */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex flex-col items-center pb-4">
            <div className="relative w-28 h-28">
              <svg className="rotate-[-90deg]" width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <circle cx="56" cy="56" r="44" fill="none"
                  stroke={analysis ? ringColor : "rgba(255,255,255,0.06)"}
                  strokeWidth="7"
                  strokeDasharray={circ}
                  strokeDashoffset={analysis ? offset : circ}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-display leading-none">
                  {analysis ? score : "–"}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Match</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center mt-2 leading-relaxed">
              {analysis
                ? `${analysis.matched_skills?.length ?? 0} exact · ${analysis.partial_matches?.length ?? 0} partial · ${analysis.missing_keywords?.length ?? 0} gaps`
                : "Run analysis to see score"}
            </div>
          </div>
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !selectedJobId || !profileId}
            className="flex items-center gap-1.5 w-full justify-center px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all"
          >
            {isAnalyzing
              ? <><Loader2 size={12} className="animate-spin" /> Analyzing…</>
              : <><Zap size={12} /> {analysis ? "Re-analyze" : "Run Analysis"}</>}
          </button>
        </div>

        {/* Job switcher */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <div className="text-xs font-bold text-white font-display mb-3">All Jobs</div>
          {jobs.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">
              No jobs yet. Add from Job Descriptions.
            </div>
          ) : (
            <div className="space-y-1.5">
              {jobs.map(j => {
                const a = analyses[j.id];
                const s = a?.score ?? j.score;
                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJobId(j.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
                      ${selectedJobId === j.id
                        ? "bg-indigo-500/12 border border-indigo-500/25"
                        : "hover:bg-slate-700/50"}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${scoreDotColor(s)} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{j.company} · {j.title}</div>
                      <div className="text-[10px] text-slate-500">
                        {s !== undefined ? `${s}% match` : analyzingJobId === j.id ? "Analyzing…" : "Not analyzed"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── JOBS PAGE ─────────────────────────────────────────────────────────────
export function JobsPage() {
  const { jobs, addJob, removeJob, showToast, isLoggedIn } = useStore();
  const [submitting, setSub] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", description: "" });

  async function submit() {
    if (!form.title || !form.company) { showToast("Enter job title and company", "err"); return; }
    if (!form.description.trim())     { showToast("Paste the full job description", "err"); return; }
    setSub(true);
    try {
      await addJob({ title: form.title, company: form.company, description: form.description });
      setForm({ title: "", company: "", description: "" });
      showToast("Job saved! Go to Analyzer to run AI analysis.", "ok");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to save job", "err");
    } finally { setSub(false); }
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
          <button onClick={submit} disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all">
            {submitting ? <><Loader2 size={13} className="animate-spin" />Saving…</> : <><CheckCircle size={13} /> Save Job</>}
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
              <button onClick={async () => {
                  try { await removeJob(job.id); showToast("Deleted", "ok"); }
                  catch { showToast("Delete failed — job has linked data", "err"); }
                }}
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