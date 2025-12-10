import { GoogleGenAI, Type } from "@google/genai";
import { RankResponse } from "../types";

// Initialize Gemini Client
// IMPORTANT: Access key from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRankTitle = async (score: number): Promise<RankResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a funny, creative, and grand title in Portuguese for a player who has clicked a button exactly ${score} times. 
      The title should be short (max 5 words). 
      Examples: "Iniciante do Dedo", "Lorde do Mouse", "Divindade do Clique".
      Make it correspond loosely to the magnitude of the number.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The generated rank title in Portuguese"
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      return { title: `Nível ${score}` }; // Fallback
    }

    return JSON.parse(jsonText) as RankResponse;

  } catch (error) {
    console.error("Error generating rank with Gemini:", error);
    // Graceful fallback if API fails or quota exceeded
    return { title: "Clicador Anônimo" };
  }
};
