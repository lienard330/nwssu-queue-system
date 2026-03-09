/**
 * NWSSU Queue Management System - Backend API
 */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

import queueRoutes from './routes/queue.js';
import servicesRoutes from './routes/services.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/queue', queueRoutes);
app.use('/api/services', servicesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Root: clarify that the UI runs on the frontend dev server
app.get('/', (req, res) => {
  res.type('text/plain').status(200).send(
    'NWSSU Queue API is running. Use the frontend at http://localhost:5173 (run "npm run dev" from project root).'
  );
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`NWSSU Queue API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop other processes on this port or set a different PORT env variable.`
    );
  } else {
    console.error('Server error:', err);
  }
});
