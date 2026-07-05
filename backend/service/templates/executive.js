export function executiveTemplate(data) {
  const {
    name = "",
    email = "",
    phone = "",
    location = "",
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    achievements = [],
  } = data;

  const currentRole = experience[0]?.title || "";

  const experienceHtml = experience
    .map(
      (exp) => `
    <div class="job">
      <div class="job-header">
        <div>
          <div class="job-title">${exp.title || ""}</div>
          <div class="job-company">${exp.company || ""}</div>
        </div>
        <div class="job-date">${exp.start || ""} – ${exp.end || ""}</div>
      </div>
      <ul>${(exp.bullets || []).map((b) => `<li>${b}</li>`).join("")}</ul>
    </div>
  `,
    )
    .join("");

  const educationHtml = education
    .map(
      (edu) => `
    <div class="edu-row">
      <div>
        <div class="edu-degree">${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}</div>
        <div class="edu-inst">${edu.institution || ""}</div>
      </div>
      <div class="job-date">${edu.year || ""}</div>
    </div>
  `,
    )
    .join("");

  const projectsHtml = projects.length
    ? `
    <div class="section-title">Projects</div>
    ${projects
      .map(
        (p) => `
      <div class="job">
        <div class="job-header">
          <div class="job-title">${p.name || ""}</div>
          <div style="font-size:10px;color:#0F6E56">${(p.tech || []).join(" · ")}</div>
        </div>
        <p style="font-size:10.5px;margin:4px 0 0;color:#444;line-height:1.5">${p.description || ""}</p>
      </div>
    `,
      )
      .join("")}
  `
    : "";

  const achievementsHtml = achievements.length
    ? `
    <div class="section-title">Achievements</div>
    <ul>${achievements.map((a) => `<li>${a}</li>`).join("")}</ul>
  `
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Arial', sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }

  .header  { background: #0F6E56; color: #fff; padding: 24px 40px 20px; }
  .name    { font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
  .role    { font-size: 11px; color: rgba(255,255,255,0.65); margin-top: 3px; }

  .contact-bar {
    background: #E1F5EE;
    padding: 7px 40px;
    display: flex; gap: 28px;
  }
  .contact-bar span { font-size: 10px; color: #0F6E56; }

  .body { padding: 18px 40px 32px; }

  .section-title {
    font-size: 11.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    color: #0F6E56;
    border-left: 3px solid #0F6E56;
    padding-left: 8px;
    margin: 18px 0 10px;
  }
  .summary    { font-size: 11px; line-height: 1.65; color: #444; }
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill {
    background: #E1F5EE; border: 1px solid #9FE1CB;
    color: #085041; padding: 2px 9px;
    border-radius: 3px; font-size: 10px;
  }
  .job        { margin-bottom: 13px; }
  .job-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .job-title  { font-weight: 700; font-size: 11.5px; }
  .job-company { font-size: 11px; color: #0F6E56; margin-top: 1px; }
  .job-date   { font-size: 10px; color: #999; white-space: nowrap; }
  ul          { padding-left: 15px; margin-top: 5px; }
  li          { font-size: 10.5px; margin-bottom: 3px; line-height: 1.5; }
  .edu-row    { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .edu-degree { font-weight: 600; font-size: 11px; }
  .edu-inst   { font-size: 10.5px; color: #666; }
</style>
</head>
<body>

  <div class="header">
    <div class="name">${name}</div>
    ${currentRole ? `<div class="role">${currentRole}</div>` : ""}
  </div>

  <div class="contact-bar">
    ${email ? `<span>✉ ${email}</span>` : ""}
    ${phone ? `<span>📞 ${phone}</span>` : ""}
    ${location ? `<span>📍 ${location}</span>` : ""}
  </div>

  <div class="body">

    ${summary ? `<div class="section-title">Executive Summary</div><div class="summary">${summary}</div>` : ""}

    ${
      skills.length
        ? `
      <div class="section-title">Core Competencies</div>
      <div class="skills-wrap">${skills.map((s) => `<span class="skill">${s}</span>`).join("")}</div>
    `
        : ""
    }

    ${
      experience.length
        ? `
      <div class="section-title">Professional Experience</div>
      ${experienceHtml}
    `
        : ""
    }

    ${
      education.length
        ? `
      <div class="section-title">Education</div>
      ${educationHtml}
    `
        : ""
    }

    ${projectsHtml}
    ${achievementsHtml}

  </div>

</body>
</html>`;
}
