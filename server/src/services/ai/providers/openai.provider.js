import OpenAI from 'openai';

import ProviderInterface from './provider.interface.js';

import {
  DEFAULT_OPENAI_MODEL,
  PROVIDERS,
} from './constants.js';

class OpenAIProvider extends ProviderInterface {
  constructor() {
    super();

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.model = DEFAULT_OPENAI_MODEL;
  }

  async generate({
    system,
    user,
    model = this.model,
  }) {
    const response = await this.client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: user,
        },
      ],
    });

    return {
      provider: PROVIDERS.OPENAI,
      model,
      text: response.output_text,
      usage: response.usage ?? null,
      finishReason: response.status ?? null,
    };
  }
}

export default new OpenAIProvider();