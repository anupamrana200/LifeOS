import Document from '../../models/Document.js';

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
      aiResult: result,
      aiMetadata: metadata,
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
      aiMetadata: {
        error: error.message,
        failedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};