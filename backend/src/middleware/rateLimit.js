import { query } from '../db/schema.js';
import crypto from 'crypto';

const LIMITS = {
  'free': 2,
  'pro': 50,
  'premium': Infinity
};

export const checkIdeaLimit = async (req, res, next) => {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  try {
    const users = await query(`SELECT subscription_tier FROM users WHERE id = '${userId}'`);
    const tier = users[0]?.subscription_tier || 'free';
    const limit = LIMITS[tier] || 5;

    // Premium tier has no limit — skip usage check entirely
    if (limit === Infinity) {
      req.usageInfo = { tier, currentMonth };
      return next();
    }

    const usage = await query(`SELECT * FROM usage_log WHERE user_id = '${userId}' AND month = '${currentMonth}'`);
    const ideasGenerated = usage.length > 0 ? usage[0].ideas_generated : 0;

    if (ideasGenerated >= limit) {
      return res.status(403).json({
        message: `Monthly limit reached for ${tier} tier. Please upgrade for more ideas.`,
        limit_reached: true,
        tier,
        limit
      });
    }

    req.usageInfo = {
      tier,
      currentMonth,
      usageRecord: usage[0]
    };

    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({ message: 'Internal server error during limit check' });
  }
};

export const incrementUsage = async (userId, currentMonth, usageRecord, count = 1) => {
  if (usageRecord) {
    await query(`UPDATE usage_log SET ideas_generated = ideas_generated + ${count} WHERE user_id = '${userId}' AND month = '${currentMonth}'`);
  } else {
    const usageId = crypto.randomUUID();
    await query(`INSERT INTO usage_log (id, user_id, month, ideas_generated) VALUES ('${usageId}', '${userId}', '${currentMonth}', ${count})`);
  }
};
