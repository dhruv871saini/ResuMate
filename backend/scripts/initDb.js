import pool from '../config/postgre.js';

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(' Users table created successfully');


    await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID  REFERENCES users(id), 
        resume_data JSONB,
        raw_text TEXT,                      
        resume_file_url VARCHAR(255),       
        resume_public_id VARCHAR(255),      
        original_filename VARCHAR(255),     
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log(' Resumes table created successfully');


    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_descriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      extracted_data JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
    console.log(' job_description table created successfully ')


    await pool.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      job_description_id UUID REFERENCES job_descriptions(id) ON DELETE CASCADE,
      profile_id UUID REFERENCES profiles(id),
      prompt TEXT NOT NULL,
      response TEXT NOT NULL,
      model_used VARCHAR(50) DEFAULT 'gemini-1.5-flash',
      tokens_used INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
  `);
  console.log('✓ Conversations table added');



  await pool.query(`
   CREATE TABLE IF NOT EXISTS analyses (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
      profile_id        UUID REFERENCES profiles(id) ON DELETE CASCADE,
      job_desc_id       UUID REFERENCES job_descriptions(id) ON DELETE CASCADE,

      jd_analysis       JSONB,
      score             INTEGER,
      match_data        JSONB,
      optimized_content JSONB,

      model_used        VARCHAR(50) DEFAULT 'gemini-1.5-flash',

      pdf_url           TEXT,
      pdf_template      VARCHAR(255),
      pdf_created_at    TIMESTAMP,

      created_at        TIMESTAMP DEFAULT NOW(),
      updated_at        TIMESTAMP DEFAULT NOW(),

      UNIQUE(profile_id, job_desc_id)
    );

    CREATE INDEX IF NOT EXISTS idx_analyses_user_id  ON analyses(user_id);
    CREATE INDEX IF NOT EXISTS idx_analyses_profile_job  ON analyses(profile_id, job_desc_id);
  `);
  console.log('✓ analyses table created');




  } catch (error) {
    console.error('✗ Error creating table:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();