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
    messages,
    model = this.model,
  }) {
    const input = messages.map(message => ({
      role: message.role,
      content: message.content,
    }));

    const response =
      await this.client.responses.create({
        model,
        input,
      });

    return {
      provider: PROVIDERS.OPENAI,
      model,
      text: response.output_text,
      usage: response.usage ?? null,
      finishReason: response.status ?? null,
    };
  }

  async generateStream({
    messages,
    model = this.model,
    onToken,
  }) {
    const input = messages.map(message => ({
      role: message.role,
      content: message.content,
    }));

    const stream =
      await this.client.responses.create({
        model,
        input,
        stream: true,
      });

    let fullText = '';

    let usage = null;

    let finishReason = null;

    for await (const event of stream) {

      switch (event.type) {

        case 'response.output_text.delta': {

          const token = event.delta ?? '';

          fullText += token;

          if (onToken) {
            await onToken(token);
          }

          break;
        }

        case 'response.completed': {

          usage =
            event.response?.usage ?? null;

          finishReason =
            event.response?.status ?? null;

          break;
        }

        case 'error': {

          throw new Error(
            event.error?.message ??
            'OpenAI streaming failed.'
          );
        }

        default:
          break;
      }

    }

    return {
      provider: PROVIDERS.OPENAI,
      model,
      text: fullText,
      usage,
      finishReason,
    };
  }
}

export default new OpenAIProvider();