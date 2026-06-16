// GenomeX Backend Server

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const { register, metricsMiddleware } = require('./config/metrics');

const authRoutes = require('./routes/auth');
const genomeRoutes = require('./routes/genomes');
const simulationRoutes = require('./routes/simulations');
const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(metricsMiddleware);

// Health check (K8s liveness/readiness probes)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'genomex-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready' });
});

// Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/genomes', genomeRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/audit-logs', auditRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    service: 'GenomeX Bioinformatics Platform',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/genomes',
      'POST /api/genomes',
      'GET  /api/simulations',
      'POST /api/simulations',
      'GET  /api/audit-logs (admin)',
      'GET  /health',
      'GET  /metrics'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`🧬 GenomeX Backend Started`);
  logger.info(`📍 Port: ${PORT}`);
  logger.info(`🌐 URL: http://localhost:${PORT}`);
  logger.info(`📊 Metrics: http://localhost:${PORT}/metrics`);
  logger.info(`💚 Health: http://localhost:${PORT}/health`);
});
