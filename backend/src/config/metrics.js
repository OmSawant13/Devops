// Prometheus metrics — exposed at /metrics

const promClient = require('prom-client');

const register = new promClient.Registry();

// Default metrics (CPU, memory, GC, etc)
promClient.collectDefaultMetrics({ register, prefix: 'genomex_' });

// Custom metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'genomex_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new promClient.Histogram({
  name: 'genomex_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register]
});

const simulationCounter = new promClient.Counter({
  name: 'genomex_simulations_started_total',
  help: 'Total drug discovery simulations started',
  labelNames: ['status'],
  registers: [register]
});

const activeUsersGauge = new promClient.Gauge({
  name: 'genomex_active_users',
  help: 'Currently active users',
  registers: [register]
});

// Middleware to track request metrics
function metricsMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
    httpRequestDuration.observe(
      { method: req.method, route, status: res.statusCode },
      duration
    );
  });
  next();
}

module.exports = {
  register,
  metricsMiddleware,
  simulationCounter,
  activeUsersGauge
};
