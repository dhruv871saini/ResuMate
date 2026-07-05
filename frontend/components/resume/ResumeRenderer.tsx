"use client";
import { useStore, ResumeProfile } from "@/store/useStore";

type Template = "modern" | "classic" | "executive" | "minimal";

interface Props {
  template?: Template;
  scale?: number;
}

function contacts(p: ResumeProfile) {
  return [p.email, p.phone, p.linkedin, p.github].filter(Boolean);
}

function Modern({ p }: { p: ResumeProfile }) {
  return (
    <div className="resume-paper font-sans text-[#1a202c]">
      {/* Header */}
      <div style={{ background: "#1a2540", padding: "22px 24px 16px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>{p.name}</div>
        <div style={{ fontSize: 9, color: "#a5b4fc", letterSpacing: "1.3px", textTransform: "uppercase", marginTop: 3 }}>{p.role}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          {contacts(p).map((c) => <div key={c} style={{ fontSize: 9.5, color: "#a5b4fc" }}>{c}</div>)}
        </div>
      </div>
      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "148px 1fr" }}>
        {/* Sidebar */}
        <div style={{ background: "#f0f4ff", padding: "15px 12px" }}>
          {p.skills.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6366f1", borderBottom: "1.5px solid #6366f1", paddingBottom: 3, marginBottom: 7 }}>Skills</div>
              {p.skills.slice(0, 9).map((s, i) => (
                <div key={s} style={{ marginBottom: 5 }}>
                  <div style={{ fontSize: 9, fontWeight: 500, color: "#1a2540", marginBottom: 2 }}>{s}</div>
                  <div style={{ height: 2.5, background: "#dde3f0", borderRadius: 2 }}>
                    <div style={{ height: "100%", background: "#6366f1", borderRadius: 2, width: `${Math.max(40, 95 - i * 7)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {p.degree && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6366f1", borderBottom: "1.5px solid #6366f1", paddingBottom: 3, marginBottom: 7 }}>Education</div>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "#1a2540" }}>{p.degree}</div>
              <div style={{ fontSize: 8.5, color: "#64748b" }}>{p.school}</div>
              <div style={{ fontSize: 8.5, color: "#64748b" }}>{p.eduStart}–{p.eduEnd}</div>
            </div>
          )}
          {p.certifications.filter(c => c.name).length > 0 && (
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6366f1", borderBottom: "1.5px solid #6366f1", paddingBottom: 3, marginBottom: 7 }}>Certifications</div>
              {p.certifications.filter(c => c.name).map((c) => (
                <div key={c.id} style={{ fontSize: 8.5, color: "#64748b", marginBottom: 2 }}>✓ {c.name}{c.issuer ? ` — ${c.issuer}` : ""}</div>
              ))}
            </div>
          )}
        </div>
        {/* Main */}
        <div style={{ padding: "15px 18px" }}>
          {p.summary && (
            <div style={{ marginBottom: 11 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6366f1", borderBottom: "1.5px solid #6366f1", paddingBottom: 3, marginBottom: 7 }}>Summary</div>
              <div style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.6 }}>{p.summary}</div>
            </div>
          )}
          {p.experience.length > 0 && (
            <div style={{ marginBottom: 11 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6366f1", borderBottom: "1.5px solid #6366f1", paddingBottom: 3, marginBottom: 7 }}>Experience</div>
              {p.experience.map((e) => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a2540" }}>{e.title}</div>
                  <div style={{ fontSize: 9, color: "#6366f1", fontWeight: 600 }}>{e.company}</div>
                  <div style={{ fontSize: 8.5, color: "#94a3b8", marginTop: 1 }}>{e.start} – {e.current ? "Present" : e.end || "Present"}</div>
                  {e.bullets.split("\n").filter(Boolean).slice(0, 5).map((b, i) => (
                    <div key={i} style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.55, paddingLeft: 10, position: "relative", marginTop: 3 }}>
                      <span style={{ position: "absolute", left: 0, color: "#6366f1", fontSize: 7, top: 2 }}>▸</span>{b}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {p.projects.length > 0 && (
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6366f1", borderBottom: "1.5px solid #6366f1", paddingBottom: 3, marginBottom: 7 }}>Projects</div>
              {p.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1a2540" }}>{proj.name}{proj.year ? ` · ${proj.year}` : ""}</div>
                  <div style={{ fontSize: 8.5, color: "#6366f1", marginTop: 1 }}>{proj.stack}</div>
                  <div style={{ fontSize: 8.5, color: "#374151", marginTop: 2, lineHeight: 1.5 }}>{proj.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Classic({ p }: { p: ResumeProfile }) {
  return (
    <div className="resume-paper font-sans">
      <div style={{ padding: "22px 26px 16px", borderBottom: "2.5px solid #1a2540", textAlign: "center" }}>
        <div style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", color: "#1a2540", letterSpacing: "-0.3px" }}>{p.name}</div>
        <div style={{ fontSize: 9.5, color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>{p.role}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
          {contacts(p).map((c) => <div key={c} style={{ fontSize: 9.5, color: "#475569" }}>{c}</div>)}
        </div>
      </div>
      <div style={{ padding: "16px 26px" }}>
        {p.summary && <><div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "#1a2540", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 8 }}>Professional Summary</div><div style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.65, marginBottom: 13 }}>{p.summary}</div></>}
        {p.experience.length > 0 && <>
          <div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "#1a2540", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 8 }}>Experience</div>
          {p.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a2540" }}>{e.title} · {e.company}</div>
                <div style={{ fontSize: 9, color: "#94a3b8" }}>{e.start}–{e.current ? "Present" : e.end}</div>
              </div>
              {e.bullets.split("\n").filter(Boolean).slice(0, 5).map((b, i) => (
                <div key={i} style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.55, paddingLeft: 11, position: "relative", marginTop: 3 }}>
                  <span style={{ position: "absolute", left: 3, color: "#94a3b8" }}>•</span>{b}
                </div>
              ))}
            </div>
          ))}
        </>}
        {p.projects.length > 0 && <>
          <div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "#1a2540", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 8, marginTop: 12 }}>Projects</div>
          {p.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1a2540" }}>{proj.name} <span style={{ fontSize: 8.5, color: "#6366f1" }}>· {proj.stack}</span></div>
              <div style={{ fontSize: 8.5, color: "#374151", marginTop: 2, lineHeight: 1.5 }}>{proj.desc}</div>
            </div>
          ))}
        </>}
        {p.degree && <>
          <div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "#1a2540", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 8, marginTop: 12 }}>Education</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a2540" }}>{p.degree} · {p.school}</div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>{p.eduStart}–{p.eduEnd}</div>
          </div>
        </>}
        {p.skills.length > 0 && <>
          <div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "#1a2540", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 8, marginTop: 12 }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {p.skills.map((s) => <span key={s} style={{ fontSize: 9.5, color: "#475569", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: 3 }}>{s}</span>)}
          </div>
        </>}
        {p.certifications.filter(c => c.name).length > 0 && <>
          <div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "#1a2540", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 8, marginTop: 12 }}>Certifications</div>
          {p.certifications.filter(c => c.name).map((c) => <div key={c.id} style={{ fontSize: 9, color: "#374151", marginBottom: 2 }}>· {c.name}{c.issuer ? ` — ${c.issuer}` : ""}</div>)}
        </>}
      </div>
    </div>
  );
}

function Purple({ p }: { p: ResumeProfile }) {
  return (
    <div className="resume-paper font-sans">
      <div style={{ padding: "24px 26px 18px", borderBottom: "3px solid #7C3AED", textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1a2540", letterSpacing: "1px", textTransform: "uppercase" }}>{p.name}</div>
        <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 4 }}>{p.role}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
          {contacts(p).map((c) => <div key={c} style={{ fontSize: 9.5, color: "#475569" }}>{c}</div>)}
        </div>
      </div>
      <div style={{ padding: "16px 26px" }}>
        {p.summary && <><div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", borderBottom: "1.5px solid #E9D5FF", paddingBottom: 4, marginBottom: 8, letterSpacing: ".5px", textTransform: "uppercase" }}>Summary</div><div style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.65, marginBottom: 14 }}>{p.summary}</div></>}
        {p.experience.length > 0 && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", borderBottom: "1.5px solid #E9D5FF", paddingBottom: 4, marginBottom: 8, letterSpacing: ".5px", textTransform: "uppercase" }}>Work Experience</div>
          {p.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a2540" }}>{e.title} · {e.company}</div>
                <div style={{ fontSize: 9, color: "#94a3b8", fontStyle: "italic" }}>{e.start} – {e.current ? "Present" : e.end}</div>
              </div>
              {e.bullets.split("\n").filter(Boolean).slice(0, 5).map((b, i) => (
                <div key={i} style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.55, paddingLeft: 12, position: "relative", marginTop: 3 }}>
                  <span style={{ position: "absolute", left: 3, color: "#7C3AED" }}>•</span>{b}
                </div>
              ))}
            </div>
          ))}
        </>}
        {p.degree && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", borderBottom: "1.5px solid #E9D5FF", paddingBottom: 4, marginBottom: 8, marginTop: 12, letterSpacing: ".5px", textTransform: "uppercase" }}>Education</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a2540" }}>{p.degree}</div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>{p.eduStart}–{p.eduEnd}</div>
          </div>
          <div style={{ fontSize: 8.5, color: "#475569" }}>{p.school}</div>
        </>}
        {(p.skills.length > 0 || p.certifications.filter(c => c.name).length > 0) && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", borderBottom: "1.5px solid #E9D5FF", paddingBottom: 4, marginBottom: 8, marginTop: 12, letterSpacing: ".5px", textTransform: "uppercase" }}>Additional Information</div>
          {p.skills.length > 0 && <>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Technical Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
              {p.skills.map((s) => <span key={s} style={{ fontSize: 9.5, color: "#475569", border: "1px solid #E9D5FF", padding: "2px 8px", borderRadius: 3 }}>{s}</span>)}
            </div>
          </>}
          {p.certifications.filter(c => c.name).length > 0 && <>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Certifications</div>
            {p.certifications.filter(c => c.name).map((c) => <div key={c.id} style={{ fontSize: 9, color: "#374151", marginBottom: 3 }}>✓ {c.name}{c.issuer ? ` — ${c.issuer}` : ""}</div>)}
          </>}
        </>}
      </div>
    </div>
  );
}

function Minimal({ p }: { p: ResumeProfile }) {
  const skills = p.skills;
  return (
    <div className="resume-paper font-sans">
      <div style={{ padding: "24px 26px 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 300, letterSpacing: "3.5px", textTransform: "uppercase", color: "#1a202c" }}>{p.name}</div>
        <div style={{ fontSize: 8.5, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginTop: 5 }}>{p.role}</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
          {contacts(p).map((c) => <div key={c} style={{ fontSize: 9, color: "#94a3b8" }}>{c}</div>)}
        </div>
      </div>
      <div style={{ padding: "0 26px 20px" }}>
        {p.summary && <><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 5, marginTop: 14 }}>Summary</div><div style={{ height: 1, background: "#f1f5f9", marginBottom: 9 }} /><div style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.65 }}>{p.summary}</div></>}
        {p.experience.length > 0 && <><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 5, marginTop: 14 }}>Experience</div><div style={{ height: 1, background: "#f1f5f9", marginBottom: 9 }} />
          {p.experience.map((e) => (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, marginBottom: 9 }}>
              <div style={{ fontSize: 8.5, color: "#94a3b8", lineHeight: 1.4 }}>{e.start}<br />{e.current ? "Now" : e.end}</div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a202c" }}>{e.title}</div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>{e.company}</div>
                {e.bullets.split("\n").filter(Boolean).slice(0, 4).map((b, i) => <div key={i} style={{ fontSize: 9, color: "#374151", lineHeight: 1.55, marginTop: 2 }}>— {b}</div>)}
              </div>
            </div>
          ))}
        </>}
        {p.projects.length > 0 && <><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 5, marginTop: 14 }}>Projects</div><div style={{ height: 1, background: "#f1f5f9", marginBottom: 9 }} />
          {p.projects.map((proj) => (
            <div key={proj.id} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, marginBottom: 9 }}>
              <div style={{ fontSize: 8, color: "#94a3b8", lineHeight: 1.4 }}>{(proj.stack || "").split(",")[0]}<br />{proj.year}</div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1a202c" }}>{proj.name}</div>
                <div style={{ fontSize: 8.5, color: "#374151", marginTop: 2, lineHeight: 1.5 }}>{proj.desc}</div>
              </div>
            </div>
          ))}
        </>}
        {p.degree && <><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 5, marginTop: 14 }}>Education</div><div style={{ height: 1, background: "#f1f5f9", marginBottom: 9 }} /><div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10 }}><div style={{ fontSize: 8.5, color: "#94a3b8" }}>{p.eduStart}<br />{p.eduEnd}</div><div><div style={{ fontSize: 10.5, fontWeight: 700, color: "#1a202c" }}>{p.degree}</div><div style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>{p.school}</div></div></div></>}
        {skills.length > 0 && <><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 5, marginTop: 14 }}>Skills</div><div style={{ height: 1, background: "#f1f5f9", marginBottom: 9 }} /><div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{skills.map((s, i) => <span key={s} style={{ fontSize: 9, color: "#374151" }}>{s}{i < skills.length - 1 ? " · " : ""}</span>)}</div></>}
      </div>
    </div>
  );
}

export default function ResumeRenderer({ template, scale = 1 }: Props) {
  const { profile, activeTemplate } = useStore();
  const tpl = template || activeTemplate;

  const content = tpl === "modern" ? <Modern p={profile} />
    : tpl === "classic" ? <Classic p={profile} />
    : tpl === "executive" ? <Purple p={profile} />
    : <Minimal p={profile} />;

  if (scale !== 1) {
    return (
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: `${100 / scale}%`, marginLeft: `${(100 - 100 / scale) / 2}%` }}>
        {content}
      </div>
    );
  }
  return content;
}