import express from 'express';
import { getDBStatus } from '../config/db.js';
import { getCacheStatus } from '../services/cacheService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const cacheStatus = getCacheStatus();

  const isHealthy = dbStatus.healthy && cacheStatus.healthy;
  const statusString = isHealthy ? 'healthy' : 'degraded';

  const memUsage = process.memoryUsage();

  const healthPayload = {
    status: statusString,
    uptimeSeconds: Math.floor(process.uptime()),
    dependencies: {
      mongodb: {
        healthy: dbStatus.healthy,
        state: dbStatus.state,
      },
      fileCache: {
        healthy: cacheStatus.healthy,
        present: cacheStatus.present,
      },
    },
    memory: {
      heapUsedMB: Number((memUsage.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotalMB: Number((memUsage.heapTotal / 1024 / 1024).toFixed(2)),
      rssMB: Number((memUsage.rss / 1024 / 1024).toFixed(2)),
    },
  };

  const statusCode = dbStatus.healthy ? 200 : 503;
  return res.status(statusCode).json(healthPayload);
});

export default router;
