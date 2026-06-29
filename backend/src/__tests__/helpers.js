/**
 * Test helpers for SparkStream backend tests.
 * Provides mock implementations of the database query function.
 */
import { vi } from 'vitest';

// Mock users database (in-memory)
export const mockUsers = new Map();
export const mockIdeas = new Map();
export const mockUsageLog = new Map();

// Default mock user
export const DEFAULT_USER_ID = 'user-test-123';
export const DEFAULT_USER = {
  id: DEFAULT_USER_ID,
  email: 'test@example.com',
  name: 'Test User',
  password_hash: '$2a$10$dummy_hash_for_testing_purposes_abcdef123456',
  subscription_tier: 'free',
  stripe_customer_id: null,
  created_at: '2025-01-01 00:00:00'
};

// Default pro user
export const PRO_USER_ID = 'user-pro-456';
export const PRO_USER = {
  id: PRO_USER_ID,
  email: 'pro@example.com',
  name: 'Pro User',
  password_hash: '$2a$10$dummy_hash_for_testing_purposes_abcdef123456',
  subscription_tier: 'pro',
  stripe_customer_id: 'cus_pro_123',
  created_at: '2025-01-01 00:00:00'
};

// Reset all mock data
export function resetMockDb() {
  mockUsers.clear();
  mockIdeas.clear();
  mockUsageLog.clear();
  // Add default users
  const userClone = { ...DEFAULT_USER };
  mockUsers.set(DEFAULT_USER_ID, userClone);
  const proClone = { ...PRO_USER };
  mockUsers.set(PRO_USER_ID, proClone);
}

// Mock implementation of query() that works with the in-memory DB
export function createMockQuery() {
  return vi.fn(async (sql) => {
    // SELECT queries
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return handleSelect(sql);
    }
    // INSERT queries
    if (sql.trim().toUpperCase().startsWith('INSERT')) {
      return handleInsert(sql);
    }
    // UPDATE queries
    if (sql.trim().toUpperCase().startsWith('UPDATE')) {
      return handleUpdate(sql);
    }
    return [];
  });
}

function handleSelect(sql) {
  // Parse table name from SELECT query
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (!fromMatch) return [];

  const table = fromMatch[1].toLowerCase();
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER BY|LIMIT|$)/i);
  const orderByMatch = sql.match(/ORDER BY\s+(\w+)\s+(DESC|ASC)/i);

  let results = [];

  if (table === 'users') {
    results = Array.from(mockUsers.values());
  } else if (table === 'ideas') {
    results = Array.from(mockIdeas.values());
  } else if (table === 'usage_log') {
    results = Array.from(mockUsageLog.values());
  }

  // Apply WHERE filtering (simple key=value parsing)
  if (whereMatch) {
    const conditions = whereMatch[1].trim();
    const pairs = conditions.split(/\s+AND\s+/i);
    for (const pair of pairs) {
      const eqMatch = pair.match(/(\w+)\s*=\s*'([^']*)'/);
      if (eqMatch) {
        const key = eqMatch[1];
        const value = eqMatch[2];
        results = results.filter(row => row[key] !== undefined && String(row[key]) === value);
      }
    }
  }

  // Apply ORDER BY
  if (orderByMatch) {
    const field = orderByMatch[1];
    const direction = orderByMatch[2].toUpperCase();
    results.sort((a, b) => {
      if (direction === 'DESC') {
        return String(b[field] || '').localeCompare(String(a[field] || ''));
      }
      return String(a[field] || '').localeCompare(String(b[field] || ''));
    });
  }

  return results;
}

function handleInsert(sql) {
  const intoMatch = sql.match(/INTO\s+(\w+)/i);
  if (!intoMatch) return [];

  const table = intoMatch[1].toLowerCase();

  // Extract column names and values
  const colsMatch = sql.match(/\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (!colsMatch) return [];

  const columns = colsMatch[1].split(',').map(c => c.trim());
  const values = colsMatch[2].split(',').map(v => v.trim().replace(/^'|'$/g, ''));

  const record = {};
  columns.forEach((col, i) => {
    record[col] = values[i] || null;
  });

  if (table === 'users') {
    const id = record.id;
    if (id) mockUsers.set(id, record);
  } else if (table === 'ideas') {
    const id = record.id;
    if (id) mockIdeas.set(id, record);
  } else if (table === 'usage_log') {
    const id = record.id;
    if (id) mockUsageLog.set(id, record);
  }

  return [];
}

function handleUpdate(sql) {
  const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (!tableMatch) return [];

  const table = tableMatch[1].toLowerCase();
  const setMatch = sql.match(/SET\s+(.+?)(?:WHERE|$)/i);
  const whereMatch = sql.match(/WHERE\s+(.+)/i);

  if (!setMatch) return [];

  // Parse SET pairs
  const setPairs = setMatch[1].split(',').map(p => p.trim());
  const updates = {};
  for (const pair of setPairs) {
    const eqMatch = pair.match(/(\w+)\s*=\s*'([^']*)'/);
    if (eqMatch) {
      updates[eqMatch[1]] = eqMatch[2];
    }
  }

  // Find records to update
  let targetMap;
  if (table === 'users') targetMap = mockUsers;
  else if (table === 'ideas') targetMap = mockIdeas;
  else if (table === 'usage_log') targetMap = mockUsageLog;
  else return [];

  let targets = Array.from(targetMap.values());

  // Apply WHERE
  if (whereMatch) {
    const condition = whereMatch[1].trim();
    const eqMatch = condition.match(/(\w+)\s*=\s*'([^']*)'/);
    if (eqMatch) {
      const key = eqMatch[1];
      const value = eqMatch[2];
      targets = targets.filter(row => row[key] !== undefined && String(row[key]) === value);
    }
  }

  // Apply updates
  for (const record of targets) {
    Object.assign(record, updates);
  }

  return [];
}