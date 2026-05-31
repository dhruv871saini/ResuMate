import pool from "../config/postgre.js";

async function createProfile(user_id, resume_data) {
  const result = await pool.query(
    `INSERT INTO profiles (user_id, resume_data)
     VALUES ($1, $2)
     RETURNING id, user_id, resume_data`,
    [user_id, resume_data]
  );

  return result.rows[0];
}

async function updateProfile(id, resume_data) {
  const result = await pool.query(
    `UPDATE profiles
     SET resume_data = $1
     WHERE id = $2
     RETURNING id, user_id, resume_data`,
    [resume_data, id]
  );

  return result.rows[0];
}

export {
  createProfile,
  updateProfile
};