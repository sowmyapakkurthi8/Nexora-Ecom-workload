import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Health from './pages/Health';
import ChaosAdmin from './pages/ChaosAdmin';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/health" element={<Health />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products externalSearch={searchTerm} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chaos"
            element={
              <ProtectedRoute>
                <ChaosAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Modern E-Commerce Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', padding: '3.5rem 1.5rem 2rem 1.5rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800 }}>
                N
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>NEXORA.TECH</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#64748b' }}>
              Synthetic E-Commerce Workload Generator designed specifically for training and evaluating external AIOps platforms.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Flagship Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Pro Smartphones</Link></li>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Workstation Laptops</Link></li>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Spatial Audio & ANC</Link></li>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Consoles & Handhelds</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>AIOps & Observability</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/health" style={{ color: '#38bdf8' }}>🟢 System Health API</Link></li>
              <li><Link to="/admin/chaos" style={{ color: '#f87171' }}>⚡ Chaos Engineering Lab</Link></li>
              <li><span style={{ color: '#64748b' }}>Telemetry: 5s interval</span></li>
              <li><span style={{ color: '#64748b' }}>Cache Layer: fs module</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Official Guarantee</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#64748b', marginBottom: '0.75rem' }}>
              All orders benefit from 2-year manufacturer coverage, 30-day trial return window, and fast 24h dispatch.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.25rem' }}>
              <span>🔒</span>
              <span>⚡</span>
              <span>📦</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1360px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#475569', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 NEXORA Tech Workload • Built strictly to SRS v1.0.0 specifications</span>
          <span>Local MongoDB • Express 5.0 • React 19</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
