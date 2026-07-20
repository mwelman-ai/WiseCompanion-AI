import { Router } from 'express';

// Import route handlers (using .js extensions for ESM in TypeScript compilation compatibility)
import authRouter from './auth.js';
import chatRouter from './chat.js';
import scamRouter from './scam.js';
import healthRouter from './health.js';
import medicationsRouter from './medications.js';
import travelRouter from './travel.js';
import familyRouter from './family.js';
import subscriptionsRouter from './subscriptions.js';
import notificationsRouter from './notifications.js';
import uploadsRouter from './uploads.js';

const router = Router();

// Waitlist signup - stores emails locally
router.post('/waitlist', (req: any, res: any) => {
  try {
    const { email, name, interest, source } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const dataDir = new URL('../data', import.meta.url).pathname;
    const signupsPath = new URL('../data/signups.json', import.meta.url).pathname;
    import('fs').then(fs => {
      let signups: any[] = [];
      if (fs.existsSync(signupsPath)) {
        try { signups = JSON.parse(fs.readFileSync(signupsPath, 'utf-8')); } catch { signups = []; }
      }
      signups.push({ email, name: name || '', interest: interest || 'both', source: source || 'signup-page', timestamp: new Date().toISOString() });
      if (!fs.existsSync(new URL('../data', import.meta.url).pathname)) fs.mkdirSync(new URL('../data', import.meta.url).pathname, { recursive: true });
      fs.writeFileSync(signupsPath, JSON.stringify(signups, null, 2));
    });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// Mount Auth routes: /api/auth/signup, /api/auth/login, /api/auth/me
router.use('/auth', authRouter);

// Mount Chat routes: /api/chat, /api/chat/history
router.use('/chat', chatRouter);

// Mount Scam analysis route: support both /api/scam-check and /api/scam/detect
router.use('/scam-check', scamRouter);
router.use('/scam/detect', scamRouter);

// Mount Health logs routes: /api/health/log, /api/health/logs
router.use('/health', healthRouter);

// Mount Recipe route directly under /api/recipes as requested
router.use('/recipes', healthRouter);

// Mount Medication tracker routes: /api/medications, /api/medications/:id, /api/medications/:id/take
router.use('/medications', medicationsRouter);

// Mount Travel assistant routes: /api/travel, /api/travel/:id
router.use('/travel', travelRouter);

// Mount Family & Communication routes: /api/family/contacts, /api/family/message, /api/family/card
router.use('/family', familyRouter);

// Mount Subscription Checkout & Webhook routes: /api/subscriptions/create-checkout, /api/subscriptions/webhook
router.use('/subscriptions', subscriptionsRouter);

// Mount direct /api/user/subscription endpoint as requested
router.use('/user', subscriptionsRouter);

// Mount Notifications routes: /api/notifications/sms
router.use('/notifications', notificationsRouter);

// Mount uploads endpoint: POST /api/uploads
router.use('/uploads', uploadsRouter);

export default router;
