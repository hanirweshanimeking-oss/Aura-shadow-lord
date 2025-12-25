
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "../constants";
import { CharacterType, ChannelStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCompanionResponse = async (
  message: string, 
  stats: ChannelStats, 
  history: any[], 
  character: CharacterType
) => {
  try {
    const affection = stats.affectionLevel || 50;
    const context = `Current Stats: ${JSON.stringify(stats)}. Previous Conversation: ${JSON.stringify(history.slice(-5))}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `${getSystemPrompt(character, affection)}\n\nContext:\n${context}`,
        temperature: 0.85, // Slightly higher for more creative flirting
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System connection unstable... give me a moment. [UPSET]";
  }
};
