import pineconeService from '../embeddings/pinecone.service.js';
import queryService from './query.service.js';

class RetrievalService {
  async retrieve({
    userId,
    question,
    topK = 5,
  }) {
    const embedding =
      await queryService.generateEmbedding(
        question
      );

    const result =
      await pineconeService.query(
        embedding,
        topK,
        {
          userId: {
            $eq: userId.toString(),
          },
        }
      );

    const matches = result.matches ?? [];

    return matches.map(match => ({
      score: match.score,
      content: match.metadata.content,
      documentId: match.metadata.documentId,
    }));
  }
}

export default new RetrievalService();