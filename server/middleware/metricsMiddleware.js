import { recordRequestMetric } from '../services/telemetryDispatcher.js';

export const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    recordRequestMetric(res.statusCode, durationMs);
  });

  next();
};
