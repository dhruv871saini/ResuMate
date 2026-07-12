// components/ui/AuthModal.tsx
"use client";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";

interface Props { onClose: () => void; initialTab?: "login" | "signup" }

export default function AuthModal({ onClose, initialTab = "login" }: Props) {
  const [tab, setTab]         = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const { loginWithApi, signupWithApi, showToast } = useStore();

  const [ld, setL] = useState({ email: "", password: "" });
  const [sd, setS] = useState({ firstName: "", lastName: "", email: "", password: "" });

  async function doLogin() {
    if (!ld.email || !ld.password) { showToast("Enter email and password", "err"); return; }
    setLoading(true);
    try {
      await loginWithApi(ld.email, ld.password);
      onClose(); showToast("Welcome back!", "ok");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Login failed", "err");
    } finally { setLoading(false); }
  }

  async function doSignup() {
    if (!sd.firstName || !sd.email || !sd.password) { showToast("Fill all fields", "err"); return; }
    if (sd.password.length < 8) { showToast("Password needs 8+ characters", "err"); return; }
    setLoading(true);
    try {
      await signupWithApi(`${sd.firstName} ${sd.lastName}`.trim(), sd.email, sd.password);
      onClose(); showToast(`Welcome, ${sd.firstName}!`, "ok");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Signup failed", "err");
    } finally { setLoading(false); }
  }

  const inp = "w-full bg-surface border border-violet-800/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors disabled:opacity-50";
  const lbl = "block text-[10.5px] font-bold text-slate-400 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-ink-2 border border-violet-900/50 rounded-2xl p-7 w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-surface-2 transition-colors">
          <X size={16} /></button>
        <div className="text-center mb-6">
          <div className="w-11 h-11 bg-gradient-to-br from-red-500 via-fuchsia-500 to-emerald-400 rounded-xl flex items-center justify-center text-white font-bold text-lg font-display mx-auto mb-3">R</div>
          <h2 className="text-xl font-bold text-white font-display">{tab === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-slate-400 text-sm mt-1">{tab === "login" ? "Sign in to your Resumate account" : "Build a resume that actually gets read"}</p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 gap-1 mb-5">
          {(["login", "signup"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tab === t ? "bg-fuchsia-500 text-white" : "text-slate-400 hover:text-slate-200"}`}>
              {t === "login" ? "Sign in" : "Create account"}</button>
          ))}
        </div>
        {tab === "login" ? (
          <div className="flex flex-col gap-3">
            <div><label className={lbl}>Email</label><input type="email" value={ld.email} placeholder="you@email.com" disabled={loading} className={inp} onChange={(e) => setL({ ...ld, email: e.target.value })} /></div>
            <div><label className={lbl}>Password</label><input type="password" value={ld.password} placeholder="••••••••" disabled={loading} className={inp} onChange={(e) => setL({ ...ld, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && doLogin()} /></div>
            <button onClick={doLogin} disabled={loading} className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}{loading ? "Signing in…" : "Sign in"}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>First name</label><input value={sd.firstName} placeholder="Dhruv" disabled={loading} className={inp} onChange={(e) => setS({ ...sd, firstName: e.target.value })} /></div>
              <div><label className={lbl}>Last name</label><input value={sd.lastName} placeholder="Saini" disabled={loading} className={inp} onChange={(e) => setS({ ...sd, lastName: e.target.value })} /></div>
            </div>
            <div><label className={lbl}>Email</label><input type="email" value={sd.email} placeholder="you@email.com" disabled={loading} className={inp} onChange={(e) => setS({ ...sd, email: e.target.value })} /></div>
            <div><label className={lbl}>Password</label><input type="password" value={sd.password} placeholder="Min 8 characters" disabled={loading} className={inp} onChange={(e) => setS({ ...sd, password: e.target.value })} /></div>
            <button onClick={doSignup} disabled={loading} className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}{loading ? "Creating account…" : "Create account — it's free"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
