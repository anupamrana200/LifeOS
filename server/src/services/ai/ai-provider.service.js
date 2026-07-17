import { generateGeminiContent } from './providers/gemini.provider.js';
import { generateOpenAIContent } from './providers/openai.provider.js';
import ValidationError from '../../errors/ValidationError.js';

export const generateContent = async ({
  modelProvider,
  model,
  prompt,
}) => {
  switch (modelProvider?.toLowerCase()) {
    case 'gemini':
      return generateGeminiContent({
        prompt,
        model,
      });

    case 'openai':
      return generateOpenAIContent({
        prompt,
        model,
      });

    default:
      throw new ValidationError(
        `Unsupported AI provider: ${modelProvider}`,
      );
  }
};
