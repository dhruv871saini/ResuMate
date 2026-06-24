export function classicTemplate(data) {
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

  const skillTags = skills
    .map((s) => `<span class="skill">${s}</span>`)
    .join("");

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
          <div class="job-date">${(p.tech || []).join(" · ")}</div>
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
  body {
    font-family: 'Arial', sans-serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #fff;
    padding: 32px 40px;
    line-height: 1.5;
  }
  .header {
    background: #1a1a2e;
    color: #fff;
    margin: -32px -40px 20px;
    padding: 24px 40px;
  }
  .name    { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
  .contact { font-size: 10px; color: #ccc; margin-top: 5px; }
  .contact span { margin-right: 16px; }
  .section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #1a1a2e;
    border-bottom: 2px solid #1a1a2e;
    padding-bottom: 3px;
    margin: 18px 0 10px;
  }
  .summary    { font-size: 11px; line-height: 1.65; color: #333; }
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill {
    background: #f0f0f4;
    border: 1px solid #d0d0d8;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 10px;
  }
  .job           { margin-bottom: 13px; }
  .job-header    { display: flex; justify-content: space-between; align-items: flex-start; }
  .job-title     { font-weight: 700; font-size: 11px; }
  .job-company   { font-size: 10.5px; color: #555; margin-top: 1px; }
  .job-date      { font-size: 10px; color: #888; white-space: nowrap; padding-top: 1px; }
  ul             { padding-left: 16px; margin-top: 5px; }
  li             { font-size: 10.5px; margin-bottom: 3px; line-height: 1.5; }
  .edu-row       { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .edu-degree    { font-weight: 600; font-size: 11px; }
  .edu-inst      { font-size: 10.5px; color: #666; margin-top: 1px; }
</style>
</head>
<body>

  <div class="header">
    <div class="name">${name}</div>
    <div class="contact">
      ${email ? `<span>✉ ${email}</span>` : ""}
      ${phone ? `<span>📞 ${phone}</span>` : ""}
      ${location ? `<span>📍 ${location}</span>` : ""}
    </div>
  </div>

  ${summary ? `<div class="section-title">Summary</div><div class="summary">${summary}</div>` : ""}

  ${
    skills.length
      ? `
    <div class="section-title">Skills</div>
    <div class="skills-wrap">${skillTags}</div>
  `
      : ""
  }

  ${
    experience.length
      ? `
    <div class="section-title">Experience</div>
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

</body>
</html>`;
}
