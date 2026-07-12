"use client";
import { useState, KeyboardEvent } from "react";
import { Plus, Trash2, Download, Link, CheckSquare, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import ResumeRenderer from "@/components/resume/ResumeRenderer";
import ResumeUpload from "@/components/ui/ResumeUpload";
import { downloadPDF } from "@/lib/api";

const TEMPLATES = ["modern", "classic", "executive", "minimal"] as const;
const TABS = ["Personal Info", "Experience", "Skills", "Projects", "Education & Certs", "Preview & Export"] as const;

function TemplateSwitch() {
  const { activeTemplate, setTemplate } = useStore();
  return (
    <div className="flex gap-1.5 flex-wrap">
      {TEMPLATES.map(t => (
        <button key={t} onClick={() => setTemplate(t)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all capitalize ${activeTemplate === t ? "bg-violet-500 text-white border-violet-500" : "border-violet-800/50 text-slate-400 hover:border-slate-400 hover:text-slate-200"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function PreviewPanel() {
  return (
    <div className="sticky top-0">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-display">Live Preview</div>
      <TemplateSwitch />
      <div className="mt-2.5 bg-ink-2 rounded-xl p-3 max-h-[calc(100vh-160px)] overflow-y-auto">
        <div style={{ transform: "scale(0.7)", transformOrigin: "top center", width: "143%", marginLeft: "-21.5%" }}>
          <ResumeRenderer />
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, className = "" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-surface border border-violet-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors w-full" />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="bg-surface border border-violet-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-y w-full leading-relaxed" />
    </div>
  );
}

function PersonalTab() {
  const { profile, updateProfile, showToast, saveProfileToBackend, isLoggedIn } = useStore();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!isLoggedIn) { showToast("Sign in to save your profile", "err"); return; }
    setSaving(true);
    try {
      await saveProfileToBackend();
      showToast("Profile saved!", "ok");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Save failed", "err");
    } finally { setSaving(false); }
  }

  return (
    <div>
      <ResumeUpload />
      <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5 mb-3">
        <div className="text-sm font-bold text-white font-display mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs">👤</span>
          Personal Information
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Full Name" value={profile.name} onChange={v => updateProfile({ name: v })} placeholder="Your full name" />
          <Input label="Target Role" value={profile.role} onChange={v => updateProfile({ role: v })} placeholder="e.g. Backend Engineer" />
          <Input label="Email" value={profile.email} onChange={v => updateProfile({ email: v })} placeholder="you@email.com" />
          <Input label="Phone" value={profile.phone} onChange={v => updateProfile({ phone: v })} placeholder="+91 ..." />
          <Input label="LinkedIn" value={profile.linkedin} onChange={v => updateProfile({ linkedin: v })} placeholder="linkedin.com/in/..." />
          <Input label="GitHub" value={profile.github} onChange={v => updateProfile({ github: v })} placeholder="github.com/..." />
          <div className="col-span-2">
            <Textarea label="Professional Summary" value={profile.summary} onChange={v => updateProfile({ summary: v })} placeholder="2–3 sentences about your background and target role..." rows={4} />
          </div>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-1.5 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all">
        {saving ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : <><CheckSquare size={14}/> Save & Sync</>}
      </button>
    </div>
  );
}

function ExperienceTab() {
  const { profile, addExperience, updateExperience, removeExperience } = useStore();
  return (
    <div>
      <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5 mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-white font-display flex items-center gap-2">
            <span className="text-violet-400">💼</span> Work Experience
          </div>
          <button onClick={addExperience} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-violet-800/50 text-slate-300 rounded-lg hover:bg-surface-2 transition-all">
            <Plus size={11} /> Add Position
          </button>
        </div>
        <div className="space-y-4">
          {profile.experience.map((exp, idx) => (
            <div key={exp.id} className="bg-surface-2/40 border border-violet-800/50/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Position {idx + 1}</span>
                  {exp.current && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Current</span>}
                </div>
                <button onClick={() => removeExperience(exp.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input label="Job Title" value={exp.title} onChange={v => updateExperience(exp.id, { title: v })} placeholder="Software Engineer" />
                <Input label="Company" value={exp.company} onChange={v => updateExperience(exp.id, { company: v })} placeholder="Company name" />
                <Input label="Start Date" value={exp.start} onChange={v => updateExperience(exp.id, { start: v })} placeholder="Jan 2023" />
                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">End Date</label>
                  <input value={exp.current ? "" : exp.end} onChange={e => updateExperience(exp.id, { end: e.target.value })}
                    disabled={exp.current} placeholder={exp.current ? "Present" : "Dec 2024"}
                    className="bg-surface border border-violet-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-40 w-full" />
                </div>
              </div>
              <label className="flex items-center gap-2 mb-3 cursor-pointer select-none"
                onClick={() => updateExperience(exp.id, { current: !exp.current, end: exp.current ? exp.end : "" })}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${exp.current ? "bg-violet-500 border-violet-500" : "border-slate-500 bg-surface"}`}>
                  {exp.current && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg>}
                </div>
                <span className="text-xs text-slate-300">I currently work here</span>
              </label>
              <Textarea label="Key Responsibilities (one per line)" value={exp.bullets} onChange={v => updateExperience(exp.id, { bullets: v })}
                placeholder="Built X using Y, achieving Z result..." rows={5} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={addExperience} className="flex items-center gap-1.5 px-4 py-2 border border-violet-800/50 text-slate-300 hover:bg-surface-2 text-sm font-semibold rounded-lg transition-all w-full justify-center">
        <Plus size={14} /> Add Another Position
      </button>
    </div>
  );
}

function SkillsTab() {
  const { profile, addSkill, removeSkill } = useStore();
  const [input, setInput] = useState("");

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      if (!profile.skills.includes(input.trim())) addSkill(input.trim());
      setInput("");
    }
  }

  const suggested = ["Kubernetes", "Kafka", "GraphQL", "Next.js", "AWS Lambda", "Terraform", "Go", "Python"];
  const toSuggest = suggested.filter(s => !profile.skills.includes(s));

  return (
    <div className="space-y-4">
      <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5">
        <div className="text-sm font-bold text-white font-display mb-4 flex items-center gap-2">
          <span className="text-violet-400">⚡</span> Technical Skills
        </div>
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-ink-2 border border-violet-900/50 rounded-lg min-h-[52px] mb-1.5 focus-within:border-violet-500 transition-colors"
          onClick={() => document.getElementById("skill-inp")?.focus()}>
          {profile.skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1 bg-violet-500/12 text-violet-300 border border-violet-500/30 text-xs px-2.5 py-1 rounded-full">
              {s}
              <button onClick={() => removeSkill(s)} className="text-violet-400/60 hover:text-violet-300 transition-colors leading-none">×</button>
            </span>
          ))}
          <input id="skill-inp" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={profile.skills.length ? "Add skill…" : "Type a skill and press Enter"}
            className="bg-transparent text-sm text-white placeholder-slate-600 outline-none min-w-[120px] py-0.5" />
        </div>
        <p className="text-[10.5px] text-slate-500">Press Enter to add · Click × to remove</p>
      </div>

      {toSuggest.length > 0 && (
        <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5">
          <div className="text-sm font-bold text-white font-display mb-3 flex items-center gap-2">
            <span className="text-lime-400">💡</span> Suggested for your job targets
          </div>
          <div className="space-y-2">
            {toSuggest.slice(0, 5).map(s => (
              <div key={s} className="flex items-center justify-between py-2 px-3 bg-surface-2/40 rounded-lg">
                <div>
                  <div className="text-xs font-semibold text-white">{s}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Appears in 2–4 of your tracked jobs</div>
                </div>
                <button onClick={() => addSkill(s)} className="px-2.5 py-1 bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold rounded-md transition-all">Add</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsTab() {
  const { profile, addProject, updateProject, removeProject } = useStore();
  return (
    <div>
      <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5 mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-white font-display flex items-center gap-2">
            <span className="text-violet-400">🖥</span> Projects
          </div>
          <button onClick={addProject} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-violet-800/50 text-slate-300 rounded-lg hover:bg-surface-2 transition-all">
            <Plus size={11} /> Add Project
          </button>
        </div>
        <div className="space-y-4">
          {profile.projects.map((proj, idx) => (
            <div key={proj.id} className="bg-surface-2/40 border border-violet-800/50/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">Project {idx + 1}</span>
                <button onClick={() => removeProject(proj.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Project Name" value={proj.name} onChange={v => updateProject(proj.id, { name: v })} placeholder="My Awesome Project" />
                <Input label="Year" value={proj.year} onChange={v => updateProject(proj.id, { year: v })} placeholder="2025" />
                <div className="col-span-2">
                  <Input label="Tech Stack" value={proj.stack} onChange={v => updateProject(proj.id, { stack: v })} placeholder="Node.js, React, PostgreSQL" />
                </div>
                <div className="col-span-2">
                  <Textarea label="Description" value={proj.desc} onChange={v => updateProject(proj.id, { desc: v })} placeholder="What does it do and why is it interesting?" rows={2} />
                </div>
                <div className="col-span-2">
                  <Input label="GitHub / Demo URL" value={proj.url} onChange={v => updateProject(proj.id, { url: v })} placeholder="github.com/..." />
                </div>
              </div>
            </div>
          ))}
          {profile.projects.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <div className="text-2xl mb-2">🖥</div>
              <div className="text-sm">No projects yet. Add your best work!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EducationTab() {
  const { profile, updateProfile, addCertification, updateCertification, removeCertification, showToast, saveProfileToBackend, isLoggedIn } = useStore();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!isLoggedIn) { showToast("Sign in to save", "err"); return; }
    setSaving(true);
    try {
      await saveProfileToBackend();
      showToast("Education & certs saved!", "ok");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Save failed", "err");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5">
        <div className="text-sm font-bold text-white font-display mb-4 flex items-center gap-2">
          <span className="text-violet-400">🎓</span> Education
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Input label="Degree & Field" value={profile.degree} onChange={v => updateProfile({ degree: v })} placeholder="B.Tech Computer Science" /></div>
          <div className="col-span-2"><Input label="Institution" value={profile.school} onChange={v => updateProfile({ school: v })} placeholder="University name" /></div>
          <Input label="Start Year" value={profile.eduStart} onChange={v => updateProfile({ eduStart: v })} placeholder="2020" />
          <Input label="End Year" value={profile.eduEnd} onChange={v => updateProfile({ eduEnd: v })} placeholder="2024" />
        </div>
      </div>
      <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-white font-display flex items-center gap-2">
            <span className="text-violet-400">🏅</span> Certifications
          </div>
          <button onClick={addCertification} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-violet-800/50 text-slate-300 rounded-lg hover:bg-surface-2 transition-all">
            <Plus size={11} /> Add
          </button>
        </div>
        {profile.certifications.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs">
            Add certifications like AWS, Docker, or GCP to boost ATS scores on specialized roles.
          </div>
        )}
        <div className="space-y-3">
          {profile.certifications.map((cert, idx) => (
            <div key={cert.id} className="bg-surface-2/40 border border-violet-800/50/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-300">Certification {idx + 1}</span>
                <button onClick={() => removeCertification(cert.id)} className="p-1 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Certification Name" value={cert.name} onChange={v => updateCertification(cert.id, { name: v })} placeholder="AWS Certified Developer" />
                <Input label="Issuer & Year" value={cert.issuer} onChange={v => updateCertification(cert.id, { issuer: v })} placeholder="Amazon · 2024" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all">
        {saving ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : <><CheckSquare size={14}/> Save & Sync</>}
      </button>
    </div>
  );
}

function PreviewExportTab() {
  const { showToast, activeTemplate, analyses, jobs } = useStore();
  const [pdfLoading, setPdfLoading] = useState(false);

  // Find the most recent analysis to use for PDF (highest score)
  const bestAnalysis = Object.values(analyses).sort((a, b) => b.score - a.score)[0];

  async function handleDownloadPDF() {
    if (!bestAnalysis) {
      showToast("Run an analysis first to generate optimized PDF", "err");
      return;
    }
    setPdfLoading(true);
    showToast("Generating PDF on server…", "info");
    try {
      const job = jobs.find(j => j.id === bestAnalysis.jobId);
      const filename = `resume_${job?.company || "resumate"}_${activeTemplate}.pdf`;
      await downloadPDF(bestAnalysis.id, activeTemplate, filename);
      showToast("PDF downloaded!", "ok");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "PDF failed";
      showToast(msg, "err");
    } finally {
      setPdfLoading(false);
    }
  }
  // Compute ATS readiness from real profile data
  const { profile: p } = useStore();
  const contactFields   = [p.name, p.email, p.phone, p.linkedin].filter(Boolean).length;
  const contactPct      = Math.round((contactFields / 4) * 100);
  const allBullets      = p.experience.flatMap(e => e.bullets.split("\n").filter(Boolean));
  const actionVerbs     = ["built","led","designed","developed","improved","reduced","increased","launched","managed","shipped","implemented","optimized","created","delivered","architected"];
  const actionPct       = allBullets.length
    ? Math.round((allBullets.filter(b => actionVerbs.some(v => b.toLowerCase().startsWith(v))).length / allBullets.length) * 100)
    : 0;
  const quantPct        = allBullets.length
    ? Math.round((allBullets.filter(b => /\d/.test(b)).length / allBullets.length) * 100)
    : 0;
  const skillsPct       = Math.min(100, Math.round((p.skills.length / 10) * 100));
  const summaryPct      = p.summary.length > 100 ? 100 : Math.round((p.summary.length / 100) * 100);

  const readiness = [
    { label: "Contact completeness", pct: contactPct, color: contactPct === 100 ? "bg-emerald-500" : "bg-lime-500", status: `${contactFields}/4 fields`, statusColor: contactPct === 100 ? "text-emerald-400" : "text-lime-400" },
    { label: "Skills listed",        pct: skillsPct,  color: skillsPct  >= 70  ? "bg-emerald-500" : "bg-lime-500", status: `${p.skills.length} skills`,  statusColor: skillsPct  >= 70  ? "text-emerald-400" : "text-lime-400" },
    { label: "Action verbs",         pct: actionPct,  color: actionPct  >= 60  ? "bg-emerald-500" : "bg-lime-500", status: `${actionPct}% of bullets`,  statusColor: actionPct  >= 60  ? "text-emerald-400" : "text-lime-400" },
    { label: "Quantified results",   pct: quantPct,   color: quantPct   >= 50  ? "bg-emerald-500" : "bg-lime-500", status: `${quantPct}% of bullets`,   statusColor: quantPct   >= 50  ? "text-emerald-400" : "text-lime-400" },
    { label: "Summary written",      pct: summaryPct, color: summaryPct === 100 ? "bg-emerald-500" : "bg-lime-500", status: summaryPct === 100 ? "Complete" : "Too short", statusColor: summaryPct === 100 ? "text-emerald-400" : "text-lime-400" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <TemplateSwitch />
          <div className="ml-auto flex gap-2">
            <button onClick={() => showToast("Link copied!", "ok")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-violet-800/50 text-slate-300 rounded-lg hover:bg-surface-2 transition-all">
              <Link size={11} /> Share
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg transition-all">
              {pdfLoading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
              {pdfLoading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>
        <div className="bg-ink-2 rounded-xl p-4">
          <div style={{ transform: "scale(0.75)", transformOrigin: "top center", width: "133%", marginLeft: "-16.5%" }}>
            <ResumeRenderer />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-4">
          <div className="text-xs font-bold text-white font-display mb-3 flex items-center gap-1.5">📊 ATS Readiness</div>
          <div className="space-y-2.5">
            {readiness.map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{r.label}</span>
                  <span className={`font-bold ${r.statusColor}`}>{r.status}</span>
                </div>
                <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface/60 border border-violet-900/50 rounded-xl p-4">
          <div className="text-xs font-bold text-white font-display mb-3">💡 Quick Improvements</div>
          <div className="space-y-2 text-xs">
            {contactPct < 100 && <div className="p-2.5 bg-lime-500/8 border border-lime-500/20 rounded-lg text-lime-200 leading-relaxed">Add your LinkedIn and phone number to complete your contact info.</div>}
            {p.certifications.length === 0 && <div className="p-2.5 bg-lime-500/8 border border-lime-500/20 rounded-lg text-lime-200 leading-relaxed">Add certifications (AWS, Docker, GCP) to boost ATS scores on specialized roles.</div>}
            {actionPct < 60 && <div className="p-2.5 bg-violet-500/8 border border-violet-500/20 rounded-lg text-violet-200 leading-relaxed">Start more bullet points with action verbs like Built, Led, Improved, Delivered.</div>}
            {quantPct < 50 && <div className="p-2.5 bg-violet-500/8 border border-violet-500/20 rounded-lg text-violet-200 leading-relaxed">Add numbers to your bullets — e.g. "reduced latency by 40%" or "led a team of 5".</div>}
            {p.skills.length < 5 && <div className="p-2.5 bg-red-500/8 border border-red-500/20 rounded-lg text-red-200 leading-relaxed">Add at least 8–10 skills to the Skills tab to improve ATS keyword matching.</div>}
            {contactPct === 100 && p.certifications.length > 0 && actionPct >= 60 && quantPct >= 50 && p.skills.length >= 5 && (
              <div className="p-2.5 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-emerald-200 leading-relaxed">✓ Great profile! Run an analysis to see how it matches your target jobs.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const [tab, setTab] = useState(0);
  const panels = [<PersonalTab />, <ExperienceTab />, <SkillsTab />, <ProjectsTab />, <EducationTab />, <PreviewExportTab />];

  return (
    <div className="max-w-6xl">
      {/* Tabs */}
      <div className="flex border-b border-violet-900/60 mb-5 overflow-x-auto">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all font-display ${tab === i ? "text-violet-400 border-violet-500" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid: form + live preview (hidden on preview tab) */}
      {tab < 5 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div>{panels[tab]}</div>
          <PreviewPanel />
        </div>
      ) : (
        panels[tab]
      )}
    </div>
  );
}