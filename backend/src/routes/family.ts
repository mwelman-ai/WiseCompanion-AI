import { Router } from 'express';
import OpenAI from 'openai';
import { dbService } from '../services/dbService.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/family/contacts — Get emergency contacts for logged-in user
router.get('/contacts', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const contacts = await dbService.getEmergencyContacts(userId);
    return res.json({ contacts });
  } catch (error) {
    console.error('[familyRouter] Get Contacts Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve emergency contacts' });
  }
});

// POST /api/family/contacts — Add a new emergency contact
router.post('/contacts', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, relationship, phone } = req.body;
  if (!name || !relationship || !phone) {
    return res.status(400).json({ error: 'Name, relationship, and phone number are required' });
  }

  try {
    const userId = req.user!.id;
    const newContact = await dbService.saveEmergencyContact({
      id: 'contact-' + Math.random().toString(36).substr(2, 9),
      userId,
      name,
      relationship,
      phone,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json(newContact);
  } catch (error) {
    console.error('[familyRouter] Save Contact Error:', error);
    return res.status(500).json({ error: 'Failed to add emergency contact' });
  }
});

// PUT /api/family/contacts/:id — Update an emergency contact
router.put('/contacts/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const contactId = req.params.id as string;
  const { name, relationship, phone } = req.body;

  try {
    const userId = req.user!.id;
    const updated = await dbService.updateEmergencyContact(contactId, userId, {
      ...(name && { name }),
      ...(relationship && { relationship }),
      ...(phone && { phone })
    });

    if (!updated) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('[familyRouter] Update Contact Error:', error);
    return res.status(500).json({ error: 'Failed to update emergency contact' });
  }
});

// DELETE /api/family/contacts/:id — Delete an emergency contact
router.delete('/contacts/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const contactId = req.params.id as string;

  try {
    const userId = req.user!.id;
    const success = await dbService.deleteEmergencyContact(contactId, userId);
    if (!success) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }
    return res.json({ success: true, message: 'Emergency contact successfully removed' });
  } catch (error) {
    console.error('[familyRouter] Delete Contact Error:', error);
    return res.status(500).json({ error: 'Failed to delete emergency contact' });
  }
});

// POST /api/family/message — Draft a warm message using AI helper
router.post('/message', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { recipientName, relationship, purpose, customDetail } = req.body;

  if (!recipientName || !purpose) {
    return res.status(400).json({ error: 'Recipient name and purpose of the message are required' });
  }

  const relationStr = relationship ? ` (${relationship})` : '';
  const detailStr = customDetail ? ` and include this detail: "${customDetail}"` : '';

  const hasApiKey = process.env.OPENAI_API_KEY && 
                   process.env.OPENAI_API_KEY !== 'your_openai_api_key' && 
                   process.env.OPENAI_API_KEY.trim() !== '';

  const fallbackDraft = `Dear ${recipientName},\n\nI was just thinking about you today and wanted to send a quick note to say hello! I hope you are doing wonderfully. ${customDetail || "Let's catch up on the phone sometime soon."}\n\nWith all my love,\n${req.user!.fullName}`;

  if (hasApiKey) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a warm, loving, and supportive communication assistant for seniors. Draft a single, heartfelt, and easy-to-read text or email message that the senior can send to their loved one. Keep paragraphs short (1-2 sentences) and make it sound extremely natural, affectionate, and personal.`
          },
          {
            role: 'user',
            content: `Draft a message to my ${relationship || 'friend/family member'} named ${recipientName}. The purpose of the message is: ${purpose}${detailStr}. My name is ${req.user!.fullName}.`
          }
        ]
      });

      const draft = response.choices[0]?.message?.content || fallbackDraft;
      return res.json({ draft });
    } catch (err) {
      console.error('[familyRouter] AI message draft failed, falling back:', err);
      return res.json({ draft: fallbackDraft });
    }
  }

  return res.json({ draft: fallbackDraft });
});

// POST /api/family/card — Generate a birthday card via AI
router.post('/card', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { recipientName, relationship, interests, age } = req.body;

  if (!recipientName) {
    return res.status(400).json({ error: 'Recipient name is required' });
  }

  const ageStr = age ? ` celebrating their ${age}th birthday` : '';
  const interestsStr = interests ? ` who loves ${interests}` : '';
  const relationStr = relationship ? `my beloved ${relationship}` : 'someone special';

  const hasApiKey = process.env.OPENAI_API_KEY && 
                   process.env.OPENAI_API_KEY !== 'your_openai_api_key' && 
                   process.env.OPENAI_API_KEY.trim() !== '';

  const fallbackCard = `Dearest ${recipientName},\n\nHappy Birthday! ${age ? `Celebrating ${age} wonderful years of you is such a joy.` : ""} You bring so much light and warmth into all of our lives. ${interests ? `I hope today you get to enjoy some of your favorite things, like ${interests}!` : "I hope your day is filled with sweet moments and laughter."}\n\nThank you for being such a wonderful part of my life. May this coming year bring you abundant health, happiness, and peace.\n\nWith all my love and blessings,\n${req.user!.fullName}`;

  if (hasApiKey) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a warm, wise, and nostalgic card writer. Draft a heartfelt, beautifully worded birthday card from a senior to their loved one. Use warm, touching language, expressing deep gratitude and blessing. Keep it clean, highly legible, and deeply reassuring.`
          },
          {
            role: 'user',
            content: `Please write a birthday card for ${recipientName}, who is ${relationStr}${ageStr}${interestsStr}. Sign it from me: ${req.user!.fullName}.`
          }
        ]
      });

      const card = response.choices[0]?.message?.content || fallbackCard;
      return res.json({ card });
    } catch (err) {
      console.error('[familyRouter] AI card generation failed, falling back:', err);
      return res.json({ card: fallbackCard });
    }
  }

  return res.json({ card: fallbackCard });
});

export default router;
