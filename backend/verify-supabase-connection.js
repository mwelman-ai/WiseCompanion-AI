import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=====================================================');
console.log('WiseCompanion Supabase Connection & Schema Verifier');
console.log('=====================================================');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env');
  process.exit(1);
}

console.log(`Supabase URL: ${supabaseUrl}`);
console.log('Connecting to Supabase...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function runVerification() {
  // 1. Verify general connection by querying the live tables in the project
  console.log('\n--- Step 1: Testing Connection via Live Tables ---');
  const liveTables = ['daily_usage', 'email_subscribers', 'feedback', 'messages', 'progress', 'subscriptions'];
  
  for (const table of liveTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table '${table}' query failed: ${error.message}`);
      } else {
        console.log(`✅ Connection OK. Table '${table}' exists and is accessible. Rows found: ${data ? data.length : 0}`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' connection error:`, err);
    }
  }

  // 2. Check if the tables expected by the backend dbService.ts exist
  console.log('\n--- Step 2: Checking for Codebase-Expected Tables ---');
  const codebaseExpected = [
    'profiles',
    'chat_history',
    'scam_checks',
    'health_logs',
    'medications',
    'travel_plans',
    'emergency_contacts'
  ];

  for (const table of codebaseExpected) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === 'PGRST205') {
          console.log(`❌ Table '${table}' does NOT exist in the Supabase database (PGRST205).`);
        } else {
          console.log(`⚠️ Table '${table}' returned error: ${error.message} (${error.code})`);
        }
      } else {
        console.log(`✅ Table '${table}' exists in the database!`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' error:`, err);
    }
  }

  // 3. Check if the tables defined in src/db/schema.sql exist
  console.log('\n--- Step 3: Checking for Schema-Defined Tables ---');
  const schemaDefined = [
    'users',
    'conversations',
    'scam_checks',
    'health_logs',
    'medications',
    'travel_plans',
    'family_contacts',
    'usage_logs'
  ];

  for (const table of schemaDefined) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === 'PGRST205') {
          console.log(`❌ Table '${table}' does NOT exist in the Supabase database.`);
        } else {
          console.log(`⚠️ Table '${table}' returned error: ${error.message} (${error.code})`);
        }
      } else {
        console.log(`✅ Table '${table}' exists in the database!`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' error:`, err);
    }
  }

  console.log('\n=====================================================');
  console.log('Verification Complete.');
  console.log('=====================================================');
}

runVerification();
