import { randomUUID } from 'crypto';

import chunkingService from './chunking.service.js';
import pineconeService from './pinecone.service.js';

import {
  DEFAULT_EMBEDDING_PROVIDER,
  DEFAULT_EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
} from './constants.js';

import {
  getEmbeddingProvider,
} from './provider.factory.js';
import { encryptText } from '../../encryption.service.js';

class EmbeddingService {
  async indexDocument({
    documentId,
    userId,
    text,
  }) {
    if (!text?.trim()) {
      console.log('No text found for embedding.');
      return;
    }

    const chunks = chunkingService.split(text);

    if (!chunks.length) {
      console.log('No chunks generated.');
      return;
    }

    const provider = getEmbeddingProvider(
      DEFAULT_EMBEDDING_PROVIDER
    );

    const embeddings = await provider.generate(
      chunks.map(chunk => chunk.content)
    );

    const expectedDimension = EMBEDDING_DIMENSIONS[DEFAULT_EMBEDDING_MODEL];

    embeddings.forEach((embedding, index) => {
      if (!Array.isArray(embedding)) {
        throw new Error(
          `Embedding ${index} is not an array.`
        );
      }

      if (embedding.length !== expectedDimension) {
        throw new Error(
          `Embedding ${index} dimension mismatch. Expected ${expectedDimension}, got ${embedding.length}.`
        );
      }
    });

    if (!embeddings.length) {
      console.log('No embeddings generated.');
      return;
    }

    const vectors = chunks.map((chunk, index) => ({
      id: randomUUID(),

      values: embeddings[index],

      metadata: {
        documentId,
        userId,
        chunkIndex: index,
        content: encryptText(chunk.content, 'vector.chunk'),
      },
    }));

    await pineconeService.upsert(vectors);

    console.info(
      `[Embedding] Indexed ${vectors.length} chunk(s) for document ${documentId}`
    );

    return {
      chunks: chunks.length,
      vectors: vectors.length,
    };
  }
}

export default new EmbeddingService();
