import pool from "../config/postgre.js";

async function createJob_desc(user_id, title, company_name, description) {
    const result =await pool.query(
        `INSERT INTO job_descriptions (user_id, title, company_name, description)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, title, company_name, description`,
         [user_id, title, company_name, description]
        )
        return result.rows[0];
}

async function updateJob_desc(id, title, company_name, description) {
    const result = await pool.query(
        `UPDATE job_descriptions
         SET title=$1, company_name=$2, description=$3
         WHERE id=$4,
         RETURNING id, user_id, title, company_name, description`,
         [title, company_name, description, id ]
    )
    return result.rows[0];
}

async function  deleteJob_desc(id) {
    const result = await pool.query(
        `DELETE FROM job_descriptions
        WHERE id=$1
        RETURNING id, title ,company_name `,
        [id]
    )
    return result.rows[0];
}

async function getJobDescById(id, userId) {
  const result = await pool.query(
    `SELECT * FROM job_descriptions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0];
}

export default {
    createJob_desc,
    updateJob_desc,
    deleteJob_desc,
    getJobDescById
}