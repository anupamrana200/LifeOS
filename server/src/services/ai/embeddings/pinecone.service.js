import { Pinecone } from '@pinecone-database/pinecone';
import { retry } from '../../../utils/retry.util.js';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc
  .index(process.env.PINECONE_INDEX_NAME)
  .namespace('default');

class PineconeService {
  async upsert(records) {
    if (!Array.isArray(records) || records.length === 0) {
      throw new Error(
        'Pinecone requires at least one record.'
      );
    }

    return retry(
      () =>
        index.upsert({
          records,
        }),
      {
        retries: 3,
        onRetry: (err, attempt) =>
          console.warn(
            `[Pinecone] Retry ${attempt}: ${err.message}`
          ),
      }
    );
  }

    async query(
        vector,
        topK = 5,
        filter = {}
    ) {

        return retry(() =>

          index.query({

            vector,

            topK,

            filter,

            includeMetadata: true,

          })

        );

    }

  async delete(ids) {
    if (!ids?.length) return;

    return retry(() => index.deleteMany(ids));
  }
}

export default new PineconeService();