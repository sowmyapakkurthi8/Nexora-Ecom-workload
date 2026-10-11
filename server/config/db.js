import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora_ecom';

let isIntentionallyDisconnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // Do not exit process, so app stays responsive for health checks
    return null;
  }
};

export const dropConnectionForChaos = async (durationMs = 60000) => {
  isIntentionallyDisconnected = true;
  console.warn(`[Chaos Trigger 2] Forcefully dropping MongoDB connection for ${durationMs / 1000}s...`);
  try {
    await mongoose.connection.close(false);
    console.warn('[Chaos Trigger 2] MongoDB connection pool forcefully closed.');
  } catch (err) {
    console.error('[Chaos Trigger 2] Error closing MongoDB connection:', err.message);
  }

  // Schedule auto-recovery
  setTimeout(async () => {
    console.log('[Chaos Trigger 2 Recovery] Reconnecting to MongoDB...');
    isIntentionallyDisconnected = false;
    await connectDB();
  }, durationMs);
};

export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  const stateString = states[readyState] || 'unknown';
  const isHealthy = readyState === 1 && !isIntentionallyDisconnected;
  return {
    healthy: isHealthy,
    state: stateString,
    readyState,
  };
};
