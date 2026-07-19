import Document from '../../models/Document.js';
import { encryptJson } from '../encryption.service.js';

export const markAIProcessing = async (
  documentId,
) => {
  return Document.findByIdAndUpdate(
    documentId,
    {
      aiStatus: 'processing',
    },
    {
      new: true,
    },
  );
};

export const saveAIResult = async ({
  documentId,
  result,
  metadata,
}) => {
  return Document.findByIdAndUpdate(
    documentId,
    {
      aiStatus: 'completed',
      aiResult: encryptJson(result, 'document.aiResult'),
      aiMetadata: encryptJson(metadata, 'document.aiMetadata'),
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

export const markAIFailed = async ({
  documentId,
  error,
}) => {
  return Document.findByIdAndUpdate(
    documentId,
    {
      aiStatus: 'failed',
      aiMetadata: encryptJson({
        error: error.message,
        failedAt: new Date(),
      }, 'document.aiMetadata'),
    },
    {
      new: true,
    },
  );
};
