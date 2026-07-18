import { extractDocument } from './document-extraction.service.js';
import embeddingService from './embeddings/embedding.service.js';

import {
  markAIProcessing,
  saveAIResult,
  markAIFailed,
} from './document-ai.service.js';

export const processDocument = async ({
  document,
  task = 'summary',
  documentType = 'generic',
  modelProvider,
  model,
  password,
}) => {
  const documentId = document.document._id;

  try {
    /*
     * Mark AI processing.
     */

    await markAIProcessing(documentId);

    /*
     * Run AI pipeline.
     */

    const aiResult = await extractDocument({
      document,
      task,
      documentType,
      modelProvider,
      model,
      password,
    });

    /*
     * Save AI result.
     */

    await saveAIResult({
      documentId,
      result: aiResult.result,
      metadata: {
        task: aiResult.task,
        documentType: aiResult.documentType,
        provider: aiResult.provider,
        model: aiResult.model,
        usage: aiResult.usage,
        finishReason: aiResult.finishReason,
        generatedAt: aiResult.generatedAt,
        extractionMetadata:
          aiResult.extractionMetadata,
      },
    });

    try {
      console.log('Extracted text length:', aiResult.extractedText?.length);
      await embeddingService.indexDocument({
        documentId: documentId.toString(),
        userId: document.document.owner.toString(),
        text: aiResult.extractedText,
      });
    } catch (error) {
      console.error('Embedding indexing failed:', error);
    }


    return aiResult;
  } catch (error) {
    await markAIFailed({
      documentId,
      error,
    });

    throw error;
  }
};