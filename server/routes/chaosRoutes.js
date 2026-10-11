import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { activatePaymentTimeoutChaos, resetPaymentChaos, getPaymentChaosStatus } from '../services/paymentSimulator.js';
import { dropConnectionForChaos } from '../config/db.js';
import { triggerFsFault, getCacheStatus } from '../services/cacheService.js';
import { dispatchAlertToNexora } from '../services/telemetryDispatcher.js';

const router = express.Router();

// Trigger 1: Payment Gateway Timeout (hang for 30,000ms on next 50 checkouts)
router.post('/payment-timeout', authenticateJWT, (req, res) => {
  const result = activatePaymentTimeoutChaos(50);
  console.warn('[Chaos API] Trigger 1 (Payment Timeout) invoked.');
  return res.status(200).json({
    message: 'Chaos Trigger 1 active: Payment simulator will hang for 30,000ms on the next 50 checkout requests.',
    details: result,
  });
});

// Trigger 2: Database Connection Drop (closes MongoDB pool forcefully for 60s)
router.post('/db-drop', authenticateJWT, async (req, res) => {
  console.warn('[Chaos API] Trigger 2 (Database Drop) invoked.');
  
  // Dispatch structural alert to NEXORA
  dispatchAlertToNexora({
    level: 'CRITICAL',
    alertType: 'STRUCTURAL_TOPOLOGY_BREAK',
    edge: { from: 'catalog-service', to: 'mongodb-local' },
    message: 'Edge between catalog-service and mongodb-local is severed. Connection pool forcefully dropped.',
  });

  // Asynchronously execute drop so response is delivered before connection closes
  setTimeout(() => {
    dropConnectionForChaos(60000);
  }, 100);

  return res.status(200).json({
    message: 'Chaos Trigger 2 active: MongoDB connection pool closed for 60 seconds. Catalog queries will fail with MongoNotConnectedError. Auto-recovers in 60s.',
    durationMs: 60000,
  });
});

// Trigger 3: CPU Event Loop Starvation (blocks Node.js event loop for exactly 10s)
router.post('/cpu-spike', authenticateJWT, (req, res) => {
  console.warn('[Chaos API] Trigger 3 (CPU Event Loop Starvation) invoked. Starting 10-second synchronous loop...');

  // Dispatch alert to NEXORA
  dispatchAlertToNexora({
    level: 'CRITICAL',
    alertType: 'NODE_EVENT_LOOP_BLOCKED',
    service: 'api-gateway',
    message: 'Node.js event loop starvation initiated. Synchronous compute running for 10,000ms.',
  });

  const durationMs = 10000;
  const startTime = Date.now();

  // Synchronous, computationally heavy while loop (FR Trigger 3)
  let count = 0;
  while (Date.now() - startTime < durationMs) {
    // Heavy CPU computation
    Math.sqrt(Math.random() * 1000000);
    count++;
  }

  const elapsed = Date.now() - startTime;
  console.warn(`[Chaos API] Trigger 3 finished. Blocked event loop for ${elapsed}ms (${count} iterations).`);

  return res.status(200).json({
    message: `Chaos Trigger 3 executed: Node.js event loop blocked synchronously for ${elapsed}ms.`,
    durationMs: elapsed,
    iterations: count,
  });
});

// Trigger 4: File System I/O Fault (renames/corrupts cache for 30s)
router.post('/fs-fault', authenticateJWT, async (req, res) => {
  console.warn('[Chaos API] Trigger 4 (File System Fault) invoked.');

  // Dispatch alert to NEXORA
  dispatchAlertToNexora({
    level: 'WARNING',
    alertType: 'STORAGE_LAYER_EXCEPTION',
    service: 'fs-cache',
    message: 'File cache missing or permission fault injected. Disk reads will throw ENOENT.',
  });

  await triggerFsFault(30000);

  return res.status(200).json({
    message: 'Chaos Trigger 4 active: Product metadata cache disabled for 30 seconds. ENOENT exceptions will force fallback to database.',
    durationMs: 30000,
  });
});

// Reset active chaos state
router.post('/reset', authenticateJWT, (req, res) => {
  const result = resetPaymentChaos();
  res.status(200).json({
    message: 'All active chaos triggers reset to normal.',
    paymentChaos: result,
  });
});

export default router;
