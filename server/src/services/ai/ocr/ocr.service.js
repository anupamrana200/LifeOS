import ocrEngine from './ocr-engine.js';
import { preprocessImage } from './image-preprocessor.js';
import { OCR_PROVIDER } from './constants.js';

class OcrService {
  async extractText({
    buffer,
    language = process.env.OCR_LANGUAGE || 'eng',
    preprocess = true,
  }) {
    const startTime = Date.now();

    const imageBuffer = preprocess
      ? await preprocessImage({ buffer })
      : buffer;

    const { text, confidence } = await ocrEngine.recognize(imageBuffer);

    return {
      text,
      confidence,
      language,
      provider: OCR_PROVIDER,
      processingTime: Date.now() - startTime,
    };
  }

  async extractBatch({
    buffers,
    language = process.env.OCR_LANGUAGE || 'eng',
    preprocess = true,
  }) {
    const startTime = Date.now();

    const processedBuffers = preprocess
      ? await Promise.all(
          buffers.map((buffer) =>
            preprocessImage({ buffer })
          )
        )
      : buffers;

    const results = await ocrEngine.recognizeBatch(processedBuffers);

    return {
      pages: results.map(page => ({
        text: page.text,
        confidence: page.confidence,
      })),
      pageCount: results.length,
      language,
      provider: OCR_PROVIDER,
      processingTime: Date.now() - startTime,
    };
  }

  async shutdown() {
    await ocrEngine.shutdown();
  }
}

export default new OcrService();