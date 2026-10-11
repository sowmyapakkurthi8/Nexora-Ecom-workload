import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getCartTotal,
    discountPercent,
    promoCode,
    applyPromo,
    removePromo,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shippingThreshold = 99;
  const isFreeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 9.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const finalTotal = subtotal - discount + shippingCost + tax;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyPromo(couponInput);
    setCouponMessage(res);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '3rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
          Explore our collection of flagship smartphones, creator laptops, and audio gear to generate realistic checkout workloads.
        </p>
        <Link to="/products" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          Explore Flagship Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#0f172a' }}>Shopping Cart</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Review your selected hardware before checkout</p>
        </div>
        <button
          onClick={clearCart}
          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Clear All Items
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Free Shipping Tracker */}
          <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span>
                {isFreeShipping ? (
                  <strong style={{ color: '#166534' }}>✓ You qualified for Free Express Shipping!</strong>
                ) : (
                  <span>Add <strong>${(shippingThreshold - subtotal).toFixed(2)}</strong> more for FREE shipping</span>
                )}
              </span>
              <span style={{ fontWeight: 600 }}>${subtotal.toFixed(0)} / ${shippingThreshold}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%`,
                  height: '100%',
                  background: isFreeShipping ? '#10b981' : '#2563eb',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Cart Item Cards */}
          {cartItems.map((item) => (
            <div
              key={item.productId}
              style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '1.25rem',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                alignItems: 'center',
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
                  {item.brand || 'Nexora Tech'}
                </span>
                <h3 style={{ fontSize: '1rem', color: '#0f172a', margin: '2px 0 4px 0' }}>{item.name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SKU: {item.sku}</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>
                  ${item.unitPrice.toFixed(2)}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  style={{ width: '32px', height: '36px', border: 'none', background: '#f8fafc', fontSize: '1rem', color: '#475569' }}
                >
                  -
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  style={{ width: '32px', height: '36px', border: 'none', background: '#f8fafc', fontSize: '1rem', color: '#475569' }}
                >
                  +
                </button>
              </div>

              {/* Total & Remove */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '90px' }}>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </strong>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.25rem' }}>Order Summary</h2>

          {/* Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Items Subtotal</span>
              <strong style={{ color: '#0f172a' }}>${subtotal.toFixed(2)}</strong>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                <span>Coupon ({promoCode} -{discountPercent}%)</span>
                <strong>-${discount.toFixed(2)}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Estimated Shipping</span>
              <span>{isFreeShipping ? <strong style={{ color: '#166534' }}>FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Estimated Tax (8%)</span>
              <strong style={{ color: '#0f172a' }}>${tax.toFixed(2)}</strong>
            </div>
          </div>

          {/* Promo code form */}
          <div style={{ padding: '1.25rem 0', borderBottom: '1px solid #e2e8f0' }}>
            {discount > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>✓ {promoCode} Applied</span>
                <button onClick={removePromo} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Promo code (NEXORA10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
                  Apply
                </button>
              </form>
            )}
            {couponMessage && !discount && (
              <p style={{ color: couponMessage.success ? '#166534' : '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                {couponMessage.message}
              </p>
            )}
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '1.25rem 0 1.5rem 0' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Final Total</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                ${finalTotal.toFixed(2)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>USD including tax</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 700 }}
          >
            Proceed to Secure Checkout →
          </button>

          {/* Trust badges */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.4rem', fontSize: '1.25rem' }}>
              <span>🔒</span>
              <span>💳</span>
              <span>⚡</span>
            </div>
            <span>256-Bit SSL Encrypted • Instant Telemetry Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
