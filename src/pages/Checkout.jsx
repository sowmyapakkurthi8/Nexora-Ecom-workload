import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/api/checkout', { items: cartItems });
      setSuccess({
        message: response.data.message,
        orderId: response.data.orderId,
        paymentRef: response.data.paymentRef,
        processingTimeMs: response.data.processingTimeMs
      });
      clearCart();
    } catch (err) {
      const errData = err.response?.data;
      if (err.response?.status === 504) {
        setError(`GATEWAY TIMEOUT (504): The payment gateway timed out. OrderID: ${errData?.orderId}`);
      } else if (err.response?.status === 402) {
        setError(`PAYMENT FAILED (402): ${errData?.message}`);
      } else {
        setError(`ERROR (${err.response?.status}): ${errData?.message || 'Checkout failed.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success && !error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Checkout</h2>
        <p>No items to checkout.</p>
        <button onClick={() => navigate('/products')} style={{ padding: '0.5rem 1rem' }}>Return to Shop</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px', marginTop: '2rem' }}>
      <h2>Checkout Simulator</h2>
      
      {!success && !loading && !error && (
        <>
          <p>You are about to process a payment for <strong>${getCartTotal().toFixed(2)}</strong>.</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            * Note: Payments have a natural simulated delay (200-1500ms) and a 5% chance of failing with INSUFFICIENT_FUNDS.
          </p>
          <button 
            onClick={handleCheckout} 
            style={{ width: '100%', padding: '1rem', background: '#007BFF', color: 'white', border: 'none', fontSize: '1.2rem', marginTop: '1rem', cursor: 'pointer' }}
          >
            Pay Now
          </button>
        </>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>Processing Payment...</h3>
          <p>Please wait. Time elapsed: <strong>{loadingTime}s</strong></p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>If a chaos trigger is active, this may take up to 30s.</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #cc0000', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
          <h3 style={{ color: '#cc0000', marginTop: 0 }}>Payment Failed</h3>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setError(null)} style={{ padding: '0.5rem 1rem' }}>Try Again</button>
            <button onClick={() => navigate('/products')} style={{ padding: '0.5rem 1rem' }}>Return to Shop</button>
          </div>
        </div>
      )}

      {success && (
        <div style={{ background: '#f0fff0', border: '1px solid #00cc00', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
          <h3 style={{ color: '#00cc00', marginTop: 0 }}>Payment Successful!</h3>
          <p>{success.message}</p>
          <ul>
            <li><strong>Order ID:</strong> {success.orderId}</li>
            <li><strong>Payment Ref:</strong> {success.paymentRef}</li>
            <li><strong>Processing Time:</strong> {success.processingTimeMs}ms</li>
          </ul>
          <button onClick={() => navigate('/products')} style={{ padding: '0.5rem 1rem', marginTop: '1rem', background: '#333', color: 'white', border: 'none' }}>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
