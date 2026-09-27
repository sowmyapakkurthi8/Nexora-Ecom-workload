import React, { useState } from 'react';
import api from '../api/axios';
import ChaosCard from '../components/ChaosCard';

const ChaosAdmin = () => {
  const [activeTrigger, setActiveTrigger] = useState(null);

  const handleChaos = async (endpoint) => {
    setActiveTrigger(endpoint);
    try {
      await api.post(`/api/chaos/${endpoint}`);
    } catch (err) {
      console.error('Chaos trigger failed', err);
      alert('Failed to trigger chaos: ' + (err.response?.data?.message || err.message));
    } finally {
      setActiveTrigger(null);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Chaos Engineering Admin</h2>
      <p style={{ color: '#666' }}>Warning: These triggers intentionally degrade the system for AIOps testing.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <ChaosCard
          title="Payment Timeout"
          description="Forces the payment gateway simulator to hang for 30s for the next 50 checkouts."
          instructions="Trigger this, then go to Cart -> Checkout. The 'Pay Now' action will hang for 30s and return a 504 Gateway Timeout."
          onTrigger={() => handleChaos('payment-timeout')}
          isTriggering={activeTrigger === 'payment-timeout'}
          recoveryTimeMs={0} // Doesn't auto recover by time, it's by request count
        />

        <ChaosCard
          title="Database Drop"
          description="Forcefully closes the MongoDB connection pool for 60 seconds."
          instructions="Trigger this, then visit the Products page. It should fail to load and return a 503 error. Auto-recovers after 60s."
          onTrigger={() => handleChaos('db-drop')}
          isTriggering={activeTrigger === 'db-drop'}
          recoveryTimeMs={60000}
        />

        <ChaosCard
          title="CPU Spike"
          description="Executes a synchronous operation blocking the Node.js event loop for 10s."
          instructions="Trigger this, then try to load Products or Health. Requests will hang/queue for ~10s before fulfilling."
          onTrigger={() => handleChaos('cpu-spike')}
          isTriggering={activeTrigger === 'cpu-spike'}
          recoveryTimeMs={10000}
        />

        <ChaosCard
          title="Filesystem Fault"
          description="Temporarily renames the cache file to cause ENOENT storage errors for 30s."
          instructions="Trigger this, then visit Products. The badge should switch from 'Cache' to 'DB' as it falls back. Auto-recovers after 30s."
          onTrigger={() => handleChaos('fs-fault')}
          isTriggering={activeTrigger === 'fs-fault'}
          recoveryTimeMs={30000}
        />
      </div>
    </div>
  );
};

export default ChaosAdmin;
