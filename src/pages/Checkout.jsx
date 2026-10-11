import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Checkout = () => {
  const {
    cartItems,
    getSubtotal,
    getDiscountAmount,
    getCartTotal,
    discountPercent,
    promoCode,
    clearCart,
  } = useContext(CartContext);
  const navigate = useNavigate();

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Alex Vance',
    email: 'testuser@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phone: '+1 (555) 234-5678',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: 'ALEX VANCE',
    expiry: '12/28',
    cvv: '888',
  });

  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Timer while loading
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

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shippingRate = deliveryMethod === 'overnight' ? 19.99 : deliveryMethod === 'express' ? 9.99 : (subtotal >= 99 ? 0 : 9.99);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const finalTotal = subtotal - discount + shippingRate + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/api/checkout', { items: cartItems });
      setSuccess({
        message: response.data.message || 'Payment authorized and order confirmed!',
        orderId: response.data.orderId,
        paymentRef: response.data.paymentRef,
        processingTimeMs: response.data.processingTimeMs,
        finalTotal,
        shippingTo: `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}`,
        items: [...cartItems],
      });
      clearCart();
    } catch (err) {
      const errData = err.response?.data;
      if (err.response?.status === 504) {
        setError(`GATEWAY TIMEOUT (504): The internal payment simulator timed out after 30,000ms. Order ID: ${errData?.orderId || 'N/A'}. A CRITICAL_LATENCY alert was dispatched to NEXORA.`);
      } else if (err.response?.status === 402) {
        setError(`PAYMENT DECLINED (402): ${errData?.message || 'INSUFFICIENT_FUNDS'}. Natural 5% organic error simulation triggered.`);
      } else {
        setError(`CHECKOUT ERROR (${err.response?.status || '500'}): ${errData?.message || 'Payment engine encountered an unexpected error.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success && !error) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>Checkout</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>No items in cart to checkout.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Return to Flagship Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>Secure Checkout</h1>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Complete your order and simulate network telemetry dispatch
      </p>

      {/* Success Receipt State */}
      {success && (
        <div style={{ maxWidth: '720px', margin: '2rem auto', background: '#ffffff', border: '2px solid #10b981', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#166534', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.25rem' }}>Order Confirmed & Paid!</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Your synthetic workload telemetry was successfully captured</p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Order Reference</span>
              <strong style={{ color: '#0f172a' }}>{success.orderId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Payment Authorization</span>
              <strong style={{ color: '#2563eb' }}>{success.paymentRef}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Simulation Latency</span>
              <strong style={{ color: '#166534' }}>{success.processingTimeMs}ms</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Total Charged</span>
              <strong style={{ color: '#0f172a' }}>${success.finalTotal.toFixed(2)}</strong>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => navigate('/products')} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Continue Shopping
            </button>
            <button onClick={() => navigate('/health')} className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              View System Health →
            </button>
          </div>
        </div>
      )}

      {/* Main Checkout View */}
      {!success && (
        <form onSubmit={handleCheckout} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Column: Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Shipping Address */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>1.</span> Shipping Address
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>City</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>2.</span> Delivery Speed
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', border: deliveryMethod === 'standard' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', background: deliveryMethod === 'standard' ? '#eff6ff' : '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="radio" name="delivery" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>Standard Delivery (3-5 business days)</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Free on orders over $99</span>
                    </div>
                  </div>
                  <strong>{subtotal >= 99 ? 'FREE' : '$9.99'}</strong>
                </label>

                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', border: deliveryMethod === 'express' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', background: deliveryMethod === 'express' ? '#eff6ff' : '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="radio" name="delivery" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>Express 2-Day Air</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Fast track courier tracking</span>
                    </div>
                  </div>
                  <strong>$9.99</strong>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>3.</span> Payment Simulator
              </h2>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: paymentMethod === 'card' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: paymentMethod === 'card' ? '#eff6ff' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  💳 Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: paymentMethod === 'wallet' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: paymentMethod === 'wallet' ? '#eff6ff' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  ⚡ Apple / UPI
                </button>
              </div>

              {/* Mock Card Preview */}
              <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '12px', padding: '1.25rem', color: '#fff', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                  <span>NEXORA SIMULATED CARD</span>
                  <span>VISA</span>
                </div>
                <div style={{ fontSize: '1.2rem', letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: '1rem' }}>
                  {cardInfo.cardNumber}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>{cardInfo.cardHolder}</span>
                  <span>EXP: {cardInfo.expiry}</span>
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
                * Internal PaymentSimulator: Artificially delayed (200-1500ms) with a natural 5% failure probability for NEXORA AIOps error baseline training.
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.25rem' }}>Items in Order ({cartItems.length})</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.5rem' }}>
              {cartItems.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#1e293b' }}>{item.name}</strong>
                      <span style={{ color: '#94a3b8' }}>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <strong>${(item.quantity * item.unitPrice).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                  <span>Promo ({promoCode})</span>
                  <strong>-${discount.toFixed(2)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Shipping</span>
                <span>{shippingRate === 0 ? 'FREE' : `$${shippingRate.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Taxes</span>
                <strong>${tax.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid #0f172a' }}>
                <strong style={{ fontSize: '1.1rem' }}>Total Due</strong>
                <strong style={{ fontSize: '1.6rem', color: '#0f172a' }}>${finalTotal.toFixed(2)}</strong>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ margin: '1.25rem 0', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#991b1b', fontSize: '0.85rem' }}>
                <strong>Payment Refusal:</strong> {error}
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700, marginTop: '1.25rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? `Authorizing... (${loadingTime}s)` : `Pay Now • $${finalTotal.toFixed(2)}`}
            </button>

            {loading && (
              <div style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
                Simulating network delay. If Chaos Trigger 1 is armed, holds for 30s.
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
