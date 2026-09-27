import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Health = () => {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

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
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>System Health</h2>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Auto-refreshing every 5s. Last updated: {lastUpdated}</p>
      
      {error && !health && (
        <div style={{ color: 'red', border: '1px solid red', padding: '1rem' }}>
          <strong>Connection Error:</strong> {error}
        </div>
      )}

      {health && (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', background: health.status === 'healthy' ? '#f9fff9' : '#fff9f9' }}>
          <h3 style={{ color: health.status === 'healthy' ? 'green' : 'red', margin: '0 0 1rem 0' }}>
            Status: {health.status.toUpperCase()}
          </h3>
          <p><strong>Uptime:</strong> {health.uptimeSeconds}s</p>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <h4>Dependencies</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>
                  MongoDB: <span style={{ color: health.dependencies?.mongodb?.healthy ? 'green' : 'red' }}>
                    {health.dependencies?.mongodb?.state || 'unknown'}
                  </span>
                </li>
                <li>
                  File Cache: <span style={{ color: health.dependencies?.fileCache?.healthy ? 'green' : 'red' }}>
                    {health.dependencies?.fileCache?.present ? 'present' : 'missing'}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4>Memory</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>Heap Used: {health.memory?.heapUsedMB} MB</li>
                <li>Heap Total: {health.memory?.heapTotalMB} MB</li>
                <li>RSS: {health.memory?.rssMB} MB</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Health;
