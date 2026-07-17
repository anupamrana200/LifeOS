import ocrService from '../ocr/ocr.service.js';

export const extractImage = async ({
  buffer,
  language = process.env.OCR_LANGUAGE || 'eng',
}) => {
  const { text, ...metadata } = await ocrService.extractText({
    buffer,
    language,
  });

  return {
    text,
    metadata,
  };
};