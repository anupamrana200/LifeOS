import asyncHandler from '../utils/asyncHandler.js';

import {
  getDocumentContent,
} from '../services/document.service.js';

import {
  generateDocumentSummary,
} from '../services/ai/ai-manager.service.js';

export const generateSummary = asyncHandler(
  async (req, res) => {
    const { documentId } = req.params;

    const {
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

    const result =
      await generateDocumentSummary({
        document: {
          buffer,
          mimeType,
          originalFileName,
          document,
        },
        modelProvider,
        model,
        password,
      });

    res.status(200).json({
      success: true,
      message: 'Document summary generated successfully.',
      data: result,
    });
  },
);