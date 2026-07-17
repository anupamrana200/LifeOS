import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

import { renderPdfPages } from '../renderers/pdf.renderer.js';
import ocrService from '../ocr/ocr.service.js';

const MIN_TEXT_LENGTH = 20;

const extractEmbeddedText = async ({
  buffer,
  password,
}) => {
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    password,
    useSystemFonts: true,
    disableWorker: true,
  });

  const pdfDocument = await loadingTask.promise;

  try {
    const pageTexts = [];

    for (
      let pageNumber = 1;
      pageNumber <= pdfDocument.numPages;
      pageNumber++
    ) {
      const page = await pdfDocument.getPage(pageNumber);

      const textContent = await page.getTextContent();

      const text = textContent.items
        .map((item) => item.str)
        .join(' ')
        .trim();

      pageTexts.push(text);
    }

    return {
      text: pageTexts.join('\n\n').trim(),
      pageCount: pdfDocument.numPages,
    };
  } finally {
    await loadingTask.destroy();
  }
};

export const extractPdf = async ({
  buffer,
  language = process.env.OCR_LANGUAGE || 'eng',
  password,
}) => {
  // -------------------------
  // Step 1: Extract embedded text
  // -------------------------
  const embedded = await extractEmbeddedText({
    buffer,
    password,
  });

  // -------------------------
  // Step 2: Digital PDF
  // -------------------------
  if (embedded.text.length >= MIN_TEXT_LENGTH) {
    return {
      text: embedded.text,
      metadata: {
        pageCount: embedded.pageCount,
        source: 'embedded-text',
      },
    };
  }

  // -------------------------
  // Step 3: OCR fallback
  // -------------------------
  const renderedPages = await renderPdfPages({
    buffer,
    password,
  });

  const ocrResult = await ocrService.extractBatch({
    buffers: renderedPages.map((page) => page.buffer),
    language,
  });

  const text = ocrResult.pages
    .map((page) => page.text.trim())
    .join('\n\n')
    .trim();

  const averageConfidence =
    ocrResult.pages.length === 0
      ? 0
      : Math.round(
          ocrResult.pages.reduce(
            (sum, page) => sum + page.confidence,
            0
          ) / ocrResult.pages.length
        );

  return {
    text,
    metadata: {
      pageCount: embedded.pageCount,
      source: 'ocr',
      language: ocrResult.language,
      provider: ocrResult.provider,
      processingTime: ocrResult.processingTime,
      averageConfidence,
    },
  };
};