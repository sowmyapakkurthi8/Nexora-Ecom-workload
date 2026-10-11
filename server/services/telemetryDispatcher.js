import os from 'os';
import axios from 'axios';

// In-memory rolling window for 5-second telemetry aggregation
let requestCount = 0;
let errorCounts = {
  clientErrors_4xx: 0,
  serverErrors_5xx: 0,
};
let responseTimes = [];

// Method to record HTTP request metrics
export const recordRequestMetric = (statusCode, durationMs) => {
  requestCount += 1;
  responseTimes.push(durationMs);

  if (statusCode >= 400 && statusCode < 500) {
    errorCounts.clientErrors_4xx += 1;
  } else if (statusCode >= 500) {
    errorCounts.serverErrors_5xx += 1;
  }
};

const getCpuUsage = () => {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idlePercent = totalIdle / totalTick;
  const usedPercent = ((1 - idlePercent) * 100).toFixed(2);
  return {
    cores: cpus.length,
    model: cpus[0]?.model || 'Generic CPU',
    usedPercent: Number(usedPercent),
  };
};

const getMemoryUsage = () => {
  const memUsage = process.memoryUsage();
  const totalSystemMem = os.totalmem();
  const freeSystemMem = os.freemem();

  return {
    heapUsedMB: Number((memUsage.heapUsed / 1024 / 1024).toFixed(2)),
    heapTotalMB: Number((memUsage.heapTotal / 1024 / 1024).toFixed(2)),
    rssMB: Number((memUsage.rss / 1024 / 1024).toFixed(2)),
    systemTotalMB: Number((totalSystemMem / 1024 / 1024).toFixed(2)),
    systemFreeMB: Number((freeSystemMem / 1024 / 1024).toFixed(2)),
  };
};

export const dispatchAlertToNexora = async (alertPayload) => {
  const alertUrl = process.env.NEXORA_ALERTS_URL || 'http://localhost:8080/api/alerts';
  const payload = {
    application: 'ecom-synthetic-workload',
    environment: process.env.NODE_ENV || 'local-dev',
    timestamp: new Date().toISOString(),
    ...alertPayload,
  };

  // Asynchronous fire-and-forget (Fail-safe mode: drop immediately if unreachable)
  axios.post(alertUrl, payload, { timeout: 1500 }).catch(() => {
    // Drop silently to prevent memory leaks as required by FR 5.2
  });
};

export const startTelemetryDispatcher = () => {
  const metricsUrl = process.env.NEXORA_METRICS_URL || 'http://localhost:8080/api/metrics';
  console.log('[TelemetryDispatcher] Background worker started. Polling every 5 seconds...');

  setInterval(async () => {
    // Snapshot current metrics
    const currentRequestCount = requestCount;
    const currentErrorCounts = { ...errorCounts };
    const latencies = [...responseTimes];

    // Reset aggregation windows for the next 5-second interval
    requestCount = 0;
    errorCounts = { clientErrors_4xx: 0, serverErrors_5xx: 0 };
    responseTimes = [];

    const avgLatency = latencies.length > 0
      ? Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2))
      : 0;
    const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
    const minLatency = latencies.length > 0 ? Math.min(...latencies) : 0;

    const payload = {
      application: 'ecom-synthetic-workload',
      environment: process.env.NODE_ENV || 'local-dev',
      timestamp: new Date().toISOString(),
      intervalSeconds: 5,
      throughput: {
        rps: Number((currentRequestCount / 5).toFixed(2)),
        totalRequests: currentRequestCount,
      },
      latencies: {
        avgMs: avgLatency,
        minMs: minLatency,
        maxMs: maxLatency,
      },
      errors: currentErrorCounts,
      cpu: getCpuUsage(),
      memory: getMemoryUsage(),
    };

    // Asynchronous fire-and-forget dispatch (FR 5.2)
    try {
      axios.post(metricsUrl, payload, { timeout: 2000 }).catch(() => {
        // Drop packet immediately to prevent leaks (fail-safe mode)
      });
    } catch {
      // Drop immediately
    }
  }, 5000);
};
