import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const humanizeText = async (text: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Updated prompt with stricter constraints based on user feedback
    const prompt = `
      You are an expert ghostwriter and editor. Rewrite the following text to make it undetectable by AI detectors and completely natural.

      STRICT RULES:
      1. **NO EM-DASHES (—):** Do not use the long dash character. Use commas, periods, or parentheses if needed. AI uses these too much.
      2. **NO ROBOTIC VOCABULARY:** Avoid words like "delve", "tapestry", "complex landscape", "testament", "underscore", "moreover", "in conclusion".
      3. **SENTENCE VARIETY (BURSTINESS):** Mix very short, punchy sentences with longer, complex ones. Do not start every sentence the same way.
      4. **NATURAL TONE:** Write as if you are speaking to a colleague or friend. Use contractions (it's, can't) where appropriate. 
      5. **RETAIN MEANING:** Keep the core facts, but completely change the structure and flow.
      6. **OUTPUT ONLY:** Do not add introductory filler like "Here is the humanized version". Just give the text.

      Text to rewrite:
      "${text}"
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 1.0, // High temperature for maximum human-like variance
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process text with Gemini.");
  }
};