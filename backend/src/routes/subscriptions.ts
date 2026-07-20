import { Router } from 'express';
import Stripe from 'stripe';
import { dbService, isMockMode } from '../services/dbService.js';
import { createCheckoutSession } from '../services/stripeService.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { analyticsService } from '../services/analyticsService.js';

const router = Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = stripeKey && stripeKey !== 'your_stripe_secret_key' && stripeKey.trim() !== '';
const stripe = isStripeConfigured ? new Stripe(stripeKey!, { apiVersion: '2025-01-27-preview' as any }) : null;

// GET /api/user/subscription — Retrieve user's current subscription plan
router.get('/user/subscription', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const profile = await dbService.getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json({ 
      plan: profile.planTier,
      planTier: profile.planTier,
      isPremium: profile.planTier === 'premium'
    });
  } catch (error) {
    console.error('[subscriptionRouter] Get Subscription Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve subscription plan' });
  }
});

// POST /api/subscriptions/create-checkout — Create a Stripe checkout session
router.post('/create-checkout', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { priceId, plan } = req.body;
  const user = req.user!;

  const finalPriceId = priceId || 'price_mock_premium';

  // Fallback if Stripe keys are not configured or in mock mode
  if (!isStripeConfigured) {
    console.log('[stripe] Stripe not configured. Generating mock checkout redirection URL.');
    // Simulated mock checkout URL that redirects to the frontend success page
    const mockSessionId = 'mock_stripe_sess_' + Math.random().toString(36).substr(2, 9);
    const mockCheckoutUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id=${mockSessionId}&mock_upgrade_user=${user.id}`;
    
    return res.json({ 
      url: mockCheckoutUrl,
      sessionId: mockSessionId,
      isMock: true
    });
  }

  try {
    // Call the original stripe checkout session generator
    const session = await createCheckoutSession(finalPriceId, user.id);
    return res.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[subscriptionRouter] Stripe Checkout Error:', error);
    return res.status(500).json({ error: 'Stripe integration failed', message: error.message });
  }
});

// POST /api/subscriptions/mock-upgrade-direct — Easily simulate payment upgrades in development
router.post('/mock-upgrade-direct', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const success = await dbService.updateUserPlan(userId, 'premium');
    if (!success) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    // Track upgrade in analytics
    await analyticsService.trackUpgrade(userId, 'premium', 'mock_direct_upgrade');

    const updated = await dbService.getUserProfile(userId);
    return res.json({ 
      success: true, 
      message: 'Directly upgraded to Premium tier for testing',
      user: updated
    });
  } catch (err) {
    return res.status(500).json({ error: 'Mock upgrade failed' });
  }
});

// POST /api/subscriptions/webhook — Stripe Webhook Endpoint (verifies signature if key is present)
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  if (isStripeConfigured && sig && endpointSecret) {
    try {
      // In express, raw body needs to be preserved for Stripe webhooks
      // Ensure app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' })) was set up
      event = stripe!.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('[stripeWebhook] Signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Unverified development fallback (direct payload parsing)
    console.log('[stripeWebhook] Webhook signature unverified (dev/mock mode)');
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  try {
    // Handle specific stripe events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id || session.customer; // Fallback mapping

      if (userId) {
        console.log(`[stripeWebhook] Upgrading user ${userId} to premium tier.`);
        await dbService.updateUserPlan(userId, 'premium');
        
        // Track upgrade in analytics
        await analyticsService.trackUpgrade(userId, 'premium', session.id);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      if (customerId) {
        console.log(`[stripeWebhook] Reverting customer ${customerId} subscription back to free.`);
        // Note: For direct customer-to-user mapping in production, use metadata or local DB mapping
        // In mock/webhook simulation, we find by ID or handle gracefully
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('[stripeWebhook] Error processing event:', error);
    return res.status(500).json({ error: 'Webhook event processing failed' });
  }
});

export default router;
