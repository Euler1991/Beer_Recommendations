import { GoogleGenAI } from "@google/genai";
import { RecommendationResult, GeminiInsight } from '../types';

const getGeminiClient = () => {
  // Check if API key is present
  if (!process.env.API_KEY) {
    console.warn("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSommelierInsight = async (
  topStyles: RecommendationResult[]
): Promise<GeminiInsight | null> => {
  const ai = getGeminiClient();
  if (!ai) return null;

  const top3 = topStyles.slice(0, 3).map(s => `${s.styleName} (${s.affinityScore}% match)`).join(', ');

  const prompt = `
    Act as a world-class Cicerone (Beer Sommelier).
    A user has been analyzed based on their commercial beer preferences and matched with these craft beer styles: ${top3}.
    
    Write a short, engaging paragraph (max 100 words) explaining WHY these styles fit them. Use an encouraging tone. 
    Then provide a catchy title for their "Beer Profile".
    
    Return the result as JSON with keys: "title" and "content".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeminiInsight;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};