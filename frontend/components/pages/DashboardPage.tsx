"use client";
import { TrendingUp, Briefcase, BarChart2, AlertCircle, CheckCircle, Clock, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";

interface Props { goTo: (page: any) => void }

export default function DashboardPage({ goTo }: Props) {
  const { profile, jobs, showToast } = useStore();

  const completedSections = [
    { label: "Basic info", done: !!(profile.name && profile.email) },
    { label: "Work experience", done: profile.experience.length > 0 },
    { label: "Skills", done: profile.skills.length > 0 },
    { label: "Projects", done: profile.projects.length > 0 },
    { label: "Education", done: !!(profile.degree && profile.school) },
    { label: "Certifications", done: profile.certifications.filter(c => c.name).length > 0 },
    { label: "Summary", done: profile.summary.length > 40 },
  ];
  const completePct = Math.round((completedSections.filter(s => s.done).length / completedSections.length) * 100);

  const analyzedJobs = jobs.filter(j => j.analyzed && j.score !== undefined);
  const bestScore = analyzedJobs.length ? Math.max(...analyzedJobs.map(j => j.score!)) : 0;
  const avgScore = analyzedJobs.length ? Math.round(analyzedJobs.reduce((a, j) => a + j.score!, 0) / analyzedJobs.length) : 0;

  const scoreColor = (s: number) => s >= 70 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg = (s: number) => s >= 70 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : s >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20";

  const gaps = [
    { name: "Node.js / Express", pct: 100, color: "bg-emerald-500", stat: "5/5 ✓", statColor: "text-emerald-400" },
    { name: "TypeScript", pct: 80, color: "bg-amber-500", stat: "4/5 — missing in bullets", statColor: "text-amber-400" },
    { name: "Redis / Caching", pct: 60, color: "bg-emerald-500", stat: "3/5 ✓", statColor: "text-emerald-400" },
    { name: "Docker / Kubernetes", pct: 60, color: "bg-amber-500", stat: "3/5 — partial", statColor: "text-amber-400" },
    { name: "GraphQL", pct: 40, color: "bg-red-500", stat: "2/5 — missing", statColor: "text-red-400" },
  ];

  return (
    <div className="max-w-5xl">
      {/* Welcome */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <h2 className="font-display font-bold text-xl text-white mb-1">Good morning, {profile.name.split(" ")[0]} 👋</h2>
        <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
          Your profile is <span className="text-indigo-400 font-semibold">{completePct}% complete</span>.
          {completePct < 100 && " Add certifications and summary to improve your ATS scores."}
          {bestScore > 0 && <> Your best match is <span className="text-emerald-400 font-semibold">{bestScore}%</span>.</>}
        </p>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={() => goTo("analyzer")} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all">
            <BarChart2 size={12} /> View Analyses
          </button>
          <button onClick={() => goTo("builder")} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-lg border border-white/10 transition-all">
            Complete profile →
          </button>
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3.5 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-display">Profile completeness</span>
          <span className="text-sm font-bold text-indigo-400 font-display">{completePct}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-700" style={{ width: `${completePct}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {completedSections.map(s => (
            <div key={s.label} className={`flex items-center gap-1.5 text-xs ${s.done ? "text-emerald-400" : "text-slate-500"}`}>
              {s.done ? <CheckCircle size={11} /> : <Clock size={11} />}
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Best Match", value: bestScore ? `${bestScore}%` : "—", sub: analyzedJobs[0] ? `${analyzedJobs[0].company}` : "No analyses yet", color: bestScore >= 70 ? "text-emerald-400" : "text-slate-300" },
          { label: "Avg Score", value: avgScore ? `${avgScore}%` : "—", sub: `Across ${analyzedJobs.length} analyses`, color: avgScore >= 60 ? "text-amber-400" : "text-slate-300" },
          { label: "Jobs Tracked", value: jobs.length, sub: `${analyzedJobs.length} fully analyzed`, color: "text-white" },
          { label: "Top Gap", value: "TypeScript", sub: "Required in 4/5 jobs", color: "text-white" },
        ].map(k => (
          <div key={k.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display mb-1.5">{k.label}</div>
            <div className={`text-2xl font-extrabold font-display leading-none ${k.color}`}>{k.value}</div>
            <div className="text-[11px] text-slate-500 mt-1.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent jobs */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-white font-display">Recent Job Analyses</div>
        <button onClick={() => goTo("analyzer")} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {jobs.slice(0, 2).map(job => (
          <div key={job.id} onClick={() => goTo("analyzer")} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 hover:shadow-glow transition-all relative">
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${job.analyzed ? "bg-emerald-500" : "bg-slate-600"}`} />
            <div className="flex gap-2.5 mb-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-bold text-white font-display shrink-0">{job.company[0]}</div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">{job.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{job.company}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {job.score !== undefined
                ? <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreBg(job.score)}`}>● {job.score}%</span>
                : <span className="text-xs text-slate-500">Not analyzed</span>}
              <span className="text-[10px] text-slate-500">{job.addedAt}</span>
            </div>
          </div>
        ))}
        <div onClick={() => goTo("jobs")} className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Plus size={16} />
          </div>
          <div className="text-xs font-semibold text-slate-400">Add new job</div>
        </div>
      </div>

      {/* Skills gap */}
      <div className="text-sm font-bold text-white font-display mb-3">Skills Gap — Across All Jobs</div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="space-y-3">
          {gaps.map(g => (
            <div key={g.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">{g.name}</span>
                <span className={`font-bold ${g.statColor}`}>{g.stat}</span>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${g.color} transition-all duration-700`} style={{ width: `${g.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
