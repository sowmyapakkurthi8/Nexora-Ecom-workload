import React, { useState, useEffect } from 'react';

const ChaosCard = ({ title, description, instructions, onTrigger, isTriggering, recoveryTimeMs }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleTrigger = async () => {
    await onTrigger();
    if (recoveryTimeMs) {
      setTimeLeft(recoveryTimeMs / 1000);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #fecaca',
        borderRadius: '16px',
        padding: '1.5rem',
        background: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{ color: '#b91c1c', fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>{title}</h3>
        {timeLeft > 0 && (
          <span className="badge badge-danger">
            Active ({timeLeft}s)
          </span>
        )}
      </div>

      <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {description}
      </p>

      <div
        style={{
          fontSize: '0.85rem',
          background: '#fef2f2',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          border: '1px dashed #f87171',
          color: '#7f1d1d',
          marginBottom: '1.5rem',
          lineHeight: 1.45,
        }}
      >
        <strong style={{ display: 'block', marginBottom: '2px', color: '#991b1b' }}>Validation Steps:</strong>
        {instructions}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handleTrigger}
          disabled={isTriggering || timeLeft > 0}
          style={{
            padding: '0.7rem 1.25rem',
            background: isTriggering || timeLeft > 0 ? '#cbd5e1' : '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: isTriggering || timeLeft > 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {isTriggering ? 'Triggering...' : 'Simulate Failure'}
        </button>

        {recoveryTimeMs > 0 && !timeLeft && (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Auto-recovers: {recoveryTimeMs / 1000}s
          </span>
        )}
      </div>
    </div>
  );
};

export default ChaosCard;
