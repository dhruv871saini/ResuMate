import express from 'express';
import dotenv from 'dotenv';
import pool from './config/postgre.js';
import routes from './route/index.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

app.use('/',routes);

app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});