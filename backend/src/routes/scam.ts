import { Router, type Request, type Response } from 'express';
import OpenAI from 'openai';
import { dbService, isMockMode } from '../services/dbService.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { analyticsService } from '../services/analyticsService.js';

const router = Router();

// Helper to determine scam risk using rule-based scoring (for fallback/mock mode)
const analyzeScamRuleBased = (text: string) => {
  const p = text.toLowerCase();
  let score = 0;
  const reasons: string[] = [];
  const actions: string[] = [];

  // 1. Keyword matching (same logic as frontend)
  const scamKeywords = [
    'urgent', 'verify', 'account suspended', 'click here', 'gift card',
    'wire transfer', 'western union', 'money gram', 'ssn', 'social security',
    'irs', 'lottery', 'you won', 'free prize', 'inheritance', 'prince',
    'nigerian', 'password reset', 'confirm your', 'bank account', 'credit card',
    'paypal', 'bitcoin', 'crypto', 'investment opportunity', 'guaranteed return',
    'act now', 'limited time', 'exclusive offer', 'dear customer', 'suspicious activity'
  ];
  const foundKeywords = scamKeywords.filter(k => p.includes(k));
  if (foundKeywords.length > 0) {
    score += Math.min(35, foundKeywords.length * 10);
    reasons.push(`Contains potential scam-related keywords: ${foundKeywords.slice(0, 3).join(', ')}.`);
  }

  // 2. URL Checking
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const urls = p.match(urlPattern) || [];
  const hasSuspiciousUrl = urls.some(u => {
    const suspicious = ['.xyz', '.top', '.club', '.online', '.site', 'bit.ly', 'tinyurl', 'goo.gl'];
    return suspicious.some(s => u.includes(s));
  });
  if (urls.length > 0) {
    score += 15;
    if (hasSuspiciousUrl) {
      score += 15;
      reasons.push('Contains suspicious or shortened web links.');
    } else {
      reasons.push('Contains web links asking you to click them.');
    }
    actions.push('Do NOT click or tap on any links in this message.');
  }

  // 3. Urgency Detection
  const hasUrgency = /\b(urgent|immediately|asap|now|today only|expires|suspend|block|restricted)\b/i.test(p);
  if (hasUrgency) {
    score += 20;
    reasons.push('Uses urgent or threatening language to pressure you into acting.');
    actions.push('Take a deep breath. Scammers use urgency to prevent you from thinking clearly.');
  }

  // 4. Grammar patterns / requests personal details
  const requestsPersonal = /\b(password|ssn|social security|credit card|bank account|pin|atm|credentials)\b/i.test(p);
  if (requestsPersonal) {
    score += 25;
    reasons.push('Asks for highly sensitive personal credentials or identity details.');
    actions.push('No legitimate bank or government agency will ever ask for credentials, PIN, or SSN over text.');
  }

  // 5. Family impersonation / grandparent scam detection
  const familyMemberKeywords = ['grandson', 'granddaughter', 'grandchild', 'grandma', 'grandpa', 'grandmother', 'grandfather', 'nephew', 'niece', 'aunt', 'uncle', 'mom', 'dad', 'son', 'daughter'];
  const emergencyContext = /\b(jail|arrest|bail|police|court|lawyer|accident|hospital|emergency|overseas|stranded|stuck)\b/i.test(p);
  const moneyRequest = /\b(send money|wire|transfer|cash|gift card|western union|money gram|bail|pay|need.*money|help.*money)\b/i.test(p);
  const hasFamilyRef = familyMemberKeywords.some(k => p.includes(k));
  if (hasFamilyRef && (emergencyContext || moneyRequest)) {
    score += 65;
    reasons.push('Family impersonation scam detected — someone is pretending to be a relative in distress.');
    reasons.push('Scammers often call or text claiming a loved one is in jail, in an accident, or stranded overseas and needs money urgently.');
    actions.push('Stop and call the relative directly using a phone number you already know and trust.');
    actions.push('Do NOT send money, gift cards, or wire transfers without verifying the person is safe.');
    actions.push('Tell a trusted family member or friend about this request before taking any action.');
  }

  // Cap score for standard checks
  const probability = Math.min(score, 100);
  
  let status: 'safe' | 'caution' | 'dangerous' = 'safe';
  if (probability >= 60) {
    status = 'dangerous';
  } else if (probability >= 25) {
    status = 'caution';
  }

  if (status === 'safe') {
    reasons.push('No typical scam indicators or red flags were detected.');
    actions.push('While this looks safe, always exercise caution when sharing personal details online.');
  } else {
    actions.push('Show this message to a trusted family member or helper to get a second opinion.');
  }

  return { status, probability, reasons, actions };
};

// Interface for /api/scam/detect output
interface DetectionResult {
  risk: 'safe' | 'caution' | 'danger';
  probability: number;
  reasons: string[];
  actions: string[];
}

// Map any raw result to the frontend-requested /detect JSON structure
function mapToDetectionResult(source: any): DetectionResult {
  const statusStr = (source.risk || source.status || 'safe').toLowerCase();
  let risk: 'safe' | 'caution' | 'danger' = 'safe';
  
  if (statusStr.includes('danger') || statusStr.includes('dangerous')) {
    risk = 'danger';
  } else if (statusStr.includes('caution') || statusStr.includes('warning') || statusStr.includes('suspect')) {
    risk = 'caution';
  }

  let probability = Number(source.probability);
  if (isNaN(probability)) {
    probability = risk === 'danger' ? 75 : risk === 'caution' ? 45 : 10;
  }
  // Cap between 0 and 99 as specified
  probability = Math.max(0, Math.min(99, probability));

  const reasons = Array.isArray(source.reasons) ? source.reasons : [];
  const actions = Array.isArray(source.actions) ? source.actions : [];

  if (reasons.length === 0) {
    reasons.push(risk === 'safe' ? 'No suspicious patterns detected' : 'Potential scam indicators identified');
  }
  if (actions.length === 0) {
    actions.push(risk === 'danger' ? 'Do not reply or click any links' : 'Exercise vigilance with unfamiliar messages');
  }

  return { risk, probability, reasons, actions };
}

// Unified post handler for both /api/scam-check and /api/scam/detect
const handleScamCheck = async (req: Request, res: Response) => {
  const { text, textContent, url } = req.body;
  const contentToAnalyze = text || textContent || url;

  if (!contentToAnalyze || typeof contentToAnalyze !== 'string' || contentToAnalyze.trim() === '') {
    return res.status(400).json({ error: 'Text content is required for scam analysis' });
  }

  // Determine which API path was called
  const isDetectPath = req.baseUrl.includes('detect') || req.originalUrl.includes('detect');

  // Authenticate optionally if header is available, or use mock fallback
  let userId = 'anonymous';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        if (isMockMode) {
          userId = token === 'premium-token' ? 'mock-user-premium' : 'mock-user-123';
        } else {
          const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
          if (decoded && decoded.id) userId = decoded.id;
        }
      } catch {
        // Fall back to anonymous on decoding failure
      }
    }
  }

  const hasApiKey = process.env.OPENAI_API_KEY && 
                   process.env.OPENAI_API_KEY !== 'your_openai_api_key' && 
                   process.env.OPENAI_API_KEY.trim() !== '';

  try {
    let result;

    if (hasApiKey) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert cybersecurity advisor specializing in protecting seniors. Analyze the text, email, message, or URL provided for potential scams or phishing indicators. 
              You MUST respond with a valid JSON object ONLY, adhering exactly to this structure:
              {
                "status": "safe" | "caution" | "dangerous",
                "probability": number (estimated percentage from 0 to 100),
                "reasons": string[] (senior-friendly, warm, simple explanations of red flags found, maximum 3),
                "actions": string[] (clear, actionable, reassuring steps the user should take, maximum 4)
              }`
            },
            {
              role: 'user',
              content: contentToAnalyze
            }
          ]
        });

        const rawJson = response.choices[0]?.message?.content || '';
        result = JSON.parse(rawJson);
      } catch (err) {
        console.error('[scamRouter] OpenAI analysis failed, falling back to rule-based engine:', err);
        result = analyzeScamRuleBased(contentToAnalyze);
      }
    } else {
      result = analyzeScamRuleBased(contentToAnalyze);
    }

    // Save record to DB
    const statusVal = result.status || (result.risk === 'danger' ? 'dangerous' : result.risk === 'caution' ? 'caution' : 'safe');
    const probVal = Math.min(100, result.probability || 0);

    await dbService.saveScamCheck({
      id: 'scam-' + Math.random().toString(36).substr(2, 9),
      userId,
      textContent: contentToAnalyze,
      status: statusVal as 'safe' | 'caution' | 'dangerous',
      probability: probVal,
      reasons: result.reasons || [],
      actions: result.actions || [],
      createdAt: new Date().toISOString()
    });

    // Track feature usage
    await analyticsService.trackFeatureUsage(userId, 'scam_check', {
      status: statusVal,
      probability: probVal,
      content_length: contentToAnalyze.length,
      used_openai: hasApiKey
    });

    // Send correct response depending on route path
    if (isDetectPath) {
      const detectionResult = mapToDetectionResult(result);
      return res.json(detectionResult);
    } else {
      return res.json(result);
    }

  } catch (error) {
    console.error('[scamRouter] General Error:', error);
    return res.status(500).json({ error: 'Failed to complete scam threat analysis' });
  }
};

// Route definitions
router.post('/', handleScamCheck);

export default router;
