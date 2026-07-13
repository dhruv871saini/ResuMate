"use client";
import { useState, useEffect } from "react";
import type { PageId, NavigateFn } from "@/lib/navigation";
import { LayoutDashboard, FileText, Search, Briefcase, LayoutTemplate, Sun, Moon, LogOut, Plus, PenLine } from "lucide-react";
import { useStore } from "@/store/useStore";
import { setToken } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import DashboardPage from "@/components/pages/DashboardPage";
import BuilderPage from "@/components/pages/BuilderPage";
import AnalyzerPage from "@/components/pages/AnalyzerPage";
import JobsPage from "@/components/pages/JobsPage";
import TemplatesPage from "@/components/pages/TemplatesPage";
import MyResumesPage from "@/components/pages/MyreumePage";


interface NavItem { id: PageId; label: string; icon: React.ElementType; badge?: string }

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "builder", label: "Resume Builder", icon: FileText },
  { id: "analyzer", label: "ATS Analyzer", icon: Search, badge: "3" },
  { id: "jobs", label: "Job Descriptions", icon: Briefcase },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
];

const PAGE_META: Record<PageId, { title: string; sub: string }> = {
  dashboard: { title: "Dashboard", sub: "Your resume performance at a glance" },
  builder: { title: "Resume Builder", sub: "Your profile updates live as you type" },
  analyzer: { title: "ATS Analyzer", sub: "Mogi I/O · 82% match" },
  jobs: { title: "Job Descriptions", sub: "Track and analyze job descriptions" },
  templates: { title: "Templates", sub: "4 ATS-safe professional designs" },
  resumes: { title: "My Resumes", sub: "Saved PDFs generated from your analyses" },
};

export default function AppShell() {
  const [page, setPage] = useState<PageId>("dashboard");
  const { theme, toggleTheme, logout, user, showToast, isLoggedIn, token, fetchJobs, fetchAnalyses } = useStore();

  // Reload jobs + analyses from backend when session is restored after refresh
  useEffect(() => {
    if (!isLoggedIn || !token) return;
    setToken(token);
    void Promise.all([fetchJobs(), fetchAnalyses()]);
  }, [isLoggedIn, token, fetchJobs, fetchAnalyses]);

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "DS";

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage goTo={(p: PageId) => setPage(p)} />;
      case "builder": return <BuilderPage />;
      case "analyzer": return <AnalyzerPage />;
      case "jobs": return <JobsPage />;
      case "templates": return <TemplatesPage goTo={(p: PageId) => setPage(p)} />;
      case "resumes": return <MyResumesPage goTo={(p: PageId) => setPage(p)} />;
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <aside className="w-52 bg-ink-2/80 backdrop-blur-md border-r border-violet-900/30 flex flex-col shrink-0">
        <div className="px-3.5 py-4 border-b border-violet-900/30 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-red-500 via-fuchsia-500 to-emerald-400 rounded-lg flex items-center justify-center text-xs font-extrabold text-white font-display shrink-0">R</div>
          <div>
            <div className="text-sm font-bold text-white font-display leading-none">Resumate</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">ATS Optimizer</div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest px-2.5 py-2 font-display">Workspace</div>
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setPage(id)}
              className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all mb-0.5 ${page === id ? "bg-fuchsia-500 text-white" : "text-slate-400 hover:bg-surface hover:text-slate-100"}`}>
              <Icon size={15} className="shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${page === id ? "bg-white/20 text-white" : "bg-fuchsia-500/20 text-lime-300"}`}>{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="px-2 py-3 border-t border-violet-900/30">
          <div className="flex items-center gap-2 px-2.5 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 via-fuchsia-500 to-emerald-400 flex items-center justify-center text-xs font-bold text-white shrink-0 font-display">{initials}</div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.name || "Dhruv Saini"}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email || "dhruvsaini871@gmail.com"}</div>
            </div>
          </div>
          <button onClick={toggleTheme} className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-slate-400 hover:bg-surface hover:text-slate-200 text-[12.5px] font-medium transition-all">
            <span className="flex items-center gap-2">{theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === "light" ? "bg-lime-500" : "bg-surface-3"}`}>
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${theme === "light" ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
          </button>
          <button onClick={() => { logout(); showToast("Signed out", "info"); }}
            className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-[12.5px] font-medium transition-all mt-0.5">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-13 bg-ink-2/80 backdrop-blur-md border-b border-violet-900/30 flex items-center px-5 gap-3 shrink-0" style={{ height: 52 }}>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-white font-display truncate">{PAGE_META[page].title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{PAGE_META[page].sub}</div>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => setPage("jobs")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 border border-lime-400/40 bg-fuchsia-500/10 rounded-lg hover:bg-fuchsia-500/20 transition-all">
              <Plus size={12} /> Add Job
            </button>
            <button onClick={() => setPage("builder")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg transition-all">
              <PenLine size={12} /> Edit Resume
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 bg-transparent">{renderPage()}</main>
      </div>
      <Toast />
    </div>
  );
}