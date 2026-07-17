import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateGeminiContent = async ({
  prompt,
  model = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
}) => {
  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
  });

  return {
  text: response.text,
  usage: response.usageMetadata ?? null,
  finishReason: response.candidates?.[0]?.finishReason ?? null,
};
};