import { Router } from 'express';
import OpenAI from 'openai';
import { dbService, isMockMode } from '../services/dbService.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
// Helper to determine scam risk using rule-based scoring (for fallback/mock mode)
const analyzeScamRuleBased = (text) => {
    const p = text.toLowerCase();
    let score = 0;
    const reasons = [];
    const actions = [];
    // Rules scoring
    if (p.includes('click') || p.includes('link') || p.includes('http') || p.includes('url')) {
        score += 30;
        reasons.push('Contains a web link asking you to click it.');
        actions.push('Do NOT tap or click on any links in this message.');
    }
    if (p.includes('urgent') || p.includes('immediate') || p.includes('suspend') || p.includes('block') || p.includes('security alert')) {
        score += 30;
        reasons.push('Uses urgent or threatening language to make you act quickly.');
        actions.push('Take a deep breath. Scammers use urgency to prevent you from thinking clearly.');
    }
    if (p.includes('bank') || p.includes('irs') || p.includes('social security') || p.includes('amazon') || p.includes('netflix') || p.includes('paypal')) {
        score += 15;
        reasons.push('Claims to be from a well-known organization or government agency.');
        actions.push('Never trust the sender name alone. Verify by calling the official publicly listed phone number.');
    }
    if (p.includes('won') || p.includes('winner') || p.includes('prize') || p.includes('lottery') || p.includes('cash') || p.includes('gift card')) {
        score += 25;
        reasons.push('Promises unexpected free money, gifts, or lottery wins.');
        actions.push('Remember: if it sounds too good to be true, it almost certainly is!');
    }
    if (p.includes('password') || p.includes('pin') || p.includes('social security number') || p.includes('ssn') || p.includes('verify your identity')) {
        score += 25;
        reasons.push('Requests sensitive personal credentials or banking details.');
        actions.push('No legitimate bank or agency will ever ask for your password, PIN, or full SSN over text or email.');
    }
    // Cap score at 100
    const probability = Math.min(score, 100);
    let status = 'safe';
    if (probability >= 60) {
        status = 'dangerous';
    }
    else if (probability >= 20) {
        status = 'caution';
    }
    if (status === 'safe') {
        reasons.push('No typical scam indicators or red flags were detected.');
        actions.push('While this looks safe, always exercise caution when sharing personal details online.');
    }
    else {
        actions.push('Show this message to a trusted family member or helper to get a second opinion.');
    }
    return { status, probability, reasons, actions };
};
// POST /api/scam-check
router.post('/', requireAuth, async (req, res) => {
    const { text, textContent, url } = req.body;
    const contentToAnalyze = text || textContent || url;
    if (!contentToAnalyze || typeof contentToAnalyze !== 'string' || contentToAnalyze.trim() === '') {
        return res.status(400).json({ error: 'Text or URL content is required for scam analysis' });
    }
    const userId = req.user.id;
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
            }
            catch (err) {
                console.error('[scamRouter] OpenAI analysis failed, falling back to rule-based engine:', err);
                result = analyzeScamRuleBased(contentToAnalyze);
            }
        }
        else {
            result = analyzeScamRuleBased(contentToAnalyze);
        }
        // Save check record to history
        await dbService.saveScamCheck({
            id: 'scam-' + Math.random().toString(36).substr(2, 9),
            userId,
            textContent: contentToAnalyze,
            status: result.status,
            probability: result.probability,
            reasons: result.reasons,
            actions: result.actions,
            createdAt: new Date().toISOString()
        });
        return res.json(result);
    }
    catch (error) {
        console.error('[scamRouter] General Error:', error);
        return res.status(500).json({ error: 'Failed to complete scam threat analysis' });
    }
});
export default router;
//# sourceMappingURL=scam.js.map