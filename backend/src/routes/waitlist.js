import express from 'express';
import { query } from '../db/schema.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/waitlist or /api/waitlist/join - Signup for the waitlist
router.post(['/', '/join'], async (req, res) => {
  const { email, niche } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const id = crypto.randomUUID();
    await query(`INSERT INTO waitlist_signups (id, email, niche) VALUES ('${id}', '${email.replace(/'/g, "''")}', '${niche ? niche.replace(/'/g, "''") : ''}')`);
    res.status(201).json({ message: 'Successfully signed up for waitlist', id });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: 'Email already on waitlist' });
    }
    console.error('Waitlist signup error:', error);
    res.status(500).json({ message: 'Failed to signup for waitlist' });
  }
});

// GET /api/waitlist/count - Get total waitlist signups
router.get('/count', async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*) as count FROM waitlist_signups');
    const count = result[0]?.count || 0;
    res.json({ count });
  } catch (error) {
    console.error('Waitlist count error:', error);
    res.status(500).json({ message: 'Failed to fetch waitlist count' });
  }
});

export default router;
