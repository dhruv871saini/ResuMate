import pool from '../config/postgre.js';

async function createJob_desc(user_id, title, company_name, description) {
  const result = await pool.query(
    `INSERT INTO job_descriptions (user_id, title, company_name, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, title, company_name, description`,
    [user_id, title, company_name, description]
  );
  return result.rows[0];
}

async function updateJob_desc(id, userId, title, company_name, description) {
  const result = await pool.query(
    `UPDATE job_descriptions
     SET title = $1, company_name = $2, description = $3, updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING id, user_id, title, company_name, description`,
    [title, company_name, description, id, userId]   // fixed: removed stray comma in SQL, added userId
  );
  return result.rows[0] || null;
}

async function deleteJob_desc(id, userId) {
  const result = await pool.query(
    `DELETE FROM job_descriptions
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, company_name`,
    [id, userId]   
  );
  return result.rows[0] || null;
}

async function getJobDescById(id, userId) {
  const result = await pool.query(
    `SELECT * FROM job_descriptions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0] || null;
}

export default {
  createJob_desc,
  updateJob_desc,
  deleteJob_desc,
  getJobDescById
};
