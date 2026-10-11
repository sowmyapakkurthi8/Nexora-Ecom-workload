import express from 'express';
import Order from '../models/Order.js';
import { authenticateJWT } from '../middleware/auth.js';
import { processPayment } from '../services/paymentSimulator.js';

const router = express.Router();

// POST /api/checkout (FR 3.1)
router.post('/', authenticateJWT, async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart items are required for checkout' });
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  let order;
  try {
    order = new Order({
      userId: req.user?.id || null,
      items,
      totalAmount,
      status: 'PENDING',
    });
    await order.save();
  } catch (err) {
    console.error('[Checkout] Failed to create pending order:', err.message);
    return res.status(500).json({ message: 'Failed to initiate checkout order', error: err.message });
  }

  try {
    // Process simulated payment with built-in latency, 5% failure, or chaos hang (FR 3.2, FR 3.3, FR 3.4)
    const paymentResult = await processPayment({
      orderId: order._id.toString(),
      totalAmount,
    });

    order.status = 'COMPLETED';
    order.paymentRef = paymentResult.paymentRef;
    order.processingTimeMs = paymentResult.processingTimeMs;
    await order.save();

    return res.status(200).json({
      message: 'Order completed and payment approved',
      orderId: order._id,
      paymentRef: paymentResult.paymentRef,
      processingTimeMs: paymentResult.processingTimeMs,
    });
  } catch (paymentErr) {
    console.warn(`[Checkout] Payment failed for order ${order._id}: ${paymentErr.message} (status: ${paymentErr.status || 500})`);

    const failureStatus = paymentErr.status || 500;
    order.status = paymentErr.code === 'INSUFFICIENT_FUNDS'
      ? 'FAILED_INSUFFICIENT_FUNDS'
      : paymentErr.code === 'GATEWAY_TIMEOUT'
      ? 'GATEWAY_TIMEOUT'
      : 'ERROR';
    order.processingTimeMs = paymentErr.processingTimeMs || 0;
    await order.save().catch(() => {});

    return res.status(failureStatus).json({
      message: paymentErr.message,
      orderId: order._id,
      code: paymentErr.code || 'PAYMENT_ERROR',
      processingTimeMs: paymentErr.processingTimeMs || 0,
    });
  }
});

export default router;
