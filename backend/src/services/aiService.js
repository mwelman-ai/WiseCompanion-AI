import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openai = null;
function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export const generateIdeas = async (niche, platform, count = 5, options = {}) => {
  const { full_script = false, include_seo = false } = options;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    console.log('Using mock AI response (no API key found)');
    const mockIdeas = [];
    for (let i = 1; i <= count; i++) {
      const idea = {
        title: `Mock Idea ${i} for ${niche} on ${platform}`,
        hook: `Did you know this about ${niche}?`,
        description: `This is a mock description for viral ${platform} content about ${niche}.`
      };
      if (full_script) idea.full_script = `[MOCK FULL SCRIPT] for ${idea.title}`;
      if (include_seo) {
        idea.seo = {
          optimized_title: `🔥 [MOCK] ${idea.title}`,
          tags: ["#trending", `#${platform}`],
          caption: `Check this out! #${niche}`
        };
      }
      mockIdeas.push(idea);
    }
    return mockIdeas;
  }

  let prompt = `Generate ${count} viral content ideas for a ${platform} creator in the ${niche} niche.
  For each idea, provide:
  1. A catchy title
  2. A strong hook
  3. A brief description of the video content`;

  if (full_script) prompt += `\n4. A full, word-for-word video script with scene descriptions.`;
  if (include_seo) prompt += `\n5. Platform-specific SEO: Also suggest SEO-optimized titles for YouTube, captions for Instagram, and hashtags for TikTok.`;

  prompt += `\n\nFormat the response as a JSON object with an 'ideas' array. Each object should have keys: title, hook, description${full_script ? ', full_script' : ''}${include_seo ? ', seo' : ''}.`;

  try {
    const client = getOpenAI();
    if (!client) throw new Error('No OpenAI API key configured');
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a social media expert and content strategist." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content.ideas || content;
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw error;
  }
};

export const generateFullScript = async (idea) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    return `[MOCK FULL SCRIPT]
    Title: ${idea.title}
    Platform: ${idea.platform}
    
    (Opening Shot)
    Hook: ${idea.hook}
    
    (Middle Section)
    Content: Detailed breakdown of ${idea.niche} tips.
    
    (Closing)
    CTA: Follow for more!`;
  }

  const prompt = `Generate a full, word-for-word video script for a ${idea.platform} video.
  Niche: ${idea.niche}
  Title: ${idea.title}
  Hook: ${idea.hook}
  Brief: ${idea.script}

  Include scene descriptions and camera cues in brackets.`;

  try {
    const client = getOpenAI();
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional scriptwriter for viral social media content." },
        { role: "user", content: prompt }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating full script:', error);
    throw error;
  }
};

export const optimizeSEO = async (idea) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    return {
      optimized_title: `🔥 [MOCK] ${idea.title} | ${idea.niche} Tips`,
      tags: ["#trending", `#${idea.platform}`, `#${idea.niche.replace(/\s+/g, '')}`],
      description: `Check out these ${idea.niche} tips for ${idea.platform}! #viral`
    };
  }

  const prompt = `Optimize the following content for ${idea.platform} SEO:
  Niche: ${idea.niche}
  Title: ${idea.title}
  Hook: ${idea.hook}

  Provide:
  1. An optimized, high-CTR title
  2. A list of 10-15 relevant hashtags
  3. A platform-optimized video description

  Format the response as a JSON object with keys: optimized_title, tags, description.`;

  try {
    const client = getOpenAI();
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an SEO expert specializing in social media algorithms." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error optimizing SEO:', error);
    throw error;
  }
};