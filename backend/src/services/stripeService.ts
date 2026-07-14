import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = stripeKey && stripeKey !== 'your_stripe_secret_key' && stripeKey.trim() !== '';

let stripe: Stripe | null = null;
if (isStripeConfigured) {
  stripe = new Stripe(stripeKey!, {
    apiVersion: '2025-01-27-preview' as any,
  });
}

export const createCheckoutSession = async (priceId: string, userId: string) => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://frontend-five-sigma-5n7kymm3xk.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pricing`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });
    return session;
  } catch (error) {
    console.error('Stripe Error:', error);
    throw error;
  }
};

export default stripe;