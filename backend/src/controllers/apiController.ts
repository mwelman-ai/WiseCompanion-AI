import type { Request, Response } from 'express';
import { generateResponse } from '../services/openaiService.js';

export const handleChat = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const message = await generateResponse(prompt);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
};
