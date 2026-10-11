import React, { useState } from 'react';

const ProductCard = ({ product, source, onAddToCart, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered
          ? '0 12px 24px -6px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
      }}
    >
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {product.badge && (
            <span className="badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.7rem' }}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Source Telemetry indicator for NEXORA evaluation */}
        <div>
          {source === 'cache' && (
            <span className="badge badge-success" style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534' }}>
              ⚡ Cache
            </span>
          )}
          {source === 'database' && (
            <span className="badge badge-primary" style={{ fontSize: '0.65rem', background: '#dbeafe', color: '#1e40af' }}>
              🗄️ DB
            </span>
          )}
        </div>
      </div>

      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '220px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '1.5rem',
        }}
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
      </div>

      {/* Product Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand || 'Nexora Tech'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {product.category}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '0.5rem',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7rem',
          }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <div style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
            {'★'.repeat(Math.floor(product.rating || 5))}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
            {product.rating || 4.8}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            ({product.reviewCount || 98})
          </span>
        </div>

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice > product.price && (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick View Specs & Reviews"
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontSize: '0.9rem',
              }}
            >
              👁️
            </button>
            <button
              onClick={handleAdd}
              style={{
                background: added ? '#10b981' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 0.85rem',
                height: '36px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {added ? '✓ Added' : '+ Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
