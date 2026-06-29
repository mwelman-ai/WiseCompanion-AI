import Stripe from 'stripe';
import dotenv from 'dotenv';
import { query } from '../db/schema.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const TIER_PRICES = {
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
  premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_placeholder'
};

export const createCheckoutSession = async (userId, userEmail, tier) => {
  if (tier === 'free') {
    // If they want to go back to free, we might handle it differently, 
    // but usually checkout is for paid tiers.
    throw new Error('Cannot create checkout session for free tier');
  }

  const priceId = TIER_PRICES[tier];
  if (!priceId) {
    throw new Error(`Invalid tier: ${tier}`);
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
    console.log('Using mock Stripe checkout session (no API key found)');
    return {
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/mock-checkout?userId=${userId}&tier=${tier}`
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    automatic_tax: { enabled: true },
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId,
      tier
    }
  });

  return session;
};

export const handleWebhook = async (sig, body) => {
  let event;

  if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET === 'your_stripe_webhook_secret') {
    console.log('Using mock Stripe webhook (no webhook secret found)');
    // In mock mode, we assume body is already JSON or can be parsed
    try {
      const bodyStr = typeof body === 'string' ? body : body.toString();
      event = JSON.parse(bodyStr);
    } catch (e) {
      console.error('Failed to parse mock webhook body:', e);
      throw e;
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      throw err;
    }
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const tier = session.metadata.tier;
      const stripeCustomerId = session.customer;

      await query(`UPDATE users SET subscription_tier = '${tier}', stripe_customer_id = '${stripeCustomerId}' WHERE id = '${userId}'`);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;

      await query(`UPDATE users SET subscription_tier = 'free' WHERE stripe_customer_id = '${stripeCustomerId}'`);
      break;
    }
    // Add other event types if needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
};
