import pool  from "../config/postgre.js";


async function saveAnalysis({
  userId,
  profileId,
  jobDescId,
  score,
  matchData,
  jdAnalysis,
  optimizedContent,
  modelUsed = 'gemini-1.5-flash'
}) {
  const result = await pool.query(
    `INSERT INTO analyses
      (user_id, profile_id, job_desc_id, score, match_data, jd_analysis, optimized_content, model_used)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (profile_id, job_desc_id)
     DO UPDATE SET
       score             = COALESCE(EXCLUDED.score,             analyses.score),
       match_data        = COALESCE(EXCLUDED.match_data,        analyses.match_data),
       jd_analysis       = COALESCE(EXCLUDED.jd_analysis,       analyses.jd_analysis),
       optimized_content = COALESCE(EXCLUDED.optimized_content, analyses.optimized_content),
       model_used        = EXCLUDED.model_used,
       updated_at        = NOW()
     RETURNING *`,
    [
      userId,
      profileId,
      jobDescId,
      score || null,
      matchData ? JSON.stringify(matchData) : null,
      jdAnalysis ? JSON.stringify(jdAnalysis) : null,
      optimizedContent ? JSON.stringify(optimizedContent) : null,
      modelUsed,
    ],
  );
  return result.rows[0];
}

async function savePdfUrl(analysisId, userId, pdfUrl, template) {
  const result = await pool.query(
    `UPDATE analyses
     SET pdf_url = $3, pdf_template = $4, pdf_created_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, pdf_url, pdf_template, pdf_created_at`,
    [analysisId, userId, pdfUrl, template],
  );
  return result.rows[0] || null;
}

async function getResumesByUser(userId) {
  const result = await pool.query(
    `SELECT
       a.id, a.score, a.pdf_url, a.pdf_template, a.pdf_created_at, a.updated_at,
       j.title        AS job_title,
       j.company_name AS company
     FROM analyses a
     JOIN job_descriptions j ON j.id = a.job_desc_id
     WHERE a.user_id = $1
       AND a.pdf_url IS NOT NULL
     ORDER BY a.pdf_created_at DESC`,
    [userId],
  );
  return result.rows;
}

async function getAnalysis(profileId, jobDescId) {
  const result = await pool.query(
    `SELECT * FROM analyses WHERE profile_id = $1 AND job_desc_id = $2`,
    [profileId, jobDescId],
  );
  return result.rows[0] || null;
}

async function getAnalysesByUser(userId) {
  const result = await pool.query(
    `SELECT
       a.id, a.score, a.updated_at, a.created_at,
       a.pdf_url, a.pdf_template,
       a.match_data, a.optimized_content,
       a.match_data        IS NOT NULL AS has_score,
       a.optimized_content IS NOT NULL AS has_optimized,
       j.title, j.company_name,
       j.id AS job_desc_id
     FROM analyses a
     JOIN job_descriptions j ON j.id = a.job_desc_id
     WHERE a.user_id = $1
     ORDER BY a.updated_at DESC`,
    [userId],
  );
  return result.rows;
}

async function getAnalysisById(id, userId) {
  const result = await pool.query(
    `SELECT a.*, j.title, j.company_name, j.description AS jd_text
     FROM analyses a
     JOIN job_descriptions j ON j.id = a.job_desc_id
     WHERE a.id = $1 AND a.user_id = $2`,
    [id, userId],
  );
  return result.rows[0] || null;
}

async function deleteAnalysis(id, userId) {
  const result = await pool.query(
    `DELETE FROM analyses WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId],
  );
  return result.rows[0] || null;
}

export default {
  saveAnalysis,
  savePdfUrl,
  getResumesByUser,
  getAnalysis,
  getAnalysesByUser,
  getAnalysisById,
  deleteAnalysis,
};