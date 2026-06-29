import { query } from '../db/schema.js';

const TIERS = {
  'free': 0,
  'pro': 1,
  'premium': 2
};

export const requireTier = (minTier) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    
    try {
      const users = await query(`SELECT subscription_tier FROM users WHERE id = '${userId}'`);
      const userTier = users[0]?.subscription_tier || 'free';
      
      if (TIERS[userTier] < TIERS[minTier]) {
        return res.status(403).json({ 
          message: `This feature requires ${minTier} tier. Your current tier is ${userTier}.` 
        });
      }
      
      req.userTier = userTier;
      next();
    } catch (error) {
      console.error('Tier check error:', error);
      res.status(500).json({ message: 'Server error checking subscription tier' });
    }
  };
};
