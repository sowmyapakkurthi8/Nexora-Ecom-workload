import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Health = () => {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [refreshCountdown, setRefreshCountdown] = useState(5);

  const fetchHealth = async () => {
    try {
      const res = await api.get('/health');
      setHealth(res.data);
      setError(null);
    } catch (err) {
      if (err.response) {
        setHealth(err.response.data);
      } else {
        setHealth(null);
      }
      setError(err.message || 'Failed to reach health endpoint');
    }
    setLastUpdated(new Date().toLocaleTimeString());
    setRefreshCountdown(5);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    const ticker = setInterval(() => {
      setRefreshCountdown((prev) => (prev > 1 ? prev - 1 : 5));
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(ticker);
    };
  }, []);

  const isHealthy = health?.status === 'healthy';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span>NEXORA AIOPS TELEMETRY PIPELINE</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.25rem' }}>Workload System Health</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Real-time status for local MongoDB, filesystem JSON cache, and Node.js process runtime.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isHealthy ? '#10b981' : '#ef4444', animation: 'pulse 1.5s infinite' }} />
          <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
          <span style={{ fontSize: '0.85rem', color: '#475569' }}>
            Auto-refresh in <strong>{refreshCountdown}s</strong> (Updated {lastUpdated})
          </span>
          <button onClick={fetchHealth} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            Refresh Now
          </button>
        </div>
      </div>

      {error && !health && (
        <div style={{ padding: '1.25rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b', marginBottom: '2rem' }}>
          <strong>Endpoint Connection Failure:</strong> {error}
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#b91c1c' }}>
            Ensure the Express backend is running on port 5000 (`npm run server`).
          </p>
        </div>
      )}

      {health && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Status Hero */}
          <div
            style={{
              background: isHealthy ? 'linear-gradient(135deg, #065f46, #047857)' : 'linear-gradient(135deg, #991b1b, #b91c1c)',
              borderRadius: '16px',
              padding: '2rem',
              color: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>
                Aggregate System State
              </span>
              <h2 style={{ fontSize: '2.4rem', color: '#ffffff', margin: '0.25rem 0' }}>
                {isHealthy ? 'SYSTEM OPERATIONAL' : 'SYSTEM DEGRADED'}
              </h2>
              <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                {isHealthy
                  ? 'All microservice dependencies and local storage caches are responding nominal.'
                  : 'A chaos trigger or dependency failure is actively impacting catalog availability.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem 1.5rem', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>Process Uptime</span>
                <strong style={{ fontSize: '1.5rem' }}>{health.uptimeSeconds}s</strong>
              </div>
            </div>
          </div>

          {/* Dependencies Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* MongoDB Dependency */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🗄️</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Local MongoDB</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>localhost:27017/nexora_ecom</span>
                  </div>
                </div>
                <span className={`badge ${health.dependencies?.mongodb?.healthy ? 'badge-success' : 'badge-danger'}`}>
                  {health.dependencies?.mongodb?.state?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Primary database for mock users, catalog documents, and simulated checkout orders.
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Connection Pool State:</span>
                <strong>{health.dependencies?.mongodb?.healthy ? 'Active & Ready' : 'Severed (Trigger 2)'}</strong>
              </div>
            </div>

            {/* File Cache Dependency */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚡</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Filesystem Cache</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>products_cache.json</span>
                  </div>
                </div>
                <span className={`badge ${health.dependencies?.fileCache?.healthy ? 'badge-success' : 'badge-danger'}`}>
                  {health.dependencies?.fileCache?.present ? 'CACHED' : 'FAULTED'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Node.js `fs` module cache providing low-latency product metadata reads.
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Disk Read Status:</span>
                <strong>{health.dependencies?.fileCache?.healthy ? 'Synchronized' : 'ENOENT Fault (Trigger 4)'}</strong>
              </div>
            </div>
          </div>

          {/* Process Memory Consumption */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1.25rem' }}>
              Process Memory Consumption (Node.js os module)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Heap Memory Used</span>
                <strong style={{ fontSize: '1.4rem', color: '#0f172a' }}>{health.memory?.heapUsedMB} MB</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Active JS allocations</span>
              </div>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Heap Total Allocated</span>
                <strong style={{ fontSize: '1.4rem', color: '#0f172a' }}>{health.memory?.heapTotalMB} MB</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Committed V8 memory</span>
              </div>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Resident Set Size (RSS)</span>
                <strong style={{ fontSize: '1.4rem', color: '#0f172a' }}>{health.memory?.rssMB} MB</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Total RAM occupied</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Want to test how NEXORA detects simulated catastrophic failures?
            </span>
            <Link to="/admin/chaos" className="btn-primary" style={{ background: '#dc2626' }}>
              Open Chaos Engineering Lab →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Health;
