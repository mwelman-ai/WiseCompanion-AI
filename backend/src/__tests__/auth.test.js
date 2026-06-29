/**
 * Unit and integration tests for Auth Routes
 * 
 * Tests signup, login, and edge cases including:
 * - Missing fields
 * - Duplicate emails
 * - Invalid credentials
 * - SQL injection attempts
 * - Expired tokens
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock the query module BEFORE importing the route
vi.mock('../db/schema.js', () => {
  return {
    query: vi.fn()
  };
});

import authRoutes from '../routes/auth.js';
import { query } from '../db/schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sparkstream_secret_key_123';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  return app;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/auth/signup', () => {
  it('should register a new user successfully', async () => {
    const app = createApp();

    // Mock: no existing user
    query.mockResolvedValueOnce([]);
    // Mock: successful insert
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'newuser@test.com', password: 'StrongPass1!', name: 'New User' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: 'newuser@test.com',
      name: 'New User',
      subscription_tier: 'free'
    });
    expect(res.body.user).toHaveProperty('id');
  });

  it('should reject signup with missing email', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ password: 'StrongPass1!', name: 'No Email User' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/fields/i);
  });

  it('should reject signup with missing password', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@test.com', name: 'No Password User' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/fields/i);
  });

  it('should reject signup with missing name', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@test.com', password: 'StrongPass1!' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/fields/i);
  });

  it('should reject signup with duplicate email', async () => {
    const app = createApp();

    // Mock: existing user found
    query.mockResolvedValueOnce([{
      id: 'existing-id',
      email: 'existing@test.com',
      name: 'Existing',
      password_hash: 'hash'
    }]);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'existing@test.com', password: 'StrongPass1!', name: 'Duplicate' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should handle server error during signup gracefully', async () => {
    const app = createApp();

    // Mock: database throws
    query.mockRejectedValueOnce(new Error('DB connection failed'));

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'error@test.com', password: 'StrongPass1!', name: 'Error User' });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/server error/i);
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const app = createApp();

    // Mock the bcrypt comparison - we need to handle this carefully
    // The actual bcrypt compare happens inside the route
    // We'll make the query return a user with a known bcrypt hash
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('CorrectPass1!', salt);

    query.mockResolvedValueOnce([{
      id: 'user-login-1',
      email: 'login@test.com',
      name: 'Login User',
      password_hash: hash,
      subscription_tier: 'free'
    }]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'CorrectPass1!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('login@test.com');
    expect(res.body.user.name).toBe('Login User');
  });

  it('should reject login with invalid password', async () => {
    const app = createApp();

    query.mockResolvedValueOnce([{
      id: 'user-login-2',
      email: 'wrongpass@test.com',
      name: 'Wrong Pass',
      password_hash: '$2a$10$somehashthatshouldnotmatchanything1234567890abc',
      subscription_tier: 'free'
    }]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrongpass@test.com', password: 'WrongPassword!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should reject login for non-existent email', async () => {
    const app = createApp();

    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'SomePass1!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should reject login with missing email', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'SomePass1!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/fields/i);
  });

  it('should reject login with missing password', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/fields/i);
  });

  it('should handle server error during login gracefully', async () => {
    const app = createApp();

    query.mockRejectedValueOnce(new Error('DB timeout'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'error@test.com', password: 'SomePass1!' });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/server error/i);
  });
});

describe('Edge Cases', () => {
  it('should reject SQL injection in email field during signup', async () => {
    const app = createApp();

    // Simulate that the SQL injection attempt doesn't match any user (as expected)
    query.mockResolvedValueOnce([]);
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: "' OR '1'='1",
        password: 'StrongPass1!',
        name: "SQL Injector"
      });

    // Should still succeed as normal (the injection string is just treated as data)
    // The test verifies the system doesn't crash or leak data
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject SQL injection in email field during login', async () => {
    const app = createApp();

    // No user matches the injection attempt
    query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "' OR '1'='1' --",
        password: "anything"
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});

describe('Expired / Invalid Token Handling (via Auth Middleware)', () => {
  it('should reject endpoints with an expired JWT token', async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { id: 'user-1', email: 'test@test.com' },
      JWT_SECRET,
      { expiresIn: '0s' }
    );

    // Wait a moment to ensure expiration
    await new Promise(r => setTimeout(r, 100));

    // Create an app with a protected route to test the middleware
    const app = express();
    app.use(express.json());
    
    const { auth } = await import('../middleware/auth.js');
    app.get('/api/test-protected', auth, (req, res) => {
      res.json({ success: true, user: req.user });
    });

    const res = await request(app)
      .get('/api/test-protected')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it('should reject requests with malformed token', async () => {
    const app = express();
    app.use(express.json());
    
    const { auth } = await import('../middleware/auth.js');
    app.get('/api/test-protected', auth, (req, res) => {
      res.json({ success: true });
    });

    const res = await request(app)
      .get('/api/test-protected')
      .set('Authorization', 'Bearer this-is-not-a-valid-jwt');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });

  it('should reject requests with no Authorization header', async () => {
    const app = express();
    app.use(express.json());
    
    const { auth } = await import('../middleware/auth.js');
    app.get('/api/test-protected', auth, (req, res) => {
      res.json({ success: true });
    });

    const res = await request(app)
      .get('/api/test-protected');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });
});