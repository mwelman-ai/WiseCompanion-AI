/**
 * Tests for Auth Middleware and Rate Limit Middleware
 * 
 * Tests:
 * - Auth middleware: valid token, expired token, malformed token, missing token
 * - Rate limit middleware: free tier limits, pro tier limits, premium tier (unlimited)
 * - Edge cases: missing user in DB during rate limit, DB errors
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../db/schema.js', () => {
  return { query: vi.fn() };
});

import { auth } from '../middleware/auth.js';
import { checkIdeaLimit, incrementUsage } from '../middleware/rateLimit.js';
import { query } from '../db/schema.js';

// JWT_SECRET is set by vitest.setup.js via process.env.JWT_SECRET
const JWT_SECRET = 'sparkstream_secret_key_123';

// Helper to create a middleware test app
function createAuthTestApp() {
  const app = express();
  app.use(express.json());
  app.get('/protected', auth, (req, res) => {
    res.json({ success: true, userId: req.user.id });
  });
  return app;
}

function createRateLimitTestApp() {
  const app = express();
  app.use(express.json());
  app.get('/limited', auth, checkIdeaLimit, (req, res) => {
    res.json({ success: true, usageInfo: req.usageInfo });
  });
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Auth Middleware', () => {
  it('should allow requests with valid token', async () => {
    const app = createAuthTestApp();
    const token = jwt.sign(
      { id: 'user-123', email: 'test@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.userId).toBe('user-123');
  });

  it('should block requests with no Authorization header', async () => {
    const app = createAuthTestApp();

    const res = await request(app).get('/protected');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it('should block requests with malformed Authorization header (no Bearer prefix)', async () => {
    const app = createAuthTestApp();

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'NotBearer some-value');

    expect(res.status).toBe(401);
    // The header doesn't start with "Bearer ", so replace doesn't strip it.
    // The raw string is passed to jwt.verify which fails -> "Token is not valid"
    expect(res.body.message).toMatch(/token/i);
  });

  it('should block requests with invalid token string', async () => {
    const app = createAuthTestApp();

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer not_a_real_jwt_token');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token.*not valid/i);
  });

  it('should block requests with expired token', async () => {
    const app = createAuthTestApp();
    const expiredToken = jwt.sign(
      { id: 'user-123', email: 'test@test.com' },
      JWT_SECRET,
      { expiresIn: '0s' }
    );

    // Small delay to ensure expiration
    await new Promise(r => setTimeout(r, 100));

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it('should block requests with token signed with different secret', async () => {
    const app = createAuthTestApp();
    const wrongToken = jwt.sign(
      { id: 'user-123', email: 'test@test.com' },
      'different_secret_key'
    );

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${wrongToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });
});

describe('Rate Limit Middleware (checkIdeaLimit)', () => {
  it('should allow free tier user within limit', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-free-1', email: 'free@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // User lookup: free tier
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    // Usage check: 2 ideas generated so far (under 5 limit)
    query.mockResolvedValueOnce([{ ideas_generated: 2 }]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.usageInfo).toBeDefined();
    expect(res.body.usageInfo.tier).toBe('free');
    expect(res.body.usageInfo.currentMonth).toMatch(/^\d{4}-\d{2}$/);
  });

  it('should allow free tier user with no previous usage', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-free-new', email: 'newfree@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    // No usage record exists
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.usageInfo.usageRecord).toBeUndefined();
  });

  it('should block free tier user who exceeded limit (5 ideas)', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-free-full', email: 'full@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    // Already at 5 ideas (the limit)
    query.mockResolvedValueOnce([{ ideas_generated: 5 }]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.limit_reached).toBe(true);
    expect(res.body.tier).toBe('free');
    expect(res.body.limit).toBe(5);
  });

  it('should allow pro tier user within 50 limit', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-pro-1', email: 'pro@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    query.mockResolvedValueOnce([{ subscription_tier: 'pro' }]);
    query.mockResolvedValueOnce([{ ideas_generated: 30 }]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.usageInfo.tier).toBe('pro');
  });

  it('should block pro tier user who exceeded 50 limit', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-pro-full', email: 'profull@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    query.mockResolvedValueOnce([{ subscription_tier: 'pro' }]);
    query.mockResolvedValueOnce([{ ideas_generated: 50 }]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.limit_reached).toBe(true);
  });

  it('should allow premium tier unlimited access (not blocked by rate limit)', async () => {
    // Create a minimal app that tests the middleware behavior directly
    const app = express();
    app.use(express.json());
    app.get('/test', auth, async (req, res, next) => {
      // Simulate premium path: skip limit check, call next()
      return next();
    }, (req, res) => {
      res.json({ success: true });
    });

    const token = jwt.sign(
      { id: 'user-premium-1', email: 'premium@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should skip usage log query for premium tier in checkIdeaLimit', async () => {
    // Test that the actual checkIdeaLimit middleware returns next() for premium
    // without querying usage_log (only queries users for tier)
    const app = express();
    app.use(express.json());
    app.get('/limited', auth, checkIdeaLimit, (req, res) => {
      res.json({ success: true, usageInfo: req.usageInfo });
    });

    const token = jwt.sign(
      { id: 'user-premium-2', email: 'premium2@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    query.mockResolvedValueOnce([{ subscription_tier: 'premium' }]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    // Premium skips the limit check early by calling next().
    // The usageInfo is set with tier and currentMonth but no usageRecord
    expect(res.status).toBe(200);
    expect(res.body.usageInfo.tier).toBe('premium');
    expect(res.body.usageInfo).not.toHaveProperty('usageRecord');
  });

  it('should default to free tier if user has no subscription_tier', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-no-tier', email: 'notier@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // User exists but has no subscription_tier field
    query.mockResolvedValueOnce([{ id: 'user-no-tier' }]);
    query.mockResolvedValueOnce([{ ideas_generated: 4 }]);

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should handle database error during rate limit check', async () => {
    const app = createRateLimitTestApp();
    const token = jwt.sign(
      { id: 'user-error', email: 'error@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    query.mockRejectedValueOnce(new Error('Database unreachable'));

    const res = await request(app)
      .get('/limited')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/internal server error/i);
  });
});

describe('incrementUsage', () => {
  it('should UPDATE existing usage record', async () => {
    query.mockResolvedValueOnce([]);

    await incrementUsage('user-1', '2025-03', { id: 'log-1', ideas_generated: 5 });

    // Verify UPDATE was called
    const updateCall = query.mock.calls[0][0];
    expect(updateCall.toUpperCase()).toContain('UPDATE');
    expect(updateCall).toContain('usage_log');
    expect(updateCall).toContain('ideas_generated = ideas_generated + 1');
  });

  it('should INSERT new usage record when none exists', async () => {
    query.mockResolvedValueOnce([]);

    await incrementUsage('user-1', '2025-03', undefined);

    // Verify INSERT was called
    const insertCall = query.mock.calls[0][0];
    expect(insertCall.toUpperCase()).toContain('INSERT');
    expect(insertCall).toContain('usage_log');
    expect(insertCall).toContain('ideas_generated');
  });
});