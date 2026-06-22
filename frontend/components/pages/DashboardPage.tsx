"use client";
import { TrendingUp, Briefcase, BarChart2, CheckCircle, Clock, Plus, Upload, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";

interface Props { goTo: (page: string) => void }

export default function DashboardPage({ goTo }: Props) {
  const { profile, jobs, analyses, isNewUser, user } = useStore();

  // ── Profile completeness ──────────────────────────────────────────────────
  const completedSections = [
    { label: "Basic info",      done: !!(profile.name && profile.email) },
    { label: "Work experience", done: profile.experience.some(e => e.company) },
    { label: "Skills",          done: profile.skills.length > 0 },
    { label: "Projects",        done: profile.projects.some(p => p.name) },
    { label: "Education",       done: !!(profile.degree && profile.school) },
    { label: "Certifications",  done: profile.certifications.some(c => c.name) },
    { label: "Summary",         done: profile.summary.length > 40 },
  ];
  const completePct = Math.round(
    (completedSections.filter(s => s.done).length / completedSections.length) * 100
  );

  const analyzedJobs = jobs.filter(j => j.analyzed && j.score !== undefined);
  const bestScore = analyzedJobs.length ? Math.max(...analyzedJobs.map(j => j.score!)) : 0;
  const avgScore  = analyzedJobs.length
    ? Math.round(analyzedJobs.reduce((a, j) => a + j.score!, 0) / analyzedJobs.length) : 0;

  const bestJob = analyzedJobs.sort((a, b) => b.score! - a.score!)[0];

  // ── Compute real skill gaps from analyses ─────────────────────────────────
  const allMissing: Record<string, number> = {};
  Object.values(analyses).forEach(a => {
    a.missing_keywords?.forEach(k => {
      allMissing[k] = (allMissing[k] || 0) + 1;
    });
  });
  const topGaps = Object.entries(allMissing)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const scoreBg = (s: number) =>
    s >= 70 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : s >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

  const isProfileEmpty = !profile.name && profile.skills.length === 0;
  const firstName = profile.name?.split(" ")[0] || user?.name?.split(" ")[0] || "there";

  // ── NEW USER: onboarding empty state ─────────────────────────────────────
  if (isNewUser || isProfileEmpty) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Welcome card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 mb-5 text-center">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-4">
            <TrendingUp size={26} />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Welcome, {firstName}! 👋
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            Let's get your profile set up so AI can start matching you to jobs and generating
            optimized resumes. It takes about 3 minutes.
          </p>
        </div>

        {/* 3 steps */}
        <div className="grid grid-cols-1 gap-3 mb-5">
          {[
            {
              step: "01", icon: Upload, label: "Build your profile",
              sub: "Upload your existing resume or fill in your details manually.",
              action: "Go to Resume Builder", page: "builder",
              done: !isProfileEmpty,
            },
            {
              step: "02", icon: Briefcase, label: "Add a job description",
              sub: "Paste a job posting. AI extracts all the ATS keywords automatically.",
              action: "Add Job Description", page: "jobs",
              done: jobs.length > 0,
            },
            {
              step: "03", icon: BarChart2, label: "Run your first analysis",
              sub: "Get a match score, missing keywords, and an AI-optimized resume in 20 seconds.",
              action: "Go to Analyzer", page: "analyzer",
              done: analyzedJobs.length > 0,
            },
          ].map(({ step, icon: Icon, label, sub, action, page, done }) => (
            <div
              key={step}
              onClick={() => goTo(page)}
              className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all group
                ${done
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold font-display
                ${done ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"}`}>
                {done ? <CheckCircle size={18} /> : step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white font-display mb-0.5">{label}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{sub}</div>
              </div>
              {!done && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 shrink-0 group-hover:gap-2.5 transition-all">
                  {action} <ArrowRight size={12} />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600">
          Your data is saved as you go — come back any time to continue.
        </p>
      </div>
    );
  }

  // ── EXISTING USER: real dashboard ─────────────────────────────────────────
  return (
    <div className="max-w-5xl">

      {/* Welcome bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <h2 className="font-display font-bold text-xl text-white mb-1">
          Good to see you, {firstName} 👋
        </h2>
        <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
          Profile is{" "}
          <span className="text-indigo-400 font-semibold">{completePct}% complete</span>.
          {completePct < 100 && " Fill in the remaining sections to improve your ATS scores."}
          {bestScore > 0 && (
            <> Your best match is{" "}
              <span className="text-emerald-400 font-semibold">{bestScore}%</span>
              {bestJob && ` at ${bestJob.company}`}.
            </>
          )}
        </p>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => goTo("analyzer")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all"
          >
            <BarChart2 size={12} /> View Analyses
          </button>
          <button
            onClick={() => goTo("builder")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-lg border border-white/10 transition-all"
          >
            Edit profile →
          </button>
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3.5 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-display">
            Profile completeness
          </span>
          <span className="text-sm font-bold text-indigo-400 font-display">{completePct}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-700"
            style={{ width: `${completePct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {completedSections.map(s => (
            <div
              key={s.label}
              className={`flex items-center gap-1.5 text-xs ${s.done ? "text-emerald-400" : "text-slate-500"}`}
            >
              {s.done ? <CheckCircle size={11} /> : <Clock size={11} />}
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Best Match",
            value: bestScore ? `${bestScore}%` : "—",
            sub: bestJob ? bestJob.company : "No analyses yet",
            color: bestScore >= 70 ? "text-emerald-400" : "text-slate-300",
          },
          {
            label: "Avg Score",
            value: avgScore ? `${avgScore}%` : "—",
            sub: `Across ${analyzedJobs.length} ${analyzedJobs.length === 1 ? "analysis" : "analyses"}`,
            color: avgScore >= 60 ? "text-amber-400" : "text-slate-300",
          },
          {
            label: "Jobs Tracked",
            value: jobs.length || "—",
            sub: `${analyzedJobs.length} fully analyzed`,
            color: "text-white",
          },
          {
            label: "Top Gap",
            value: topGaps[0]?.[0] || "—",
            sub: topGaps[0] ? `Missing in ${topGaps[0][1]} job${topGaps[0][1] > 1 ? "s" : ""}` : "Run an analysis",
            color: "text-white",
          },
        ].map(k => (
          <div key={k.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display mb-1.5">
              {k.label}
            </div>
            <div className={`text-2xl font-extrabold font-display leading-none ${k.color}`}>
              {k.value}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent jobs */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-white font-display">Recent Job Analyses</div>
        <button
          onClick={() => goTo("analyzer")}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {jobs.slice(0, 2).map(job => (
          <div
            key={job.id}
            onClick={() => goTo("analyzer")}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition-all relative"
          >
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${job.analyzed ? "bg-emerald-500" : "bg-slate-600"}`} />
            <div className="flex gap-2.5 mb-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-bold text-white font-display shrink-0">
                {job.company[0]?.toUpperCase()}
              </div>
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

        {jobs.length < 2 && (
          <div
            onClick={() => goTo("jobs")}
            className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Plus size={16} />
            </div>
            <div className="text-xs font-semibold text-slate-400">Add new job</div>
          </div>
        )}
      </div>

      {/* Skills gap — only shown when there are real analyses */}
      {topGaps.length > 0 && (
        <>
          <div className="text-sm font-bold text-white font-display mb-3">
            Skills Gap — Across All Jobs
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="space-y-3">
              {topGaps.map(([skill, count]) => {
                const pct = Math.round((count / jobs.length) * 100);
                return (
                  <div key={skill}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">{skill}</span>
                      <span className="font-bold text-amber-400">
                        Missing in {count}/{jobs.length} job{count > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10.5px] text-slate-500 mt-3">
              Add these skills to your profile and re-run the analysis to boost your match score.
            </p>
          </div>
        </>
      )}

      {/* Prompt to analyze if no analyses yet */}
      {jobs.length > 0 && analyzedJobs.length === 0 && (
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <BarChart2 size={18} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white font-display mb-1">Ready to analyze</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              You have {jobs.length} job{jobs.length > 1 ? "s" : ""} saved. Go to Analyzer and click
              "Run Analysis" to get your match score and AI-optimized resume.
            </p>
          </div>
          <button
            onClick={() => goTo("analyzer")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all shrink-0"
          >
            Analyze <ArrowRight size={11} />
          </button>
        </div>
      )}
    </div>
  );
}