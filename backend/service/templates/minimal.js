export function minimalTemplate(data) {
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
        <strong>${edu.degree || ""}</strong>${edu.field ? ` in ${edu.field}` : ""} —
        ${edu.institution || ""}
      </div>
      <div class="job-date">${edu.year || ""}</div>
    </div>
  `,
    )
    .join("");

  const projectsHtml = projects.length
    ? `
    <div class="section-title">Projects</div>
    <hr class="divider">
    ${projects
      .map(
        (p) => `
      <div class="job">
        <div class="job-header">
          <div class="job-title">${p.name || ""}</div>
          <div class="job-date">${(p.tech || []).join(" · ")}</div>
        </div>
        <p style="font-size:10.5px;margin:4px 0 0;color:#555;line-height:1.6">${p.description || ""}</p>
      </div>
    `,
      )
      .join("")}
  `
    : "";

  const achievementsHtml = achievements.length
    ? `
    <div class="section-title">Achievements</div>
    <hr class="divider">
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
    font-family: 'Georgia', serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #fff;
    padding: 40px 50px;
    line-height: 1.6;
  }
  .name    { font-size: 26px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .contact { font-size: 10px; color: #888; letter-spacing: 0.5px; margin-bottom: 26px; }
  .contact span { margin-right: 18px; }
  .divider { border: none; border-top: 0.5px solid #ccc; margin: 4px 0 12px; }
  .section-title {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px;
    color: #888; margin: 22px 0 4px;
  }
  .summary    { font-size: 11px; line-height: 1.7; color: #444; font-style: italic; }
  .skills-line { font-size: 10.5px; color: #555; line-height: 1.9; }
  .job        { margin-bottom: 15px; }
  .job-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .job-title  { font-weight: 700; font-size: 11px; }
  .job-company { font-size: 10.5px; color: #666; margin-top: 1px; }
  .job-date   { font-size: 10px; color: #aaa; white-space: nowrap; }
  ul          { padding-left: 14px; margin-top: 5px; }
  li          { font-size: 10.5px; margin-bottom: 3px; }
  .edu-row    { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 10.5px; }
</style>
</head>
<body>

  <div class="name">${name}</div>
  <div class="contact">
    ${email ? `<span>${email}</span>` : ""}
    ${phone ? `<span>${phone}</span>` : ""}
    ${location ? `<span>${location}</span>` : ""}
  </div>

  ${
    summary
      ? `
    <div class="section-title">About</div>
    <hr class="divider">
    <div class="summary">${summary}</div>
  `
      : ""
  }

  ${
    skills.length
      ? `
    <div class="section-title">Skills</div>
    <hr class="divider">
    <div class="skills-line">${skills.join(" · ")}</div>
  `
      : ""
  }

  ${
    experience.length
      ? `
    <div class="section-title">Experience</div>
    <hr class="divider">
    ${experienceHtml}
  `
      : ""
  }

  ${
    education.length
      ? `
    <div class="section-title">Education</div>
    <hr class="divider">
    ${educationHtml}
  `
      : ""
  }

  ${projectsHtml}
  ${achievementsHtml}

</body>
</html>`;
}
