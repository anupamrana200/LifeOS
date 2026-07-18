import asyncHandler from '../utils/asyncHandler.js';

import {
  getDocumentContent,
} from '../services/document.service.js';

import {
  processDocument,
} from '../services/ai/ai.service.js';

export const processDocumentController = asyncHandler(
  async (req, res) => {
    const { documentId } = req.params;

    const {
      task = 'summary',
      documentType = 'generic',
      modelProvider,
      model,
      password,
    } = req.body;

    const {
      buffer,
      mimeType,
      originalFileName,
      document,
    } = await getDocumentContent(
      documentId,
      req.user.id,
    );

    const result = await processDocument({
      document: {
        buffer,
        mimeType,
        originalFileName,
        document,
      },
      task,
      documentType,
      modelProvider,
      model,
      password,
    });

    res.status(200).json({
      success: true,
      message: 'AI processing completed successfully.',
      data: result,
    });
  },
);