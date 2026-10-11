import React, { useState } from 'react';
import api from '../api/axios';
import ChaosCard from '../components/ChaosCard';
import { Link } from 'react-router-dom';

const ChaosAdmin = () => {
  const [activeTrigger, setActiveTrigger] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChaos = async (endpoint) => {
    setActiveTrigger(endpoint);
    setStatusMessage('');
    try {
      const res = await api.post(`/api/chaos/${endpoint}`);
      setStatusMessage(res.data.message || `Chaos trigger ${endpoint} executed.`);
    } catch (err) {
      console.error('Chaos trigger failed', err);
      setStatusMessage('Trigger response: ' + (err.response?.data?.message || err.message));
    } finally {
      setActiveTrigger(null);
    }
  };

  const handleReset = async () => {
    try {
      const res = await api.post('/api/chaos/reset');
      setStatusMessage(res.data.message || 'All chaos states cleared.');
    } catch (err) {
      setStatusMessage('Reset error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span>⚠️ FAILURE INJECTION ENGINE</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.25rem' }}>Chaos Engineering Lab</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Inject catastrophic failures into checkout, database pool, event loop, and disk storage to train NEXORA Root Cause Analysis (RCA).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleReset} className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            🔄 Reset All Triggers
          </button>
          <Link to="/health" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
            View Health Monitor →
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div style={{ padding: '1rem 1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <strong>Command Feedback:</strong> {statusMessage}
        </div>
      )}

      {/* Grid of 4 Chaos Triggers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <ChaosCard
          title="Trigger 1: Payment Gateway Timeout"
          description="Forces the internal PaymentSimulator to hang for 30,000ms on the next 50 checkout requests."
          instructions="Trigger this, then go to Cart -> Checkout. The 'Pay Now' action will hang for 30s and return a 504 Gateway Timeout, emitting a CRITICAL_LATENCY alert to NEXORA."
          onTrigger={() => handleChaos('payment-timeout')}
          isTriggering={activeTrigger === 'payment-timeout'}
          recoveryTimeMs={0}
        />

        <ChaosCard
          title="Trigger 2: Database Connection Drop"
          description="Forcefully closes the Mongoose/MongoDB connection pool for 60 seconds."
          instructions="Trigger this, then visit Products or Health. Catalog queries fail instantly with MongoNotConnectedError (503). Auto-recovers after 60s."
          onTrigger={() => handleChaos('db-drop')}
          isTriggering={activeTrigger === 'db-drop'}
          recoveryTimeMs={60000}
        />

        <ChaosCard
          title="Trigger 3: CPU Event Loop Starvation"
          description="Executes a synchronous, computationally heavy while loop for exactly 10 seconds."
          instructions="Trigger this, then observe queued HTTP requests. Node.js event loop blocks completely. NEXORA receives a NODE_EVENT_LOOP_BLOCKED health metric."
          onTrigger={() => handleChaos('cpu-spike')}
          isTriggering={activeTrigger === 'cpu-spike'}
          recoveryTimeMs={10000}
        />

        <ChaosCard
          title="Trigger 4: Filesystem I/O Fault"
          description="Temporarily disables the product cache JSON file to cause ENOENT storage errors for 30 seconds."
          instructions="Trigger this, then visit Products. The storage badge switches from 'Cache' to 'DB' as catalog falls back to MongoDB. Auto-restores in 30s."
          onTrigger={() => handleChaos('fs-fault')}
          isTriggering={activeTrigger === 'fs-fault'}
          recoveryTimeMs={30000}
        />
      </div>
    </div>
  );
};

export default ChaosAdmin;
