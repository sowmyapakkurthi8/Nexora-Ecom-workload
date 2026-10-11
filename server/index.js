import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { metricsMiddleware } from './middleware/metricsMiddleware.js';
import { registerTopologyOnBoot } from './services/topologyService.js';
import { startTelemetryDispatcher } from './services/telemetryDispatcher.js';
import Product from './models/Product.js';
import { seedDatabase } from './seed.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import chaosRoutes from './routes/chaosRoutes.js';
import mockNexoraRoutes from './routes/mockNexoraRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Track all incoming request performance metrics for TelemetryDispatcher
app.use(metricsMiddleware);

// API Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/chaos', chaosRoutes);
app.use('/api/mock-nexora', mockNexoraRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Server bootstrap
const startServer = async () => {
  console.log('========================================================');
  console.log('  NEXORA Synthetic E-Commerce Workload Starting Up...   ');
  console.log('========================================================');

  // Connect to MongoDB
  await connectDB();

  // Auto-seed mock data if empty
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Bootstrap] No products found. Auto-seeding initial catalog...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn('[Bootstrap] Auto-seed check skipped or failed:', err.message);
  }

  // Start HTTP Listener
  app.listen(PORT, async () => {
    console.log(`[Express] Nexora E-Commerce Workload API is running on http://localhost:${PORT}`);
    console.log(`[Express] Health check: http://localhost:${PORT}/health`);

    // SF-4: Topology Registration on Boot
    await registerTopologyOnBoot();

    // SF-5: Telemetry Dispatcher background worker (every 5 seconds)
    startTelemetryDispatcher();
  });
};

startServer().catch((err) => {
  console.error('[Bootstrap] Fatal startup error:', err);
});
