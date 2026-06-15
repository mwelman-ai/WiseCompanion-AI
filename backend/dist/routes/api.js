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
const router = Router();
// Mount Auth routes: /api/auth/signup, /api/auth/login, /api/auth/me
router.use('/auth', authRouter);
// Mount Chat routes: /api/chat, /api/chat/history
router.use('/chat', chatRouter);
// Mount Scam analysis route: /api/scam-check
router.use('/scam-check', scamRouter);
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
export default router;
//# sourceMappingURL=api.js.map