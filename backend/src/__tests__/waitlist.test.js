import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock the query module
vi.mock('../db/schema.js', () => {
  return {
    query: vi.fn()
  };
});

import waitlistRoutes from '../routes/waitlist.js';
import { query } from '../db/schema.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/waitlist', waitlistRoutes);
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/waitlist', () => {
  it('should sign up a new user successfully', async () => {
    const app = createApp();

    // Mock successful insert
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/waitlist')
      .send({ email: 'waitlist@test.com', niche: 'tech' });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/added to the waitlist/i);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('waitlist@test.com'));
  });

  it('should reject signup with missing email', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/waitlist')
      .send({ niche: 'tech' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email is required/i);
  });

  it('should handle duplicate email conflict', async () => {
    const app = createApp();

    // Mock duplicate key error
    query.mockRejectedValueOnce({ code: 'SQLITE_CONSTRAINT_UNIQUE' });

    const res = await request(app)
      .post('/api/waitlist')
      .send({ email: 'duplicate@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already on the waitlist/i);
  });
});

describe('GET /api/waitlist/count', () => {
  it('should return the correct count', async () => {
    const app = createApp();

    // Mock count query
    query.mockResolvedValueOnce([{ count: 42 }]);

    const res = await request(app)
      .get('/api/waitlist/count');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(42);
  });
});
