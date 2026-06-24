// service/templates/modern.js
// Two column — sidebar for contact/skills, main panel for experience.
// Still ATS-safe: Puppeteer outputs real searchable text, not images.

export function modernTemplate(data) {
  const {
    name = '', email = '', phone = '', location = '', summary = '',
    skills = [], experience = [], education = [], projects = [], achievements = []
  } = data;

  const experienceHtml = experience.map(exp => `
    <div class="job">
      <div class="job-header">
        <div>
          <div class="job-title">${exp.title || ''}</div>
          <div class="job-company">${exp.company || ''}</div>
        </div>
        <div class="job-date">${exp.start || ''} – ${exp.end || ''}</div>
      </div>
      <ul>${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
  `).join('');

  const educationHtml = education.map(edu => `
    <div class="edu-row">
      <div>
        <div class="edu-degree">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</div>
        <div class="edu-inst">${edu.institution || ''}</div>
      </div>
      <div class="job-date">${edu.year || ''}</div>
    </div>
  `).join('');

  const projectsHtml = projects.length ? `
    <div class="section-title">Projects</div>
    ${projects.map(p => `
      <div class="job">
        <div class="job-title" style="margin-bottom:3px">${p.name || ''}</div>
        <div style="font-size:10px;color:#534AB7;margin-bottom:3px">${(p.tech || []).join(' · ')}</div>
        <div style="font-size:10.5px;color:#333;line-height:1.5">${p.description || ''}</div>
      </div>
    `).join('')}
  ` : '';

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
    display: flex;
    min-height: 100vh;
  }
  .sidebar {
    width: 195px;
    min-width: 195px;
    background: #534AB7;
    color: #fff;
    padding: 28px 16px;
  }
  .main { flex: 1; padding: 28px 26px; }

  /* Sidebar */
  .avatar {
    width: 58px; height: 58px; border-radius: 50%;
    background: rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #fff;
    margin: 0 auto 12px;
  }
  .s-name  { font-size: 14px; font-weight: 700; text-align: center; margin-bottom: 4px; }
  .s-contact {
    font-size: 9.5px; color: rgba(255,255,255,0.7);
    text-align: center; line-height: 1.9; margin-bottom: 16px;
  }
  .s-title {
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    color: rgba(255,255,255,0.45); margin: 14px 0 7px;
  }
  .s-skill {
    font-size: 10px; color: rgba(255,255,255,0.82);
    margin-bottom: 4px; padding-left: 10px; position: relative;
  }
  .s-skill:before { content: "▸"; position: absolute; left: 0; color: rgba(255,255,255,0.35); }

  /* Main */
  .section-title {
    font-size: 12px; font-weight: 700; color: #534AB7;
    border-bottom: 1.5px solid #534AB7;
    padding-bottom: 4px; margin: 18px 0 11px;
  }
  .section-title:first-child { margin-top: 0; }
  .summary     { font-size: 11px; line-height: 1.65; color: #444; }
  .job         { margin-bottom: 13px; }
  .job-header  { display: flex; justify-content: space-between; align-items: flex-start; }
  .job-title   { font-weight: 700; font-size: 11px; }
  .job-company { font-size: 10.5px; color: #534AB7; margin-top: 1px; }
  .job-date    { font-size: 10px; color: #999; white-space: nowrap; }
  ul           { padding-left: 14px; margin-top: 5px; }
  li           { font-size: 10.5px; margin-bottom: 3px; line-height: 1.5; }
  .edu-row     { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .edu-degree  { font-weight: 600; font-size: 11px; }
  .edu-inst    { font-size: 10.5px; color: #666; }
</style>
</head>
<body>

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="avatar">${name.charAt(0).toUpperCase()}</div>
    <div class="s-name">${name}</div>
    <div class="s-contact">
      ${email    ? `${email}<br>`    : ''}
      ${phone    ? `${phone}<br>`    : ''}
      ${location ? `${location}` : ''}
    </div>
    ${skills.length ? `
      <div class="s-title">Skills</div>
      ${skills.map(s => `<div class="s-skill">${s}</div>`).join('')}
    ` : ''}
  </div>

  <!-- MAIN -->
  <div class="main">
    ${summary ? `<div class="section-title">Profile</div><div class="summary">${summary}</div>` : ''}

    ${experience.length ? `
      <div class="section-title">Experience</div>
      ${experienceHtml}
    ` : ''}

    ${education.length ? `
      <div class="section-title">Education</div>
      ${educationHtml}
    ` : ''}

    ${projectsHtml}
  </div>

</body>
</html>`;
}