import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import { apiRouter } from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Init SQLite database
initDatabase();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SiteCraft-AI Backend Engine',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 [SiteCraft-AI Server] Backend running at http://localhost:${PORT}`);
  console.log(`📊 [Database] SQLite live at server/data/sitecraft.db`);
  console.log(`⚡ [API Endpoints] /api/leads | /api/scrape/maps | /api/audit/vision | /api/deploy/vercel | /api/stripe\n`);
});
