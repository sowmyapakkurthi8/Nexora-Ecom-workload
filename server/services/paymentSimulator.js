import { dispatchAlertToNexora } from './telemetryDispatcher.js';

let chaosTimeoutRequestsRemaining = 0;

export const activatePaymentTimeoutChaos = (count = 50) => {
  chaosTimeoutRequestsRemaining = count;
  console.warn(`[Chaos Trigger 1] Payment Gateway Timeout activated for next ${count} requests (30,000ms delay each)!`);
  return {
    active: true,
    requestsConfigured: count,
    remainingRequests: chaosTimeoutRequestsRemaining,
  };
};

export const resetPaymentChaos = () => {
  chaosTimeoutRequestsRemaining = 0;
  console.log('[PaymentSimulator] Chaos timeout reset to 0.');
  return { active: false, remainingRequests: 0 };
};

export const getPaymentChaosStatus = () => {
  return {
    chaosActive: chaosTimeoutRequestsRemaining > 0,
    remainingRequests: chaosTimeoutRequestsRemaining,
  };
};

export const processPayment = async ({ orderId, totalAmount }) => {
  const startTime = Date.now();

  // Check if Chaos Trigger 1 is active
  if (chaosTimeoutRequestsRemaining > 0) {
    chaosTimeoutRequestsRemaining -= 1;
    console.warn(`[Chaos Trigger 1] Injecting 30,000ms hang for order ${orderId}. Remaining chaos requests: ${chaosTimeoutRequestsRemaining}`);

    // Dispatch alert to NEXORA
    dispatchAlertToNexora({
      level: 'CRITICAL',
      alertType: 'CRITICAL_LATENCY',
      service: 'payment-simulator',
      message: 'Payment gateway timeout injected. Latency expected: 30000ms. Response: 504 Gateway Timeout.',
      orderId,
    });

    // Artificially hang for 30,000 ms
    await new Promise((resolve) => setTimeout(resolve, 30000));

    const elapsed = Date.now() - startTime;
    const error = new Error('Gateway Timeout: Payment simulator did not receive an upstream response within 30000ms');
    error.status = 504;
    error.code = 'GATEWAY_TIMEOUT';
    error.orderId = orderId;
    error.processingTimeMs = elapsed;
    throw error;
  }

  // Normal execution: random artificial delay between 200ms and 1500ms (FR 3.3)
  const delay = Math.floor(Math.random() * (1500 - 200 + 1)) + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const elapsed = Date.now() - startTime;

  // Natural 5% failure rate (FR 3.4)
  const isFailure = Math.random() < 0.05;
  if (isFailure) {
    const failureTypes = ['INSUFFICIENT_FUNDS', 'GATEWAY_TIMEOUT'];
    const chosenFailure = failureTypes[Math.floor(Math.random() * failureTypes.length)];

    console.warn(`[PaymentSimulator] Natural 5% organic failure triggered: ${chosenFailure} for order ${orderId}`);

    if (chosenFailure === 'INSUFFICIENT_FUNDS') {
      const error = new Error('Payment declined: INSUFFICIENT_FUNDS');
      error.status = 402;
      error.code = 'INSUFFICIENT_FUNDS';
      error.orderId = orderId;
      error.processingTimeMs = elapsed;
      throw error;
    } else {
      const error = new Error('Payment gateway timeout: GATEWAY_TIMEOUT');
      error.status = 504;
      error.code = 'GATEWAY_TIMEOUT';
      error.orderId = orderId;
      error.processingTimeMs = elapsed;
      throw error;
    }
  }

  // Successful payment
  const paymentRef = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return {
    success: true,
    paymentRef,
    processingTimeMs: elapsed,
  };
};
