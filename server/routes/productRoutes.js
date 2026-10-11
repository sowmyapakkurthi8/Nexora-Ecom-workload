import express from 'express';
import Product from '../models/Product.js';
import { authenticateJWT } from '../middleware/auth.js';
import { getProductsFromCache, saveProductsToCache } from '../services/cacheService.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to simulate randomized read latencies (10ms - 50ms) (FR 2.3)
const applyReadJitter = async () => {
  const jitterMs = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
  await new Promise((resolve) => setTimeout(resolve, jitterMs));
};

// GET /api/products (FR 2.1, FR 2.2, FR 2.3 + Category/Search/Sort support)
router.get('/', authenticateJWT, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const category = req.query.category || '';
  const search = req.query.search || '';
  const sortBy = req.query.sortBy || '';
  const skip = (page - 1) * limit;

  // Apply randomized read latency jitter (10ms - 50ms)
  await applyReadJitter();

  let allProducts = null;
  let source = 'cache';

  // Attempt to read from filesystem cache (FR 2.2)
  try {
    allProducts = getProductsFromCache();
  } catch (fsErr) {
    console.warn(`[Catalog] Filesystem cache read fault (${fsErr.code || fsErr.message}). Falling back to MongoDB database...`);
    allProducts = null;
    source = 'database';
  }

  // If cache is empty or faulted, query MongoDB
  if (!allProducts) {
    source = 'database';
    try {
      if (mongoose.connection.readyState !== 1) {
        const mongoErr = new Error('MongoNotConnectedError: Connection pool forcefully closed');
        mongoErr.name = 'MongoNotConnectedError';
        throw mongoErr;
      }

      // Build MongoDB query
      const query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Build sort options
      let sort = { createdAt: -1 };
      if (sortBy === 'price_asc') sort = { price: 1 };
      if (sortBy === 'price_desc') sort = { price: -1 };
      if (sortBy === 'rating') sort = { rating: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query).sort(sort).skip(skip).limit(limit).lean();
      const totalPages = Math.ceil(total / limit) || 1;

      // In the background, asynchronously refresh cache if not under fs fault
      try {
        const fullCatalog = await Product.find().lean();
        saveProductsToCache(fullCatalog);
      } catch {
        // Ignore cache save error during chaos
      }

      return res.status(200).json({
        products,
        source: 'database',
        page,
        limit,
        totalPages,
        total,
      });
    } catch (dbErr) {
      console.error(`[Catalog] Database query failed: ${dbErr.name || dbErr.message}`);
      return res.status(503).json({
        message: 'Database service unavailable. MongoNotConnectedError: Connection pool closed.',
        error: dbErr.message,
      });
    }
  }

  // Products served from local cache with in-memory filtering & sorting
  let filtered = [...allProducts];
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(s) ||
      p.brand?.toLowerCase().includes(s) ||
      p.description?.toLowerCase().includes(s)
    );
  }

  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedProducts = filtered.slice(skip, skip + limit);

  return res.status(200).json({
    products: paginatedProducts,
    source: 'cache',
    page,
    limit,
    totalPages,
    total,
  });
});

// GET /api/products/:id - Fetch single product details with full specs and reviews
router.get('/:id', authenticateJWT, async (req, res) => {
  await applyReadJitter();

  const { id } = req.params;
  let source = 'cache';

  try {
    const cache = getProductsFromCache();
    if (cache) {
      const found = cache.find((p) => String(p._id) === id || p.sku === id);
      if (found) {
        return res.status(200).json({ product: found, source: 'cache' });
      }
    }
  } catch {
    source = 'database';
  }

  try {
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ product, source: 'database' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve product', error: err.message });
  }
});

export default router;
