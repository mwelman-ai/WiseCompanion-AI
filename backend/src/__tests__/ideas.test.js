/**
 * Tests for Ideas Routes
 * 
 * Covers:
 * - Generating ideas (with auth & rate limiting)
 * - Listing user's ideas
 * - Updating idea status
 * - Edge cases: missing niche/platform, rate limit exceeded, unauthorized access
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock dependencies
vi.mock('../db/schema.js', () => {
  return { query: vi.fn() };
});

vi.mock('../services/aiService.js', () => {
  return { generateIdeas: vi.fn() };
});

import ideaRoutes from '../routes/ideas.js';
import { query } from '../db/schema.js';
import { generateIdeas } from '../services/aiService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sparkstream_secret_key_123';
const USER_ID = 'test-user-1';

function createValidToken(overrides = {}) {
  return jwt.sign(
    { id: overrides.userId || USER_ID, email: overrides.email || 'test@test.com' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/ideas', ideaRoutes);
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/ideas/generate', () => {
  it('should generate ideas successfully', async () => {
    const app = createApp();
    const token = createValidToken();

    // Mock: user lookup for rate limit check (returns free tier)
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    // Mock: usage log check (no existing record)
    query.mockResolvedValueOnce([]);
    // Mock: generateIdeas returns mock ideas
    generateIdeas.mockResolvedValueOnce([
      { title: 'Idea 1', hook: 'Hook 1', description: 'Desc 1' },
      { title: 'Idea 2', hook: 'Hook 2', description: 'Desc 2' }
    ]);
    // Mock: INSERT for idea 1
    query.mockResolvedValueOnce([]);
    // Mock: INSERT for idea 2
    query.mockResolvedValueOnce([]);
    // Mock: increment usage - UPDATE or INSERT
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'gaming', platform: 'tiktok', count: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ideas');
    expect(res.body.ideas).toHaveLength(2);
    expect(res.body.ideas[0]).toHaveProperty('id');
    expect(res.body.ideas[0].title).toBe('Idea 1');
  });

  it('should reject generation with missing niche', async () => {
    const app = createApp();
    const token = createValidToken();

    // auth passes, rate limit middleware needs these mocks
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]); // user lookup
    query.mockResolvedValueOnce([]); // no usage record

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ platform: 'tiktok' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/niche.*platform/i);
  });

  it('should reject generation with missing platform', async () => {
    const app = createApp();
    const token = createValidToken();

    // auth passes, rate limit middleware needs these mocks
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]); // user lookup
    query.mockResolvedValueOnce([]); // no usage record

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'gaming' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/niche.*platform/i);
  });

  it('should reject idea generation without auth token', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/ideas/generate')
      .send({ niche: 'gaming', platform: 'tiktok' });

    expect(res.status).toBe(401);
  });

  it('should enforce rate limit for free tier users', async () => {
    const app = createApp();
    const token = createValidToken();

    // Mock: user lookup returns free tier
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    // Mock: usage log shows max ideas generated (5 for free)
    query.mockResolvedValueOnce([{ ideas_generated: 5 }]);

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'gaming', platform: 'tiktok' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('limit_reached', true);
    expect(res.body.message).toMatch(/limit reached/i);
  });

  it('should allow pro tier users to exceed free limit (50 ideas)', async () => {
    const app = createApp();
    const token = createValidToken({ userId: 'pro-user-1' });

    // Mock: user lookup returns pro tier
    query.mockResolvedValueOnce([{ subscription_tier: 'pro' }]);
    // Mock: usage log shows 40 ideas (under 50 limit)
    query.mockResolvedValueOnce([{ ideas_generated: 40 }]);
    // Mock: generateIdeas returns ideas
    generateIdeas.mockResolvedValueOnce([
      { title: 'Pro Idea', hook: 'Pro Hook', description: 'Pro Desc' }
    ]);
    // Mock: INSERT for idea
    query.mockResolvedValueOnce([]);
    // Mock: increment usage - UPDATE
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'business', platform: 'youtube', count: 1 });

    expect(res.status).toBe(200);
    expect(res.body.ideas).toHaveLength(1);
  });

  it('should handle AI service failure gracefully', async () => {
    const app = createApp();
    const token = createValidToken();

    // Mock: user lookup for rate limit
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    query.mockResolvedValueOnce([]);
    // Mock: AI service throws
    generateIdeas.mockRejectedValueOnce(new Error('OpenAI API error'));

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'gaming', platform: 'tiktok' });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/failed/i);
  });

  it('should handle database error during rate limit check', async () => {
    const app = createApp();
    const token = createValidToken();

    // Mock: user lookup fails
    query.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'gaming', platform: 'tiktok' });

    expect(res.status).toBe(500);
  });
});

describe('GET /api/ideas', () => {
  it('should list user ideas', async () => {
    const app = createApp();
    const token = createValidToken();

    query.mockResolvedValueOnce([
      { id: 'idea-1', user_id: USER_ID, niche: 'gaming', platform: 'tiktok', title: 'My Idea', status: 'generated' }
    ]);

    const res = await request(app)
      .get('/api/ideas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('My Idea');
  });

  it('should return empty array when user has no ideas', async () => {
    const app = createApp();
    const token = createValidToken();

    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/api/ideas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should reject listing without auth', async () => {
    const app = createApp();

    const res = await request(app)
      .get('/api/ideas');

    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/ideas/:id/status', () => {
  it('should update idea status successfully', async () => {
    const app = createApp();
    const token = createValidToken();

    // Mock: idea lookup (verify ownership)
    query.mockResolvedValueOnce([{ id: 'idea-1', user_id: USER_ID, status: 'generated' }]);
    // Mock: update
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .patch('/api/ideas/idea-1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'saved' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('saved');
  });

  it('should reject invalid status values', async () => {
    const app = createApp();
    const token = createValidToken();

    const res = await request(app)
      .patch('/api/ideas/idea-1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'invalid_status' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid status/i);
  });

  it('should return 404 when idea does not exist or belongs to another user', async () => {
    const app = createApp();
    const token = createValidToken();

    // Mock: no idea found for this user
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .patch('/api/ideas/nonexistent-idea/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'posted' });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});