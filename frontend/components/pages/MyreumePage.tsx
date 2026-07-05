// components/pages/MyResumesPage.tsx
// Shows all PDFs the user has generated, stored on Cloudinary.
// User can download, preview, or generate a new one from any analysis.
"use client";
import type { NavigateFn } from "@/lib/navigation";
import { useState, useEffect } from "react";
import { FileText, Download, ExternalLink, Loader2, Plus, Zap } from "lucide-react";
import { pdfApi } from "@/lib/api";
import { useStore } from "@/store/useStore";

interface SavedResume {
  id: string;
  score: number;
  pdf_url: string;
  pdf_template: string;
  pdf_created_at: string;
  job_title: string;
  company: string;
}

const TEMPLATE_COLORS: Record<string, string> = {
  classic:   "bg-slate-700/60 text-slate-300 border-slate-600",
  modern:    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  minimal:   "bg-slate-700/40 text-slate-400 border-slate-600",
  executive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function MyResumesPage({ goTo }: { goTo: NavigateFn }) {
  const { analyses, jobs, showToast } = useStore();
  const [resumes, setResumes]         = useState<SavedResume[]>([]);
  const [loading, setLoading]         = useState(true);

  // Which analysis is currently generating a PDF
  const [generatingId, setGeneratingId]       = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { resumes } = await pdfApi.getMyResumes();
      setResumes(resumes);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load resumes";
      showToast(msg, "err");
    } finally {
      setLoading(false);
    }
  }

  async function generate(analysisId: string) {
    setGeneratingId(analysisId);
    showToast("Generating PDF… uploading to Cloudinary", "info");
    try {
      const { pdfUrl } = await pdfApi.generate(analysisId, selectedTemplate);
      showToast("PDF saved to your library!", "ok");
      // Refresh list
      await load();
      // Auto-open in new tab
      window.open(pdfUrl, "_blank");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      showToast(msg, "err");
    } finally {
      setGeneratingId(null);
    }
  }

  // Analyses that don't yet have a saved PDF
  const ungenerated = Object.entries(analyses)
    .map(([jobId, a]) => ({ ...a, jobId }))
    .filter(a => !resumes.find(r => r.id === a.id));

  const scoreBg = (s: number) =>
    s >= 70 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : s >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white font-display">My Resumes</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PDFs generated from your AI analyses — stored on Cloudinary
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Template selector */}
          <select
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="executive">Executive</option>
          </select>
        </div>
      </div>

      {/* Saved PDFs */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="text-indigo-400 animate-spin" />
        </div>
      ) : resumes.length === 0 && ungenerated.length === 0 ? (
        /* Empty state — no analyses at all */
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-4">
            <FileText size={24} />
          </div>
          <div className="text-sm font-semibold text-slate-400 mb-2">No resumes yet</div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
            Run an analysis first, then come back here to generate a PDF in any template.
          </p>
          <button
            onClick={() => goTo("analyzer")}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all mx-auto"
          >
            <Zap size={12} /> Go to Analyzer
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Already generated PDFs */}
          {resumes.length > 0 && (
            <>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Saved ({resumes.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {resumes.map(r => (
                  <div
                    key={`${r.id}-${r.pdf_created_at}`}
                    className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4"
                  >
                    {/* Card header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-bold text-white font-display shrink-0">
                        {r.company[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{r.job_title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{r.company}</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBg(r.score)}`}>
                        {r.score}% match
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${TEMPLATE_COLORS[r.pdf_template] || TEMPLATE_COLORS.classic}`}>
                        {r.pdf_template}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 mb-3">
                      Generated {new Date(r.pdf_created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={r.pdf_url}
                        download
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                      >
                        <Download size={11} /> Download
                      </a>
                      <a
                        href={r.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-200 border border-slate-600 hover:border-slate-500 rounded-lg transition-all"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Analyses without a saved PDF — can generate */}
          {ungenerated.length > 0 && (
            <>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-6">
                Ready to generate ({ungenerated.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ungenerated.map(a => {
                  const job = jobs.find(j => j.id === a.jobId);
                  const isGen = generatingId === a.id;
                  return (
                    <div
                      key={a.id}
                      className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 font-display shrink-0">
                          {job?.company[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {job?.title || "Unknown job"}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{job?.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBg(a.score)}`}>
                          {a.score}% match
                        </span>
                      </div>
                      <button
                        onClick={() => generate(a.id)}
                        disabled={isGen || !!generatingId}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white rounded-lg transition-all"
                      >
                        {isGen
                          ? <><Loader2 size={11} className="animate-spin" /> Generating…</>
                          : <><Plus size={11} /> Generate {selectedTemplate} PDF</>
                        }
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}