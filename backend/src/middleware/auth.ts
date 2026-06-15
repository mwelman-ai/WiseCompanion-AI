import type { Request, Response, NextFunction } from 'express';
import { dbService, isMockMode, type UserProfile } from '../services/dbService.js';
import { supabase } from '../config/supabase.js';

// Extend Express Request type to include the authenticated user
export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header with Bearer token is required' });
  }

  const token = authHeader.split(' ')[1] as string;

  if (isMockMode) {
    // Permissive development mock mode
    try {
      // 1. Try decoding base64 JSON payload
      if (token.length > 20 && !token.includes('-')) {
        try {
          const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
          if (decoded && decoded.id) {
            const profile = await dbService.getUserProfile(decoded.id);
            req.user = profile || {
              id: decoded.id,
              email: decoded.email || 'user@example.com',
              fullName: decoded.fullName || 'Jane Doe',
              planTier: decoded.planTier || 'free',
              createdAt: new Date().toISOString()
            };
            return next();
          }
        } catch (e) {
          // Fall through to other mock options
        }
      }

      // 2. Simple mock user fallback
      const mockUserId = token === 'premium-token' ? 'mock-user-premium' : 'mock-user-123';
      const existingProfile = await dbService.getUserProfile(mockUserId);
      
      if (existingProfile) {
        req.user = existingProfile;
      } else {
        req.user = {
          id: mockUserId,
          email: token === 'premium-token' ? 'premium@example.com' : 'user@example.com',
          fullName: token === 'premium-token' ? 'Premium User' : 'Jane Doe',
          planTier: token === 'premium-token' ? 'premium' : 'free',
          createdAt: new Date().toISOString()
        };
        await dbService.createUserProfile(req.user);
      }
      return next();
    } catch (error) {
      console.error('[authMiddleware] Mock Auth Error:', error);
      return res.status(401).json({ error: 'Mock authentication failed' });
    }
  } else {
    // Live Supabase Auth mode
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired session token' });
      }

      // Fetch additional profile fields (like planTier)
      let profile = await dbService.getUserProfile(user.id);
      if (!profile) {
        // Create profile on-the-fly if it doesn't exist
        profile = await dbService.createUserProfile({
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || 'Senior Companion',
          planTier: 'free',
          createdAt: new Date().toISOString()
        });
      }

      req.user = profile;
      next();
    } catch (error) {
      console.error('[authMiddleware] Live Auth Error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }
};

export const requirePremium = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.planTier !== 'premium') {
    return res.status(403).json({ 
      error: 'Premium subscription required', 
      message: 'This warm, advanced feature is reserved for our Premium companions. Please upgrade your plan to access.' 
    });
  }

  next();
};
