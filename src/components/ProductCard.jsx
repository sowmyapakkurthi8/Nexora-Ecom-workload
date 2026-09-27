import React from 'react';

const ProductCard = ({ product, source, onAddToCart }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', margin: '1rem', width: '250px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>{product.sku}</span>
        {source === 'cache' && (
          <span style={{ background: '#4CAF50', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
            Cache
          </span>
        )}
        {source === 'database' && (
          <span style={{ background: '#2196F3', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
            DB
          </span>
        )}
      </div>
      <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
      <p style={{ color: '#888', fontSize: '0.9rem', minHeight: '40px' }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <strong>${product.price.toFixed(2)}</strong>
        <button 
          onClick={() => onAddToCart(product)}
          style={{ padding: '0.5rem 1rem', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
