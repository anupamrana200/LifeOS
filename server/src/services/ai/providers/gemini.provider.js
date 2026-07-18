import { GoogleGenAI } from '@google/genai';

import ProviderInterface from './provider.interface.js';

import {
  DEFAULT_GEMINI_MODEL,
  PROVIDERS,
} from './constants.js';

class GeminiProvider extends ProviderInterface {
  constructor() {
    super();

    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.model = DEFAULT_GEMINI_MODEL;
  }

  async generate({
    system,
    user,
    model = this.model,
  }) {
    const response =
      await this.client.models.generateContent({
        model,
        contents: `${system}\n\n${user}`,
      });

    return {
      provider: PROVIDERS.GEMINI,
      model,
      text: response.text,
      usage: response.usageMetadata ?? null,
      finishReason:
        response.candidates?.[0]?.finishReason ??
        null,
    };
  }
}

export default new GeminiProvider();