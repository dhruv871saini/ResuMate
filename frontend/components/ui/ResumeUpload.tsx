// components/ui/ResumeUpload.tsx
// Drag-and-drop upload → Cloudinary → Express AI parse → fills profile form
"use client";
import { useRef, useState } from "react";
import { Upload, FileText, CheckCircle, Loader2, AlertCircle, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { profileApi } from "@/lib/api";

type Status = "idle" | "uploading" | "parsing" | "done" | "error";

export default function ResumeUpload() {
  const { user, uploadedFileUrl, setUploadedFileUrl, updateProfile, showToast } = useStore();
  const [status, setStatus]     = useState<Status>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      showToast("Only PDF or DOCX files allowed", "err"); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large — max 5MB", "err"); return;
    }

    setFileName(file.name);
    setStatus("uploading");
    setErrorMsg("");

    try {
      // ── Step 1: Upload to Cloudinary via Next.js API route ──
      const form = new FormData();
      form.append("file", file);
      form.append("userId", user?.email || "anonymous");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");

      // Store URL in state so user can see what was uploaded
      setUploadedFileUrl(uploadData.url);
      setStatus("parsing");
      showToast("Uploaded! AI is now reading your resume…", "info");

      // ── Step 2: Send URL to Express backend → AI parses it ──
      const parsed = await profileApi.parseFromUrl(uploadData.url, uploadData.fileType);

      // ── Step 3: Merge ALL parsed fields into local profile state ──
      if (parsed.resume_data) {
        const r = parsed.resume_data as {
          name?: string; email?: string; phone?: string; location?: string;
          summary?: string; skills?: string[];
          experience?: Array<{ company: string; title: string; start: string; end: string; bullets: string[] }>;
          education?: Array<{ institution: string; degree: string; field: string; year: string }>;
          projects?: Array<{ name: string; description: string; tech: string[] }>;
          achievements?: string[];
        };

        // Map AI experience → store Experience shape
        const mappedExp = r.experience?.map((e, i) => ({
          id:      `exp-parsed-${i}-${Date.now()}`,
          title:   e.title   || "",
          company: e.company || "",
          start:   e.start   || "",
          end:     e.end === "Present" ? "" : (e.end || ""),
          current: e.end === "Present",
          // bullets array → newline-joined string for the textarea
          bullets: Array.isArray(e.bullets) ? e.bullets.join("\n") : "",
        })) ?? [];

        // Map AI projects → store Project shape
        const mappedProjects = r.projects?.map((p, i) => ({
          id:    `proj-parsed-${i}-${Date.now()}`,
          name:  p.name        || "",
          year:  "",
          stack: Array.isArray(p.tech) ? p.tech.join(", ") : "",
          desc:  p.description || "",
          url:   "",
        })) ?? [];

        // Education (take first entry if multiple)
        const edu = r.education?.[0];

        updateProfile({
          ...(r.name    && { name:    r.name    }),
          ...(r.email   && { email:   r.email   }),
          ...(r.phone   && { phone:   r.phone   }),
          ...(r.summary && { summary: r.summary }),
          ...(r.skills?.length  && { skills:     r.skills      }),
          ...(mappedExp.length  && { experience: mappedExp     }),
          ...(mappedProjects.length && { projects: mappedProjects }),
          ...(edu?.degree      && { degree:   edu.degree                      }),
          ...(edu?.institution && { school:   edu.institution                 }),
          ...(edu?.year        && { eduStart: edu.year.split("–")[0]?.trim()  }),
          ...(edu?.year        && { eduEnd:   edu.year.split("–")[1]?.trim() ?? "" }),
        });
      }

      setStatus("done");
      showToast("Resume parsed! Profile fields updated.", "ok");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setErrorMsg(msg);
      setStatus("error");
      showToast(msg, "err");
    }
  }

  function reset() {
    setStatus("idle");
    setFileName("");
    setErrorMsg("");
    setUploadedFileUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const isLoading = status === "uploading" || status === "parsing";

  return (
    <div className="mb-5">
      <div
        onDragOver={(e) => { e.preventDefault(); if (!isLoading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f && !isLoading) handleFile(f);
        }}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none
          ${dragging       ? "border-violet-400 bg-violet-500/10"
          : status === "done"  ? "border-emerald-500/50 bg-emerald-500/5 cursor-default"
          : status === "error" ? "border-red-500/50 bg-red-500/5"
          : "border-violet-800/50 hover:border-violet-500/50 hover:bg-surface/50"}`}
      >
        <input
          ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {/* Reset button */}
        {(status === "done" || status === "error") && (
          <button
            onClick={(e) => { e.stopPropagation(); reset(); }}
            className="absolute top-2.5 right-2.5 p-1 text-slate-500 hover:text-slate-300 rounded-md hover:bg-surface-2 transition-all"
          >
            <X size={14} />
          </button>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-2.5">
            <Loader2 size={26} className="text-violet-400 animate-spin" />
            <div className="text-sm font-semibold text-violet-300">
              {status === "uploading" ? "Uploading to Cloudinary…" : "AI is parsing your resume…"}
            </div>
            <div className="text-xs text-slate-500">{fileName}</div>
            <div className="text-xs text-slate-500">This takes ~15 seconds</div>
          </div>
        )}

        {status === "done" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={26} className="text-emerald-400" />
            <div className="text-sm font-semibold text-emerald-300">Resume parsed!</div>
            <div className="text-xs text-slate-400">{fileName} · Profile fields updated</div>
            {uploadedFileUrl && (
              <a
                href={uploadedFileUrl} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10.5px] text-violet-400 hover:underline mt-0.5"
              >
                View on Cloudinary ↗
              </a>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle size={26} className="text-red-400" />
            <div className="text-sm font-semibold text-red-300">Upload failed</div>
            <div className="text-xs text-slate-400">{errorMsg}</div>
            <div className="text-xs text-slate-500 mt-1">Click × to try again</div>
          </div>
        )}

        {status === "idle" && (
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Upload size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-1">
                Upload your existing resume
              </div>
              <div className="text-xs text-slate-400">
                Drag & drop or click to browse
              </div>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-[10.5px] text-slate-500">
                <FileText size={11} /> PDF
              </span>
              <span className="flex items-center gap-1 text-[10.5px] text-slate-500">
                <FileText size={11} /> DOCX
              </span>
              <span className="text-[10.5px] text-slate-500">Max 5 MB</span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              Stored on Cloudinary · AI extracts your skills, experience & education
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 mt-3">
        <div className="h-px flex-1 bg-surface-2/50" />
        <span className="text-[10.5px] text-slate-500">or fill in manually below</span>
        <div className="h-px flex-1 bg-surface-2/50" />
      </div>
    </div>
  );
}