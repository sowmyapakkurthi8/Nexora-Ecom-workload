import express from 'express';

const router = express.Router();

let latestTopology = null;
let receivedMetrics = [];
let receivedAlerts = [];

router.post('/topology', (req, res) => {
  latestTopology = {
    receivedAt: new Date().toISOString(),
    ...req.body,
  };
  console.log('[MockNEXORA] Topology graph received and mapped successfully.');
  res.status(200).json({ status: 'ACKNOWLEDGED', topologyId: 'top-' + Date.now() });
});

router.post('/metrics', (req, res) => {
  receivedMetrics.unshift({
    receivedAt: new Date().toISOString(),
    ...req.body,
  });
  if (receivedMetrics.length > 50) receivedMetrics.pop();
  res.status(200).json({ status: 'INGESTED' });
});

router.post('/alerts', (req, res) => {
  receivedAlerts.unshift({
    receivedAt: new Date().toISOString(),
    ...req.body,
  });
  if (receivedAlerts.length > 50) receivedAlerts.pop();
  console.warn(`[MockNEXORA] Ingested alert: [${req.body.alertType}] - ${req.body.message}`);
  res.status(200).json({ status: 'ALERT_LOGGED' });
});

router.get('/data', (req, res) => {
  res.status(200).json({
    latestTopology,
    metricsCount: receivedMetrics.length,
    alertsCount: receivedAlerts.length,
    recentAlerts: receivedAlerts.slice(0, 5),
    recentMetrics: receivedMetrics.slice(0, 5),
  });
});

export default router;
