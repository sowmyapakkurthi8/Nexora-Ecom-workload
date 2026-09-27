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
    <div style={{ border: '2px solid #ff4444', padding: '1rem', borderRadius: '8px', margin: '1rem', background: '#fff0f0' }}>
      <h3 style={{ color: '#cc0000', margin: '0 0 0.5rem 0' }}>{title}</h3>
      <p style={{ margin: '0 0 1rem 0' }}>{description}</p>
      <div style={{ fontSize: '0.9rem', marginBottom: '1rem', background: '#fff', padding: '0.5rem', border: '1px dashed #cc0000' }}>
        <strong>Test Instructions:</strong> {instructions}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={handleTrigger} 
          disabled={isTriggering || timeLeft > 0}
          style={{ 
            padding: '0.5rem 1rem', 
            background: (isTriggering || timeLeft > 0) ? '#ccc' : '#cc0000', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: (isTriggering || timeLeft > 0) ? 'not-allowed' : 'pointer' 
          }}
        >
          {isTriggering ? 'Triggering...' : 'Trigger Chaos'}
        </button>
        {timeLeft > 0 && (
          <span style={{ color: '#cc0000', fontWeight: 'bold' }}>
            Active (recovers in {timeLeft}s)
          </span>
        )}
      </div>
    </div>
  );
};

export default ChaosCard;
