import openAIProvider from './openai.embedding.js';
import {
  EMBEDDING_PROVIDERS,
} from './constants.js';

export function getEmbeddingProvider(provider) {
  switch (provider) {
    case EMBEDDING_PROVIDERS.OPENAI:
      return openAIProvider;

    default:
      throw new Error(
        `Unsupported embedding provider: ${provider}`
      );
  }
}
