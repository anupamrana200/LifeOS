import path from 'path';

import { extractPdf } from './extractors/pdf.extractor.js';
import { extractImage } from './extractors/image.extractor.js';
import { extractDocx } from './extractors/docx.extractor.js';
import { extractTxt } from './extractors/txt.extractor.js';

const OCR_LANGUAGE = process.env.OCR_LANGUAGE || 'eng';

const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.bmp',
  '.tif',
  '.tiff',
]);

const EXTRACTORS = new Map([
  ['.pdf', extractPdf],
  ['.docx', extractDocx],
  ['.txt', extractTxt],
]);

class TextExtractionService {
  async extract({
    buffer,
    filename = '',
    mimetype = '',
    password,
  }) {
    if (!buffer) {
      throw new Error('Document buffer is required.');
    }

    const extension = path.extname(filename).toLowerCase();

    if (IMAGE_EXTENSIONS.has(extension) || mimetype.startsWith('image/')) {
      return extractImage({
        buffer,
        language: OCR_LANGUAGE,
      });
    }

    const extractor = EXTRACTORS.get(extension);

    if (!extractor) {
      throw new Error(
        `Unsupported document type: ${extension || mimetype || 'unknown'}`
      );
    }

    return extractor({
      buffer,
      language: OCR_LANGUAGE,
      password,
    });
  }
}

export default new TextExtractionService();