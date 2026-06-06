import pool from '../config/postgre.js';

async function saveConversation(user_id, profile_id, job_desc_id, prompt, response, model_used, tokens_used) {
  const result = await pool.query(`
    INSERT INTO conversations 
      (user_id, profile_id, job_description_id, prompt, response, model_used, tokens_used)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, user_id, profile_id, job_description_id, prompt, response, model_used, tokens_used, created_at`,
    [user_id, profile_id || null, job_desc_id || null, prompt, response, model_used, tokens_used || null]
  );
  return result.rows[0];
}

async function getConversationByUser(user_id, limit = 50, offset = 0) {
  const result = await pool.query(
    `SELECT 
       c.id, c.prompt, c.response, c.model_used, c.tokens_used, c.created_at,
       j.title        AS job_title,
       j.company_name AS company_name
     FROM conversations c
     LEFT JOIN job_descriptions j ON j.id = c.job_description_id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC
     LIMIT $2 OFFSET $3`,
    [user_id, limit, offset]
  );
  return result.rows;
}

async function getConversationsByJob(user_id, job_description_id) {
  const result = await pool.query(
    `SELECT id, prompt, response, model_used, tokens_used, created_at
     FROM conversations
     WHERE user_id = $1 AND job_description_id = $2
     ORDER BY created_at ASC`,
    [user_id, job_description_id]
  );
  return result.rows;
}

async function getTokenUsageSummary(user_id) {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int                                                    AS total_calls,
       COALESCE(SUM(tokens_used), 0)::int                              AS total_tokens,
       COALESCE(SUM(tokens_used) FILTER (
         WHERE created_at > NOW() - INTERVAL '1 day'), 0)::int         AS tokens_today,
       COALESCE(SUM(tokens_used) FILTER (
         WHERE created_at > NOW() - INTERVAL '7 days'), 0)::int        AS tokens_this_week
     FROM conversations
     WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
}

export default {
  saveConversation,
  getConversationByUser,
  getConversationsByJob,
  getTokenUsageSummary
};