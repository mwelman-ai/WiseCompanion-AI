import { spawn } from 'child_process';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.production', override: true });

const TURSO_URL = process.env.TURSO_DATABASE_URL || process.env.TEAM_DB_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.TEAM_DB_AUTH_TOKEN;
const useLibsql = TURSO_URL && TURSO_TOKEN;

let client;
if (useLibsql) {
  client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN,
  });
}

export const query = async (sql) => {
  if (useLibsql) {
    try {
      const result = await client.execute(sql);
      // Transform libsql result to match team-db expected format (JSON array of objects)
      if (result.rows) {
        return result.rows.map(row => {
          const obj = {};
          result.columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
      }
      return result;
    } catch (error) {
      console.error('Libsql query error:', error);
      throw error;
    }
  }

  // Check if team-db is available
  const fs = await import('fs');
  try {
    fs.accessSync('/home/agent-lead/.local/bin/team-db');
  } catch {
    throw new Error('Database not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in environment variables.');
  }

  // Fallback to team-db for sandbox environment
  return new Promise((resolve, reject) => {
    const child = spawn('team-db', [sql]);
    child.on('error', (err) => {
      reject(new Error(`Failed to start team-db: ${err.message}`));
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => {
      stdout += data;
    });
    child.stderr.on('data', (data) => {
      stderr += data;
    });
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`team-db exited with code ${code}: ${stderr}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        resolve(stdout);
      }
    });
  });
};
