import openaiProvider from './openai.provider.js';
import geminiProvider from './gemini.provider.js';

import {
  DEFAULT_PROVIDER,
  PROVIDERS,
} from './constants.js';

export const getProvider = (
  provider = DEFAULT_PROVIDER
) => {
  switch (provider) {
    case PROVIDERS.GEMINI:
      return geminiProvider;

    case PROVIDERS.OPENAI:
    default:
      return openaiProvider;
  }
};