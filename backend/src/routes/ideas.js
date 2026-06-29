import express from 'express';
import { auth } from '../middleware/auth.js';
import { requireTier } from '../middleware/subscription.js';
import { query } from '../db/schema.js';
import { generateIdeas } from '../services/aiService.js';
import { checkIdeaLimit, incrementUsage } from '../middleware/rateLimit.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/generate', auth, checkIdeaLimit, async (req, res) => {
  const { niche, platform, count = 3, full_script = false } = req.body;
  const userId = req.user.id;
  const { currentMonth, usageRecord, tier } = req.usageInfo;

  if (!niche || !platform) {
    return res.status(400).json({ message: 'Niche and platform are required' });
  }

  // Premium features check
  const isPremium = tier === 'premium';
  const shouldGenerateScript = full_script && isPremium;
  const shouldIncludeSEO = isPremium;

  try {
    // 1. Generate ideas via AI
    const rawIdeas = await generateIdeas(niche, platform, count, {
      full_script: shouldGenerateScript,
      include_seo: shouldIncludeSEO
    });
    const ideasArray = Array.isArray(rawIdeas) ? rawIdeas : (rawIdeas.ideas || []);

    // 2. Store ideas in DB
    const storedIdeas = [];
    for (const idea of ideasArray) {
      const ideaId = crypto.randomUUID();
      
      // We store the full script in the 'script' column if generated
      const scriptContent = idea.full_script || idea.description;
      
      // Store SEO data as a JSON string in a new column or just include in description for now
      // Actually, looking at schema, we only have 'script'. 
      // We might need to update schema or just combine it.
      // For this task, I'll store script in 'script'.
      
      await query(`INSERT INTO ideas (id, user_id, niche, platform, title, hook, script, status) 
        VALUES ('${ideaId}', '${userId}', '${niche}', '${platform}', '${idea.title.replace(/'/g, "''")}', '${idea.hook.replace(/'/g, "''")}', '${scriptContent.replace(/'/g, "''")}', 'generated')`);
      
      storedIdeas.push({
        id: ideaId,
        ...idea
      });
    }

    // 3. Increment usage
    await incrementUsage(userId, currentMonth, usageRecord, ideasArray.length);

    res.json({ ideas: storedIdeas });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ message: 'Failed to generate ideas' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const ideas = await query(`SELECT * FROM ideas WHERE user_id = '${userId}' ORDER BY created_at DESC`);
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ideas' });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!['generated', 'saved', 'posted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const idea = await query(`SELECT * FROM ideas WHERE id = '${id}' AND user_id = '${userId}'`);
    if (idea.length === 0) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    await query(`UPDATE ideas SET status = '${status}' WHERE id = '${id}'`);
    res.json({ message: 'Status updated successfully', id, status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

export default router;
