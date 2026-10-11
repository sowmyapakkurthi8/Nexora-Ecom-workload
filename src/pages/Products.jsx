import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { CartContext } from '../context/CartContext';

const CATEGORIES = [
  { id: 'All', label: 'All Products', icon: '✨' },
  { id: 'Smartphones', label: 'Smartphones', icon: '📱' },
  { id: 'Laptops', label: 'Laptops', icon: '💻' },
  { id: 'Audio', label: 'Audio & ANC', icon: '🎧' },
  { id: 'Smartwatches', label: 'Smartwatches', icon: '⌚' },
  { id: 'Gaming', label: 'Gaming & Deck', icon: '🎮' },
  { id: 'Cameras', label: 'Cameras & Drones', icon: '📷' },
];

const Products = ({ externalSearch }) => {
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState('cache');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart } = useContext(CartContext);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const categoryParam = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      const searchParam = externalSearch ? `&search=${encodeURIComponent(externalSearch)}` : '';
      const sortParam = sortBy !== 'featured' ? `&sortBy=${sortBy}` : '';

      const res = await api.get(`/api/products?page=${page}&limit=12${categoryParam}${searchParam}${sortParam}`);
      setProducts(res.data.products || []);
      setSource(res.data.source || 'cache');
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products. Is the database connection pool down?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, sortBy, externalSearch]);

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem 1.5rem' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37, 99, 235, 0.3)', border: '1px solid rgba(59, 130, 246, 0.5)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', color: '#93c5fd' }}>
            <span>⚡ NEXORA WORKLOAD GENERATOR</span>
            <span>•</span>
            <span>M4 PRO & SNAPDRAGON 8 ELITE</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Flagship Hardware. <br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Synthetic AIOps Benchmark.
            </span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Explore pro-grade smartphones, gaming rigs, and audio engineering. Every catalog query exercises local file caching with randomized database jitter for NEXORA metrics training.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('Smartphones')}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Shop Smartphones
            </button>
            <button
              onClick={() => setSelectedCategory('Laptops')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Explore Laptops
            </button>
          </div>
        </div>
      </div>

      {/* Value Proposition Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🚀</span>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>Free Express Delivery</strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>On all orders over $99</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🛡️</span>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>2-Year Official Warranty</strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Authentic manufacturer cover</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔄</span>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>30-Day Easy Returns</strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No-questions refund policy</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>AIOps Monitored</strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Dispatched to NEXORA RCA</span>
          </div>
        </div>
      </div>

      {/* Telemetry Status Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.25rem',
          background: source === 'cache' ? '#f0fdf4' : '#eff6ff',
          border: source === 'cache' ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong>Active Catalog Storage:</strong>
          {source === 'cache' ? (
            <span style={{ color: '#166534', fontWeight: 600 }}>
              ⚡ Node.js Filesystem Cache (products_cache.json) — Randomized Read Jitter (10-50ms)
            </span>
          ) : (
            <span style={{ color: '#1e40af', fontWeight: 600 }}>
              🗄️ Local MongoDB Connection Pool — Cache Bypass / Auto-Failover Active
            </span>
          )}
        </div>
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
          Showing {products.length} of {totalCount} flagship products
        </span>
      </div>

      {/* Categories & Filter Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {/* Category Selector Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '9999px',
                border: selectedCategory === cat.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: selectedCategory === cat.id ? '#eff6ff' : '#ffffff',
                color: selectedCategory === cat.id ? '#1e40af' : '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="featured">Featured Picks</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: '1.25rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '10px',
            marginBottom: '2rem',
          }}
        >
          <strong>Database Connection Interrupted:</strong> {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              margin: '0 auto 1rem auto',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b' }}>Simulating database latency jitter (10-50ms)...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔍</span>
          <h3>No products match your criteria</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try clearing your filters or selecting a different category.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSortBy('featured');
            }}
            className="btn-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              source={source}
              onAddToCart={addToCart}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary"
            style={{ opacity: page <= 1 ? 0.5 : 1 }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary"
            style={{ opacity: page >= totalPages ? 0.5 : 1 }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          source={source}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Products;
