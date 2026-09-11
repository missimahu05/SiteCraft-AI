import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB, getDBStatus } from './config/db.js';
import { apiRouter } from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB().catch(err => {
  console.warn('Note connexion MongoDB:', err.message);
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SiteCraft-AI Engine (Cloudflare + FeexPay + MongoDB)',
    db: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Serve client in production (e.g. Render / Docker)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 [Production] Client statique détecté dans ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [SiteCraft-AI Server] Backend prêt sur http://localhost:${PORT}`);
  console.log(`🍃 [Base de Données] Mode: ${getDBStatus().mode} (${getDBStatus().host})`);
  console.log(`☁️  [Déploiement] Moteur Cloudflare Pages Anycast Edge`);
  console.log(`💳 [Paiements] FeexPay (MTN, Moov, Orange, Wave, Cartes)`);
  console.log(`======================================================\n`);
});
