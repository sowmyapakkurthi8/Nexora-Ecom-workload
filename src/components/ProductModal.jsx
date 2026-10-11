import React, { useState } from 'react';

const ProductModal = ({ product, source, onClose, onAddToCart }) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'reviews'

  const gallery = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
              {product.brand || 'Nexora Tech'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>SKU: {product.sku}</span>
            {source === 'cache' && (
              <span className="badge badge-success">⚡ Cached FS</span>
            )}
            {source === 'database' && (
              <span className="badge badge-primary">🗄️ Database</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', padding: '1.75rem' }}>
          {/* Left: Gallery */}
          <div>
            <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
              <img
                src={activeImage || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      border: activeImage === img ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      padding: '2px',
                      background: '#fff',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', lineHeight: 1.25 }}>{product.name}</h2>
            
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b', fontSize: '1.1rem' }}>
                {'★'.repeat(Math.floor(product.rating || 5))}
                {'☆'.repeat(5 - Math.floor(product.rating || 5))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating || 4.8}</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({product.reviewCount || 120} reviews)</span>
            </div>

            {/* Price Box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.1rem' }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Inventory Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.stock > 10 ? '#10b981' : '#f59e0b' }} />
              <strong style={{ color: product.stock > 10 ? '#166534' : '#92400e' }}>
                {product.stock > 10 ? `In Stock (${product.stock} available)` : `Only ${product.stock} left in stock - order soon`}
              </strong>
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '40px', height: '48px', border: 'none', background: '#f8fafc', fontSize: '1.2rem', color: '#475569' }}
                >
                  -
                </button>
                <span style={{ width: '44px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                  style={{ width: '40px', height: '48px', border: 'none', background: '#f8fafc', fontSize: '1.2rem', color: '#475569' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: 1, height: '48px', fontSize: '1.05rem', background: added ? '#10b981' : undefined }}
              >
                {added ? '✓ Added to Cart!' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: Specifications & Customer Reviews */}
        <div style={{ padding: '0 1.75rem 2rem 1.75rem' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                color: activeTab === 'specs' ? '#2563eb' : '#64748b',
                borderBottom: activeTab === 'specs' ? '3px solid #2563eb' : '3px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                color: activeTab === 'reviews' ? '#2563eb' : '#64748b',
                borderBottom: activeTab === 'reviews' ? '3px solid #2563eb' : '3px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {activeTab === 'specs' && (
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                        {key}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                        {typeof val === 'string' ? val : JSON.stringify(val)}
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Standard hardware specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, index) => (
                  <div key={index} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>{rev.author}</strong>
                        {rev.verified && (
                          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>✓ Verified Purchase</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{rev.date}</span>
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    {rev.title && <h4 style={{ fontSize: '0.95rem', margin: '0.25rem 0' }}>{rev.title}</h4>}
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b' }}>No customer reviews yet for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
