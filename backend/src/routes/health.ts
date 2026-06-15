import { Router } from 'express';
import OpenAI from 'openai';
import { dbService } from '../services/dbService.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Static high-quality senior-friendly healthy recipes for fallback
const STATIC_RECIPES = [
  {
    id: 'recipe-1',
    title: 'Baked Lemon Herb Salmon',
    benefits: 'Rich in Omega-3 fats for joint and brain health, and gentle on digestion.',
    prepTime: '20 minutes',
    ingredients: [
      '4 oz Salmon fillet',
      '1 tablespoon Olive oil',
      'Half a lemon, sliced',
      'Fresh dill or parsley',
      'Pinch of black pepper and low-sodium salt'
    ],
    instructions: [
      'Preheat your oven to 400°F (200°C).',
      'Place the salmon fillet on a sheet of baking paper or foil.',
      'Drizzle with olive oil, sprinkle with herbs, and place lemon slices on top.',
      'Bake for 12-15 minutes until the salmon flakes easily with a fork.',
      'Serve warm with a side of steamed broccoli or brown rice.'
    ]
  },
  {
    id: 'recipe-2',
    title: 'Hearty Lentil & Vegetable Soup',
    benefits: 'High in fiber for digestive health and packed with soft, easy-to-chew vegetables.',
    prepTime: '35 minutes',
    ingredients: [
      '1/2 cup Dry brown lentils (rinsed)',
      '1 Carrot, diced small',
      '1 Celery stalk, diced small',
      '1/2 Onion, chopped',
      '2 cups Low-sodium vegetable broth',
      '1 cup Spinach leaves',
      '1 tablespoon Olive oil'
    ],
    instructions: [
      'In a medium pot, heat the olive oil over medium heat.',
      'Add onion, carrot, and celery. Cook for 5 minutes until soft.',
      'Add the rinsed lentils and pour in the vegetable broth.',
      'Bring to a boil, then reduce heat to low, cover, and simmer for 25 minutes.',
      'Stir in the spinach leaves during the last 2 minutes until wilted.',
      'Allow to cool slightly before serving a warm, soothing bowl.'
    ]
  },
  {
    id: 'recipe-3',
    title: 'Warm Berry Oatmeal',
    benefits: 'Excellent for heart health, cholesterol control, and simple to prepare.',
    prepTime: '10 minutes',
    ingredients: [
      '1/2 cup Rolled oats',
      '1 cup Water or low-fat milk',
      '1/4 cup Fresh or frozen blueberries',
      '1 tablespoon Walnuts, chopped small',
      'A pinch of cinnamon'
    ],
    instructions: [
      'In a small saucepan, combine the rolled oats and water (or milk).',
      'Bring to a gentle boil, then turn the heat to low and stir.',
      'Cook for about 5 minutes until the oatmeal is soft and creamy.',
      'Pour into a bowl, and top with blueberries, chopped walnuts, and a sprinkle of cinnamon.',
      'Enjoy a comforting, fiber-rich breakfast!'
    ]
  }
];

// GET /api/recipes — Get healthy recipe suggestions
router.get('/recipes', async (req, res) => {
  const query = req.query.query as string;
  const hasApiKey = process.env.OPENAI_API_KEY && 
                   process.env.OPENAI_API_KEY !== 'your_openai_api_key' && 
                   process.env.OPENAI_API_KEY.trim() !== '';

  if (hasApiKey && query) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a professional geriatric dietitian and chef. Generate a single, warm, senior-friendly healthy recipe based on the user's health focus or dietary preference (e.g. low sodium, soft foods, high fiber). 
            Response MUST be a valid JSON object ONLY, in this format:
            {
              "id": "recipe-ai-generated",
              "title": "Clear Simple Recipe Name",
              "benefits": "Brief 1-sentence description of health benefits for older adults",
              "prepTime": "Estimated total time",
              "ingredients": ["Clean, simple ingredients list"],
              "instructions": ["Step-by-step simple instructions with no jargon"]
            }`
          },
          {
            role: 'user',
            content: `Please generate a healthy, delicious recipe for: ${query}`
          }
        ]
      });

      const rawJson = response.choices[0]?.message?.content || '';
      const aiRecipe = JSON.parse(rawJson);
      return res.json({ recipes: [aiRecipe, ...STATIC_RECIPES] });
    } catch (err) {
      console.error('[healthRouter] OpenAI recipe generation failed, falling back to static list:', err);
      return res.json({ recipes: STATIC_RECIPES });
    }
  }

  // Default to static healthy recipes
  return res.json({ recipes: STATIC_RECIPES });
});

// GET /api/health/logs — Retrieve health logs for logged-in user
router.get('/logs', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const logs = await dbService.getHealthLogs(userId);
    return res.json({ logs });
  } catch (error) {
    console.error('[healthRouter] Fetch Logs Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve health logs' });
  }
});

// POST /api/health/log — Log walking, water, or weight
router.post('/log', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { logType, log_type, value } = req.body;
  const finalLogType = logType || log_type;

  if (!finalLogType || value === undefined) {
    return res.status(400).json({ error: 'logType (walking, water, or weight) and numeric value are required' });
  }

  const validTypes = ['walking', 'water', 'weight'];
  if (!validTypes.includes(finalLogType)) {
    return res.status(400).json({ error: 'Invalid logType. Must be one of: walking, water, weight' });
  }

  const numericValue = Number(value);
  if (isNaN(numericValue) || numericValue <= 0) {
    return res.status(400).json({ error: 'Value must be a valid positive number' });
  }

  try {
    const userId = req.user!.id;
    const newLog = await dbService.saveHealthLog({
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      userId,
      logType: finalLogType as 'walking' | 'water' | 'weight',
      value: numericValue,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json(newLog);
  } catch (error) {
    console.error('[healthRouter] Save Log Error:', error);
    return res.status(500).json({ error: 'Failed to record health log' });
  }
});

export default router;
