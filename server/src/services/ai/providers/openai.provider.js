import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateOpenAIContent = async ({
  prompt,
  model = process.env.OPENAI_MODEL || 'gpt-5.5',
}) => {
  const response = await openai.responses.create({
    model,
    input: prompt,
  });

  return {
  text: response.output_text,
  usage: response.usage ?? null,
  finishReason: response.status ?? null,
};
};