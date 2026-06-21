"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function Toast() {
  const { toast, clearToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    ok: <CheckCircle size={15} className="text-emerald-400 shrink-0" />,
    err: <XCircle size={15} className="text-red-400 shrink-0" />,
    info: <Info size={15} className="text-indigo-400 shrink-0" />,
  };
  const borders = { ok: "border-l-emerald-500", err: "border-l-red-500", info: "border-l-indigo-500" };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-lg
        bg-slate-800 border border-slate-600 border-l-4 ${borders[toast.type]}
        shadow-2xl text-sm text-slate-100 max-w-xs animate-in slide-in-from-bottom-4 duration-200`}
    >
      {icons[toast.type]}
      {toast.message}
    </div>
  );
}
