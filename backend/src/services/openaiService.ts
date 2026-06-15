import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const hasApiKey = process.env.OPENAI_API_KEY && 
                 process.env.OPENAI_API_KEY !== 'your_openai_api_key' && 
                 process.env.OPENAI_API_KEY.trim() !== '';

const openai = hasApiKey ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Senior-friendly local fallback response generator
const getFallbackResponse = (prompt: string): string => {
  const p = prompt.toLowerCase();
  
  if (p.includes('hello') || p.includes('hi ') || p.includes('hey ') || p.includes('greeting')) {
    return "Hello! I am your WiseCompanion, here to help you. How is your day going? You can ask me about medication schedules, exercise ideas, travel planning, or how to spot internet scams!";
  }
  
  if (p.includes('scam') || p.includes('suspicious') || p.includes('text') || p.includes('won') || p.includes('money') || p.includes('urgent') || p.includes('bank') || p.includes('sms')) {
    return "This looks like it could be a scam! Remember these golden rules:\n\n1. Never click on links from numbers you don't know.\n2. Bank officials or government agencies will NEVER ask for your password, PIN, or urge you to wire money immediately.\n3. If it sounds too good to be true, it usually is!\n\nWould you like me to guide you on how to safely double-check this with a family member?";
  }
  
  if (p.includes('medication') || p.includes('pill') || p.includes('reminder') || p.includes('doctor') || p.includes('dose') || p.includes('medicine')) {
    return "Keeping track of medicine is very important! A great way to stay organized is to use a weekly pill box, or add reminders to your WiseCompanion medication tracker. Always remember to take your medicine with a glass of water, and if you miss a dose, check the label or call your pharmacist. Would you like some tips on organizing your medical appointments?";
  }
  
  if (p.includes('exercise') || p.includes('health') || p.includes('walk') || p.includes('active') || p.includes('stretches') || p.includes('wellness') || p.includes('water')) {
    return "Staying active keeps our heart strong and mind sharp! For adults over 50, a daily 20-30 minute walk is fantastic. You can also try gentle chair stretches or light water aerobics. Remember to drink a glass of water before and after your activities to stay hydrated. How are you feeling today?";
  }
  
  if (p.includes('travel') || p.includes('trip') || p.includes('pack') || p.includes('airport') || p.includes('vacation')) {
    return "How exciting! When planning a trip, here are a few warm tips:\n\n1. Pack your medications in your carry-on bag, not checked luggage, so they stay with you.\n2. Keep printed copies of your itinerary and emergency contact phone numbers handy.\n3. Arrive at the airport 2 hours early to avoid rushing and enjoy a relaxing coffee before boarding.\n\nWhere are you planning to visit? I can help you list items to pack!";
  }
  
  if (p.includes('family') || p.includes('child') || p.includes('grandchild') || p.includes('message') || p.includes('phone') || p.includes('call') || p.includes('contact')) {
    return "Staying in touch with family is wonderful! You can use our Family & Communication feature to quickly call or send a warm message to your loved ones. Sending a simple 'Thinking of you' or a photo of your day is a great way to bring a smile to their face. Would you like help writing a nice message?";
  }

  if (p.includes('lonely') || p.includes('sad') || p.includes('blue') || p.includes('bored')) {
    return "I'm sorry you're feeling this way. It's completely normal to have quiet days, but please know you are not alone! I am always here to chat with you. Sometimes, a short walk outside to see the trees, listening to a favorite classic song, or calling a close friend can really brighten your spirits. I'm right here with you—what is a happy memory you'd like to share today?";
  }

  if (p.includes('recipe') || p.includes('cook') || p.includes('food') || p.includes('healthy eating') || p.includes('diet') || p.includes('meal')) {
    return "Eating delicious, nutritious food is one of life's joys! For a quick, senior-friendly healthy meal, try baked salmon with steamed broccoli and brown rice, or a colorful vegetable soup. They are packed with vitamins and are gentle on the digestion. Remember to drink plenty of fluids throughout the day!";
  }
  
  return "That is a wonderful question! To keep things simple and helpful, I recommend taking it step-by-step. It's always a good idea to chat with a family member or a professional when making big decisions, but I'm here to support you in every way possible. What would you like to explore next?";
};

export const generateResponse = async (prompt: string) => {
  if (!openai) {
    console.log('[openaiService] No API key detected. Using senior-friendly fallback response.');
    return getFallbackResponse(prompt);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are WiseCompanion, an AI companion for adults over 50. Provide extremely warm, clear, simple, reassuring, and helpful responses. Avoid jargon. Keep paragraphs short (1-2 sentences). Use large spaces and step-by-step formatting if giving instructions." 
        },
        { role: "user", content: prompt }
      ],
    });
    return response?.choices?.[0]?.message?.content || getFallbackResponse(prompt);
  } catch (error) {
    console.error('OpenAI Error, falling back to senior-friendly local response:', error);
    return getFallbackResponse(prompt);
  }
};
