import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const CACHE_FILE = path.join(DATA_DIR, 'products_cache.json');
const FAULT_BACKUP_FILE = path.join(DATA_DIR, 'products_cache.json.fault');

let isFaultActive = false;

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const getProductsFromCache = () => {
  if (isFaultActive) {
    const error = new Error('ENOENT: no such file or directory, open products_cache.json');
    error.code = 'ENOENT';
    throw error;
  }

  if (!fs.existsSync(CACHE_FILE)) {
    return null;
  }

  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[CacheService] Error reading cache file:', err.message);
    throw err;
  }
};

export const saveProductsToCache = (products) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[CacheService] Error writing cache file:', err.message);
    return false;
  }
};

export const triggerFsFault = async (durationMs = 30000) => {
  console.warn(`[Chaos Trigger 4] Simulating file system fault for ${durationMs / 1000}s...`);
  isFaultActive = true;

  try {
    if (fs.existsSync(CACHE_FILE)) {
      if (fs.existsSync(FAULT_BACKUP_FILE)) {
        fs.unlinkSync(FAULT_BACKUP_FILE);
      }
      fs.renameSync(CACHE_FILE, FAULT_BACKUP_FILE);
    }
  } catch (err) {
    console.error('[Chaos Trigger 4] Error simulating fs fault:', err.message);
  }

  // Auto-restore after durationMs
  setTimeout(() => {
    console.log('[Chaos Trigger 4 Recovery] Restoring filesystem cache...');
    try {
      if (fs.existsSync(FAULT_BACKUP_FILE)) {
        fs.renameSync(FAULT_BACKUP_FILE, CACHE_FILE);
      }
    } catch (err) {
      console.error('[Chaos Trigger 4 Recovery] Error restoring cache file:', err.message);
    } finally {
      isFaultActive = false;
    }
  }, durationMs);

  return { durationMs, message: `Filesystem fault active for ${durationMs / 1000}s` };
};

export const getCacheStatus = () => {
  const exists = fs.existsSync(CACHE_FILE);
  return {
    healthy: exists && !isFaultActive,
    present: exists && !isFaultActive,
    isFaultActive,
  };
};
