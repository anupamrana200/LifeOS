import scheduler from './scheduler.js';

class OcrEngine {
  async recognize(buffer) {
    return scheduler.enqueue(async (worker) => {
      const {
        data: { text, confidence },
      } = await worker.worker.recognize(buffer);

      return {
        text: text.trim(),
        confidence: Math.round(confidence),
      };
    });
  }

  async recognizeBatch(buffers = []) {
    if (!Array.isArray(buffers)) {
      throw new TypeError('buffers must be an array.');
    }

    return Promise.all(
      buffers.map((buffer) => this.recognize(buffer))
    );
  }

  async shutdown() {
    await scheduler.shutdown();
  }
}

export default new OcrEngine();