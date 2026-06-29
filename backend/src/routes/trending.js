import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireTier } from '../middleware/subscription.js';
import { getTrends } from '../services/trendsService.js';

const router = express.Router();

router.get('/:platform', auth, requireTier('premium'), async (req, res) => {
  const { platform } = req.params;
  
  try {
    const trends = await getTrends(platform);
    res.json({ platform, trends });
  } catch (error) {
    console.error('Trends fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch trends' });
  }
});

export default router;
