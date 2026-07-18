import {
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_EMBEDDING_PROVIDER,
} from '../embeddings/constants.js';

import { getEmbeddingProvider }
from '../embeddings/provider.factory.js';

class QueryService {
  async generateEmbedding(question) {
    if (!question?.trim()) {
      throw new Error('Question is required.');
    }

    const provider = getEmbeddingProvider(
      DEFAULT_EMBEDDING_PROVIDER
    );

    const [embedding] = await provider.generate(
      [question],
      DEFAULT_EMBEDDING_MODEL
    );

    return embedding;
  }
}

export default new QueryService();
