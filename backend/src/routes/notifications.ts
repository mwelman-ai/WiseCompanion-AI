import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { sendSms } from '../services/twilioService.js';

const router = Router();

// POST /api/notifications/sms — Send medication reminder text via Twilio
router.post('/sms', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { to, phone, message, text, body } = req.body;

  const finalRecipient = to || phone;
  const finalMessage = message || text || body;

  if (!finalRecipient) {
    return res.status(400).json({ error: 'Recipient phone number (to/phone) is required.' });
  }

  if (!finalMessage) {
    return res.status(400).json({ error: 'Reminder message content (message/text/body) is required.' });
  }

  try {
    const result = await sendSms(finalRecipient, finalMessage);

    if (result.success) {
      return res.status(200).json({
        success: true,
        sid: result.sid,
        mocked: result.mocked,
        message: result.mocked ? 'Simulated SMS notification sent' : 'Live SMS notification sent successfully'
      });
    } else {
      return res.status(500).json({
        error: result.error || 'Failed to dispatch SMS reminder.'
      });
    }
  } catch (error: any) {
    console.error('[notificationsRouter] SMS Dispatch Error:', error);
    return res.status(500).json({
      error: 'An internal error occurred while processing SMS reminder notification.'
    });
  }
});

export default router;
