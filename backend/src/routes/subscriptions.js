import express from 'express';
import { auth } from '../middleware/auth.js';
import { createCheckoutSession, handleWebhook } from '../services/stripeService.js';
import { query } from '../db/schema.js';

const router = express.Router();

// POST /api/subscriptions/create-checkout
router.post('/subscriptions/create-checkout', auth, async (req, res) => {
  const { tier } = req.body;
  const userId = req.user.id;
  const userEmail = req.user.email;

  if (!['pro', 'premium'].includes(tier)) {
    return res.status(400).json({ message: 'Invalid subscription tier' });
  }

  try {
    const session = await createCheckoutSession(userId, userEmail, tier);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/subscriptions/webhook
router.post('/subscriptions/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    // req.body should be raw buffer here if middleware is set up correctly in index.js
    const result = await handleWebhook(sig, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// GET /api/user/subscription
router.get('/user/subscription', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await query(`SELECT subscription_tier, stripe_customer_id FROM users WHERE id = '${userId}'`);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscription info' });
  }
});

export default router;
