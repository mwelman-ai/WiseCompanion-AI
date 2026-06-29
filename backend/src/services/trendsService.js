export const getTrends = async (platform) => {
  // In a real app, this would fetch from a TikTok/Instagram/YouTube trends API.
  // For SparkStream, we'll provide AI-curated trends or mock data.
  
  const trends = {
    tiktok: [
      { audio: "Chill Vibes - Lofi", popularity: "Very High", use_case: "Behind the scenes" },
      { audio: "Fast Transition Beat", popularity: "High", use_case: "Transformation videos" },
      { audio: "Funny Laugh Track v3", popularity: "Medium", use_case: "Blooper reels" }
    ],
    instagram: [
      { audio: "Summer Sunset", popularity: "High", use_case: "Aesthetic reels" },
      { audio: "Corporate Motivation", popularity: "Medium", use_case: "Educational content" }
    ],
    youtube: [
      { topic: "AI productivity tools", growth: "+150%", use_case: "Long-form reviews" },
      { topic: "Minimalist desk setups", growth: "+80%", use_case: "Vlogs" }
    ]
  };

  return trends[platform.toLowerCase()] || [];
};
