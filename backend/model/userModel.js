import res from "express/lib/response.js";
import pool from "../config/postgre.js";

async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
}

async function createUser(name, email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)  
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash],
  );

  return result.rows[0];
}

async function updateUser(id, name, email, passwordHash) {
  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2, password_hash = $3
     WHERE id = $4
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash, id],
  );

  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id, name, email`,
    [id],
  );

  return result.rows[0];
}

async function saveResetCode(id, hashedCode, expiresAt) {
  const result = await pool.query(
    `
  UPDATE users
  SET reset_password_token=$2, reset_password_expires = $3
  WHERE id =$1
  RETURNING *;
`,
    [id, hashedCode, expiresAt],
  );
  return result.rows[0];
}

async function verifyCode(email) {
  const result = await pool.query(
    `SELECT 
      reset_password_token,
      reset_password_expires
     FROM users
     WHERE email = $1,`[email],
  );
  return result.rows[0];
}
async function updatePassword( email, passwordHash) {
  const result = await pool.query(
    `
    UPDATE users
    SET password_hash = $1,
        reset_password_token = NULL,
        reset_password_expires = NULL
    WHERE email = $2
    RETURNING *;
    `,
    [passwordHash, email],
  );

  return result.rows[0];
}

export default {
  findByEmail,
  createUser,
  updateUser,
  deleteUser,
  saveResetCode,
  verifyCode,
  updatePassword,
};
