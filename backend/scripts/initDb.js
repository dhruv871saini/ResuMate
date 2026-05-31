import pool from '../config/postgre.js';

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(' Users table created successfully');



    await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        user_id UUID UNIQUE REFERENCES users(id), 
        resume_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log(' Resumes table created successfully');
  } catch (error) {
    console.error('✗ Error creating table:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
