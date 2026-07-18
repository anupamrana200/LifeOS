const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

class ChunkingService {
  split(
    text,
    chunkSize = DEFAULT_CHUNK_SIZE,
    overlap = DEFAULT_CHUNK_OVERLAP
  ) {
    if (!text?.trim()) return [];

    const chunks = [];

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);

      chunks.push({
        content: text.slice(start, end).trim(),
      });

      start += chunkSize - overlap;
    }

    return chunks;
  }
}

export default new ChunkingService();

