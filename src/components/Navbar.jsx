import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#333', color: '#fff' }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Nexora E-Com</Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/health" style={{ color: 'white' }}>Health</Link>
        <Link to="/admin/chaos" style={{ color: '#ff4444' }}>Chaos Admin</Link>
        {user ? (
          <>
            <Link to="/products" style={{ color: 'white' }}>Products</Link>
            <Link to="/cart" style={{ color: 'white' }}>Cart ({totalItems})</Link>
            <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: '1px solid white', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
