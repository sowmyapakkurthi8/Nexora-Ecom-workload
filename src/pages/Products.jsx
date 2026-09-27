import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  const fetchProducts = async (pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/products?page=${pageNumber}&limit=10`);
      setProducts(res.data.products);
      setSource(res.data.source);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products. Is the database down?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Products Catalog</h2>
      {error && (
        <div style={{ padding: '1rem', background: '#ffcccc', color: '#cc0000', marginBottom: '1rem', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading products (simulating latency)...</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                source={source} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>

          {!error && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                disabled={page >= totalPages} 
                onClick={() => setPage(p => p + 1)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
