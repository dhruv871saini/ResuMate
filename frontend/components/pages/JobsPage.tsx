// components/pages/JobsPage.tsx — real API calls
"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Loader2, Zap } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function JobsPage() {
  const { jobs, addJob, removeJob, runAnalysis, analyzingJobId, analyses, showToast, profileId, isLoggedIn } = useStore();
  const [form, setForm]         = useState({ title: "", company: "", description: "" });
  const [submitting, setSub]    = useState(false);

  async function submit() {
    if (!isLoggedIn)           { showToast("Sign in first", "err"); return; }
    if (!form.title || !form.company) { showToast("Enter job title and company", "err"); return; }
    if (!form.description.trim())     { showToast("Paste the full job description", "err"); return; }
    setSub(true);
    try {
      await addJob({ title: form.title, company: form.company, description: form.description });
      setForm({ title: "", company: "", description: "" });
      showToast("Job saved! Click Analyze to run AI.", "ok");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Failed to save job", "err");
    } finally { setSub(false); }
  }

  async function analyze(jobId: string) {
    if (!profileId) { showToast("Save your profile first (Builder → Save & Sync)", "err"); return; }
    try {
      showToast("Running AI analysis… 15–30s", "info");
      await runAnalysis(jobId);
      showToast("Done! Check the Analyzer tab.", "ok");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Analysis failed", "err");
    }
  }

  const scoreStyle = (s?: number) =>
    !s ? "bg-surface-2/50 text-slate-400 border-violet-800/50"
    : s >= 70 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : s >= 50 ? "bg-lime-500/10 text-lime-400 border-lime-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="max-w-4xl">
      {/* Add form */}
      <div className="bg-surface/60 border border-violet-900/50 rounded-2xl p-5 mb-5">
        <div className="text-sm font-bold text-white font-display mb-4">➕ Add Job Description</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Job Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Backend Engineer"
              className="bg-ink-2 border border-violet-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Company</label>
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name"
              className="bg-ink-2 border border-violet-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Full Job Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={6}
              placeholder="Paste the complete job description. AI extracts skills, ATS keywords, seniority, and tech stack automatically."
              className="bg-ink-2 border border-violet-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-y w-full leading-relaxed" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={submit} disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all">
            {submitting ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
            {submitting ? "Saving…" : "Save Job"}
          </button>
          <button onClick={() => setForm({ title: "", company: "", description: "" })}
            className="px-4 py-2 border border-violet-800/50 text-slate-300 text-sm font-semibold rounded-lg hover:bg-surface-2 transition-all">Clear</button>
          <span className="text-xs text-slate-500">AI runs via Gemini → Groq → Ollama fallback</span>
        </div>
      </div>

      {/* Job list */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-white font-display">Saved Jobs</div>
        <span className="text-xs text-slate-500">{jobs.length} total · {jobs.filter(j => j.analyzed).length} analyzed</span>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">No jobs yet. Add one above.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {jobs.map(job => {
            const isAnalyzing = analyzingJobId === job.id;
            const result      = analyses[job.id];
            const score       = result?.score ?? job.score;
            return (
              <div key={job.id} className="bg-surface/50 border border-violet-900/50 rounded-xl p-4 relative">
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${job.analyzed ? "bg-emerald-500" : "bg-slate-600"}`} />
                <div className="flex gap-2.5 mb-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-xs font-bold text-white font-display shrink-0">{job.company[0]}</div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{job.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{job.company} · {job.addedAt}</div>
                  </div>
                </div>
                {score !== undefined && (
                  <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mb-3 ${scoreStyle(score)}`}>{score}% match</div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => analyze(job.id)} disabled={isAnalyzing}
                    className="flex-1 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white rounded-lg transition-all">
                    {isAnalyzing ? <><Loader2 size={11} className="animate-spin" />Analyzing…</> : <><Zap size={11} />{job.analyzed ? "Re-analyze" : "Run Analysis"}</>}
                  </button>
                  <button onClick={async () => { await removeJob(job.id); showToast("Deleted", "ok"); }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
