import OpenAI from 'openai';
import EmbeddingProvider from './embedding.interface.js';
import {
  DEFAULT_EMBEDDING_MODEL,
} from './constants.js';
import { retry } from '../../../utils/retry.util.js';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIEmbeddingProvider extends EmbeddingProvider {
  async generate(
    texts,
    model = DEFAULT_EMBEDDING_MODEL
  ) {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error('Texts cannot be empty.');
    }

    const response = await retry(
      () =>
        client.embeddings.create({
          model,
          input: texts,
        }),
      {
        retries: 3,
        onRetry: (err, attempt) =>
          console.warn(
            `[Embedding] Retry ${attempt}: ${err.message}`
          ),
      }
    );

    if (
      !response?.data ||
      response.data.length !== texts.length
    ) {
      throw new Error('Invalid embedding response.');
    }

    return response.data.map(item => item.embedding);
  }
}

export default new OpenAIEmbeddingProvider();