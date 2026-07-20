import { Router } from 'express';
import { dbService } from '../services/dbService.js';
import { generateResponse } from '../services/openaiService.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { analyticsService } from '../services/analyticsService.js';

const router = Router();

// GET /api/chat/history — Fetch chat history for logged-in user
router.get('/history', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const history = await dbService.getChatHistory(userId);
    return res.json({ history });
  } catch (error) {
    console.error('[chatRouter] History Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve conversation history' });
  }
});

// POST /api/chat — Send message to OpenAI, get response with Free tier rate limiting
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Message prompt is required' });
  }

  try {
    const user = req.user!;
    
    // Enforce 10-message daily rate limit on Free Tier
    if (user.planTier === 'free') {
      const history = await dbService.getChatHistory(user.id);
      const today = new Date().toISOString().split('T')[0] as string;
      
      const todayUserMessages = history.filter(msg => 
        msg.role === 'user' && 
        (msg.createdAt as string).startsWith(today)
      );

      if (todayUserMessages.length >= 10) {
        return res.status(403).json({
          error: 'Daily rate limit reached',
          message: 'You have used your 10 free messages for today. Upgrade to Premium for unlimited warm, supportive companion chats!'
        });
      }
    }

    // Save user's message to database/in-memory store
    const userMessage = await dbService.saveChatMessage({
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString()
    });

    // Generate response using OpenAI (falls back to local senior-friendly response if OpenAI key is invalid/not set)
    const replyContent = await generateResponse(prompt);

    // Save assistant's response to database/in-memory store
    const assistantMessage = await dbService.saveChatMessage({
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      role: 'assistant',
      content: replyContent,
      createdAt: new Date().toISOString()
    });

    // Track chat feature usage
    await analyticsService.trackFeatureUsage(user.id, 'chat_message', {
      plan_tier: user.planTier,
      prompt_length: prompt.length,
      response_length: replyContent.length
    });

    return res.json({
      message: replyContent,
      userMessage,
      assistantMessage
    });

  } catch (error) {
    console.error('[chatRouter] Error:', error);
    return res.status(500).json({ error: 'Failed to process chat conversation' });
  }
});

export default router;
