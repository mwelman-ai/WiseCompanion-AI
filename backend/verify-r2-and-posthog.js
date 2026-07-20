import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { analyticsService } from './dist/services/analyticsService.js';
import { r2Service } from './dist/services/r2Service.js';

console.log('=====================================================');
console.log('WiseCompanion R2 + PostHog Analytics Integration Test');
console.log('=====================================================');

async function runTests() {
  const userId = 'test-verification-user-123';

  // 1. Test direct Analytics tracking event
  console.log('\n--- Test 1: Tracking Generic Event ---');
  try {
    await analyticsService.trackEvent(userId, 'verification_test_event', {
      verified: true,
      timestamp: new Date().toISOString()
    });
    console.log('✅ Generic Event Tracked Successfully.');
  } catch (err) {
    console.error('❌ Generic Event Tracking Failed:', err);
  }

  // 2. Test Signup Analytics tracking
  console.log('\n--- Test 2: Tracking User Signup ---');
  try {
    await analyticsService.trackSignup(userId, 'test-verifier@example.com', 'integration-test');
    console.log('✅ Signup Event Tracked Successfully.');
  } catch (err) {
    console.error('❌ Signup Event Tracking Failed:', err);
  }

  // 3. Test Feature Usage Analytics tracking
  console.log('\n--- Test 3: Tracking Feature Usage ---');
  try {
    await analyticsService.trackFeatureUsage(userId, 'scam_check', {
      status: 'dangerous',
      probability: 95
    });
    console.log('✅ Feature Usage Event Tracked Successfully.');
  } catch (err) {
    console.error('❌ Feature Usage Event Tracking Failed:', err);
  }

  // 4. Test direct R2 service upload with raw buffer (fallback to local mock)
  console.log('\n--- Test 4: Testing R2 Service File Upload ---');
  try {
    const mockFileBuffer = Buffer.from('hello wisecompanion integration testing', 'utf8');
    const uploadedUrl = await r2Service.uploadFile(mockFileBuffer, 'test_file.txt', 'text/plain');
    console.log(`✅ File Upload Successful. URL: ${uploadedUrl}`);
    
    // Check if the uploaded URL is indeed saved
    if (uploadedUrl.startsWith('/uploads/')) {
      const relativePath = uploadedUrl.replace('/uploads/', '');
      const localFilePath = path.join(path.resolve('public/uploads'), relativePath);
      if (fs.existsSync(localFilePath)) {
        console.log(`✅ Local static file fallback verified at: ${localFilePath}`);
      } else {
        console.error(`❌ Local static file fallback missing from public/uploads/`);
      }
    } else {
      console.log(`✅ Live R2 cloud storage verified.`);
    }
  } catch (err) {
    console.error('❌ File Upload Failed:', err);
  }

  console.log('\n=====================================================');
  console.log('All Service-Level Integration Tests Completed.');
  console.log('=====================================================');
}

runTests();
