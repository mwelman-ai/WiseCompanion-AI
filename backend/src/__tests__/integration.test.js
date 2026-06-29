/**
 * Integration tests for the full SparkStream API
 * 
 * Tests end-to-end flows:
 * 1. Signup → Login → Generate Idea → List Ideas → Update Status
 * 2. Full auth + rate limiting interaction
 * 3. Error flows across multiple routes
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock all dependencies
vi.mock('../db/schema.js', () => {
  const { mockUsers, mockIdeas, mockUsageLog, resetMockDb, DEFAULT_USER_ID, DEFAULT_USER } = require('./helpers.js');
  // We'll use vi.hoisted or just re-export the mock functions
  return { query: vi.fn() };
});

vi.mock('../services/aiService.js', () => {
  return { 
    generateIdeas: vi.fn() 
  };
});

// Now import the actual query mock after the mock is set up
import { query } from '../db/schema.js';
import { generateIdeas } from '../services/aiService.js';
import authRoutes from '../routes/auth.js';
import ideaRoutes from '../routes/ideas.js';

const JWT_SECRET = 'sparkstream_secret_key_123'; // Set by vitest.setup.js

// Create a combined app without starting a server
function createFullApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/ideas', ideaRoutes);
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Full Auth Flow: Signup → Login', () => {
  it('should complete the full signup and login cycle', async () => {
    const app = createFullApp();

    const newEmail = 'fullcycle@test.com';
    const newPassword = 'CyclePass123!';
    const newName = 'Full Cycle User';

    // STEP 1: Signup
    query.mockResolvedValueOnce([]); // No existing user
    query.mockResolvedValueOnce([]); // Insert succeeds

    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ email: newEmail, password: newPassword, name: newName });

    expect(signupRes.status).toBe(200);
    expect(signupRes.body).toHaveProperty('token');
    expect(signupRes.body.user.email).toBe(newEmail);

    const signupToken = signupRes.body.token;

    // STEP 2: Verify the token works
    const decoded = jwt.verify(signupToken, JWT_SECRET);
    expect(decoded).toHaveProperty('id');
    expect(decoded.email).toBe(newEmail);

    // STEP 3: Login with the same credentials
    // We need to simulate what the DB would have after signup
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    query.mockResolvedValueOnce([{
      id: decoded.id,
      email: newEmail,
      name: newName,
      password_hash: hash,
      subscription_tier: 'free'
    }]);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: newEmail, password: newPassword });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body.user.email).toBe(newEmail);
    expect(loginRes.body.user.name).toBe(newName);
    expect(loginRes.body.user.subscription_tier).toBe('free');
  });
});

describe('Full Idea Flow: Generate → List → Update Status', () => {
  it('should generate ideas, list them, and update their status', async () => {
    const TOKEN_USER_ID = 'integration-user-1';
    const token = jwt.sign(
      { id: TOKEN_USER_ID, email: 'integration@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const app = createFullApp();

    // STEP 1: Generate ideas
    // Rate limit middleware checks
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]); // user lookup
    query.mockResolvedValueOnce([]); // no usage yet
    // AI service returns ideas
    generateIdeas.mockResolvedValueOnce([
      { title: 'Integration Idea 1', hook: 'Hook 1', description: 'Desc 1' },
      { title: 'Integration Idea 2', hook: 'Hook 2', description: 'Desc 2' }
    ]);
    // INSERT for idea 1
    query.mockResolvedValueOnce([]);
    // INSERT for idea 2
    query.mockResolvedValueOnce([]);
    // increment usage
    query.mockResolvedValueOnce([]);

    const genRes = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'travel', platform: 'instagram', count: 2 });

    expect(genRes.status).toBe(200);
    expect(genRes.body.ideas).toHaveLength(2);
    const idea1Id = genRes.body.ideas[0].id;
    const idea2Id = genRes.body.ideas[1].id;

    // STEP 2: List ideas
    query.mockResolvedValueOnce([
      { id: idea1Id, user_id: TOKEN_USER_ID, niche: 'travel', platform: 'instagram', title: 'Integration Idea 1', status: 'generated' },
      { id: idea2Id, user_id: TOKEN_USER_ID, niche: 'travel', platform: 'instagram', title: 'Integration Idea 2', status: 'generated' }
    ]);

    const listRes = await request(app)
      .get('/api/ideas')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(2);

    // STEP 3: Update status of first idea
    query.mockResolvedValueOnce([{
      id: idea1Id,
      user_id: TOKEN_USER_ID,
      status: 'generated'
    }]);
    query.mockResolvedValueOnce([]);

    const updateRes = await request(app)
      .patch(`/api/ideas/${idea1Id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'saved' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('saved');
  });
});

describe('Error Flow: Rate Limited User Tries to Generate', () => {
  it('should prevent generating when rate limit is exceeded after multiple generations', async () => {
    const TOKEN_USER_ID = 'rate-limited-user';
    const token = jwt.sign(
      { id: TOKEN_USER_ID, email: 'ratelimited@test.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const app = createFullApp();

    // User is on free tier - at limit already
    query.mockResolvedValueOnce([{ subscription_tier: 'free' }]);
    query.mockResolvedValueOnce([{ ideas_generated: 5 }]);

    const res = await request(app)
      .post('/api/ideas/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'gaming', platform: 'tiktok' });

    expect(res.status).toBe(403);
    expect(res.body.limit_reached).toBe(true);
    expect(res.body.message).toMatch(/limit reached/i);
  });
});

describe('Error Flow: Unauthorized Access to Protected Routes', () => {
  it('should reject access to ideas routes without auth', async () => {
    const app = createFullApp();

    const res = await request(app)
      .post('/api/ideas/generate')
      .send({ niche: 'gaming', platform: 'tiktok' });

    expect(res.status).toBe(401);
  });

  it('should reject listing ideas without auth', async () => {
    const app = createFullApp();

    const res = await request(app)
      .get('/api/ideas');

    expect(res.status).toBe(401);
  });
});