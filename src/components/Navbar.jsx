import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = ({ onSearchChange, searchTerm }) => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCount = getCartCount();
  const totalAmount = getCartTotal();

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* Top Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e293b, #0f172a)',
          color: '#e2e8f0',
          fontSize: '0.75rem',
          padding: '0.4rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#2563eb', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.7rem' }}>
            NEXORA 2026
          </span>
          <span>⚡ Live AIOps Workload: Real-Time Telemetry & Chaos Simulation Enabled</span>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem' }}>
          <Link to="/health" style={{ color: '#38bdf8', textDecoration: 'none' }}>
            🟢 System Health Monitor
          </Link>
          <Link to="/admin/chaos" style={{ color: '#f87171', fontWeight: 600, textDecoration: 'none' }}>
            ⚡ Chaos Engineering Lab
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 800,
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
              NEXORA<span style={{ color: '#2563eb' }}>.TECH</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.04em' }}>
              FLAGSHIP ELECTRONICS STORE
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        {location.pathname === '/products' && (
          <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search flagship phones, laptops, audio, consoles..."
              value={searchTerm || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.9rem',
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Right Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/products"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/products' ? '#2563eb' : '#475569',
              textDecoration: 'none',
            }}
          >
            Catalog
          </Link>

          {/* Cart Pill */}
          <Link
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 0.9rem',
              background: '#f1f5f9',
              borderRadius: '9999px',
              textDecoration: 'none',
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🛒</span>
            <span>Cart</span>
            {totalCount > 0 && (
              <span
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '2px 7px',
                }}
              >
                {totalCount}
              </span>
            )}
            {totalAmount > 0 && (
              <span style={{ color: '#0f172a', fontWeight: 700 }}>
                ${totalAmount.toFixed(0)}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  background: '#eff6ff',
                  borderRadius: '9999px',
                  color: '#1e40af',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <span>👤</span>
                <span>{user.username || user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
