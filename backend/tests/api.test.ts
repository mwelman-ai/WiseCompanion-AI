import { test, describe } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

describe('WiseCompanion AI - Backend Integration Tests', () => {
  // Test 1: Recipe API under healthRouter
  test('GET /recipes/recipes - should retrieve senior-friendly recipes', async () => {
    const res = await axios.get(`${API_URL}/recipes/recipes`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.recipes);
    assert.ok(Array.isArray(res.data.recipes));
    assert.ok(res.data.recipes.length > 0);
    const firstRecipe = res.data.recipes[0];
    assert.ok(firstRecipe.title);
    assert.ok(firstRecipe.ingredients);
  });

  // Test 2: Scam Detector API (POST /api/scam-check)
  test('POST /scam-check - should flag likely scams correctly', async () => {
    const scamText = 'URGENT: Your bank account is suspended. Click tinyurl.com/123 to verify now!';
    const res = await axios.post(
      `${API_URL}/scam-check`, 
      { text: scamText },
      { headers: { 'Authorization': 'Bearer mock-user-123' } }
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'dangerous');
    assert.ok(res.data.probability > 50);
    assert.ok(res.data.reasons.length > 0);
  });

  // Test 3: Scam Detector API (POST /api/scam-check) - safe text
  test('POST /scam-check - should mark safe text correctly', async () => {
    const safeText = 'Hey Margaret, are we still meeting for lunch tomorrow at 12? Let me know!';
    const res = await axios.post(
      `${API_URL}/scam-check`, 
      { text: safeText },
      { headers: { 'Authorization': 'Bearer mock-user-123' } }
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'safe');
    assert.ok(res.data.probability < 30);
  });

  // Test 3b: Scam Detector API on frontend path (POST /api/scam/detect)
  test('POST /scam/detect - should support the frontend path and work identically', async () => {
    const scamText = 'URGENT: Your bank account is suspended. Click tinyurl.com/123 to verify now!';
    const res = await axios.post(
      `${API_URL}/scam/detect`, 
      { text: scamText },
      { headers: { 'Authorization': 'Bearer mock-user-123' } }
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'dangerous');
    assert.ok(res.data.probability > 50);
  });

  // Test 4: Chat API
  test('POST /chat - should return warm companion answers', async () => {
    const res = await axios.post(
      `${API_URL}/chat`, 
      { prompt: 'Hello, I feel a bit lonely today.' },
      { headers: { 'Authorization': 'Bearer mock-user-123' } }
    );
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.message);
    assert.ok(typeof res.data.message === 'string');
  });

  // Test 5: Health logging API
  test('POST /health/log and GET /health/logs', async () => {
    // 1. Post a health log
    const logRes = await axios.post(
      `${API_URL}/health/log`,
      { logType: 'walking', value: 6500 },
      { headers: { 'Authorization': 'Bearer mock-user-123' } }
    );
    assert.strictEqual(logRes.status, 201);
    assert.strictEqual(logRes.data.logType, 'walking');
    assert.strictEqual(logRes.data.value, 6500);

    // 2. Retrieve logs
    const retrieveRes = await axios.get(
      `${API_URL}/health/logs`,
      { headers: { 'Authorization': 'Bearer mock-user-123' } }
    );
    assert.strictEqual(retrieveRes.status, 200);
    assert.ok(Array.isArray(retrieveRes.data.logs));
    const hasOurLog = retrieveRes.data.logs.some((l: any) => l.value === 6500 && l.logType === 'walking');
    assert.ok(hasOurLog);
  });
});
