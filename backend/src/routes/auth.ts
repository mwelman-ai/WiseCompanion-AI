import { Router } from 'express';
import { dbService, isMockMode } from '../services/dbService.js';
import { supabase } from '../config/supabase.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const name = fullName || 'Senior Companion';

  if (isMockMode) {
    try {
      // Mock signup: Hash email to generate deterministic mock ID
      const userId = 'mock-' + Buffer.from(email).toString('hex').slice(0, 10);
      const existing = await dbService.getUserProfile(userId);
      if (existing) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const profile = await dbService.createUserProfile({
        id: userId,
        email,
        fullName: name,
        planTier: 'free',
        createdAt: new Date().toISOString()
      });

      // Generate base64 mock token
      const token = Buffer.from(JSON.stringify({ id: userId, email, fullName: name, planTier: 'free' })).toString('base64');
      return res.status(201).json({
        token,
        user: profile
      });
    } catch (err) {
      return res.status(500).json({ error: 'Mock registration failed' });
    }
  } else {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error || !data.user) {
        return res.status(400).json({ error: error?.message || 'Registration failed' });
      }

      const profile = await dbService.createUserProfile({
        id: data.user.id,
        email,
        fullName: name,
        planTier: 'free',
        createdAt: new Date().toISOString()
      });

      return res.status(201).json({
        token: data.session?.access_token || '',
        user: profile
      });
    } catch (err) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (isMockMode) {
    try {
      // Mock login: use simple deterministic ID
      const userId = 'mock-' + Buffer.from(email).toString('hex').slice(0, 10);
      let profile = await dbService.getUserProfile(userId);

      if (!profile) {
        // Auto-create in mock mode for ease of use
        profile = await dbService.createUserProfile({
          id: userId,
          email,
          fullName: email.split('@')[0],
          planTier: 'free',
          createdAt: new Date().toISOString()
        });
      }

      // Generate token
      const token = Buffer.from(JSON.stringify(profile)).toString('base64');
      return res.json({
        token,
        user: profile
      });
    } catch (err) {
      return res.status(500).json({ error: 'Mock login failed' });
    }
  } else {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user || !data.session) {
        return res.status(400).json({ error: error?.message || 'Invalid email or password' });
      }

      let profile = await dbService.getUserProfile(data.user.id);
      if (!profile) {
        profile = await dbService.createUserProfile({
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          planTier: 'free',
          createdAt: new Date().toISOString()
        });
      }

      return res.json({
        token: data.session.access_token,
        user: profile
      });
    } catch (err) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json({ user: req.user });
});

export default router;
