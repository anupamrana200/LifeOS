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
    messages,
    model = this.model,
  }) {
    const contents = messages
      .filter(message => message.role !== 'system')
      .map(message => ({
        role:
          message.role === 'assistant'
            ? 'model'
            : 'user',
        parts: [
          {
            text: message.content,
          },
        ],
      }));

    const systemInstruction =
      messages.find(
        message => message.role === 'system'
      )?.content;

    const response =
      await this.client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        },
      });

    return {
      provider: PROVIDERS.GEMINI,
      model,
      text: response.text,
      usage:
        response.usageMetadata ?? null,
      finishReason:
        response.candidates?.[0]?.finishReason ??
        null,
    };
  }

  async generateStream({
    messages,
    model = this.model,
    onToken,
  }) {
    const contents = messages
      .filter(message => message.role !== 'system')
      .map(message => ({
        role:
          message.role === 'assistant'
            ? 'model'
            : 'user',
        parts: [
          {
            text: message.content,
          },
        ],
      }));

    const systemInstruction =
      messages.find(
        message => message.role === 'system'
      )?.content;

    const stream =
      await this.client.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction,
        },
      });

    let fullText = '';

    for await (const chunk of stream) {

      const token = chunk.text ?? '';

      fullText += token;

      if (onToken && token) {
        await onToken(token);
      }
    }

    return {
      provider: PROVIDERS.GEMINI,
      model,
      text: fullText,
      usage: null,
      finishReason: 'STOP',
    };
  }
}

export default new GeminiProvider();