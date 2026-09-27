import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Your Cart is Empty</h2>
        <button onClick={() => navigate('/products')} style={{ padding: '0.5rem 1rem' }}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Shopping Cart</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cartItems.map((item) => (
          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <div>
              <h4>{item.name}</h4>
              <p>SKU: {item.sku}</p>
              <p>Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
              <strong>${(item.quantity * item.unitPrice).toFixed(2)}</strong>
              <button 
                onClick={() => removeFromCart(item.productId)}
                style={{ marginTop: '0.5rem', background: '#ff4444', color: 'white', border: 'none', padding: '0.3rem 0.5rem', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem', borderTop: '2px solid #333', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Total: ${getCartTotal().toFixed(2)}</h3>
        <div>
          <button onClick={clearCart} style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#ccc', border: 'none' }}>Clear Cart</button>
          <button onClick={() => navigate('/checkout')} style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
