import textExtractionService from './text-extraction.service.js';
import { processResponse } from './response/index.js';

import {
  buildPrompt,
} from './prompts/prompt-builder.js';

import {
  validatePrompt,
} from './prompts/prompt-validator.js';

import {
  getPrompt,
} from './prompts/index.js';

import {
  generateContent,
} from './ai-provider.service.js';

export const extractDocument = async ({
  document,
  task = 'summary',
  documentType = 'generic',
  modelProvider,
  model,
  password = null,
}) => {
  /*
   * Step 1
   * Extract text.
   */

 const extractionResult =
  await textExtractionService.extract({
    buffer: document.buffer,
    filename: document.originalFileName,
    mimetype: document.mimeType,
    password,
  });

  /*
   * Step 2
   * Load prompt.
   */

  const promptDefinition =
    getPrompt(documentType);

  /*
   * Step 3
   * Validate.
   */

  validatePrompt({
    documentType,
    schema: promptDefinition.schema,
    text: extractionResult.text,
  });

  /*
   * Step 4
   * Build Prompt.
   */

  const prompt = buildPrompt({
    documentType,
    instructions:
      promptDefinition.instructions,
    schema: promptDefinition.schema,
    text: extractionResult.text,
  });

  /*
   * Step 5
   * Generate AI Response.
   */

  const aiResponse =
    await generateContent({
      modelProvider,
      model,
      prompt,
    });

  /*
   * Step 6
   * Parse AI Response.
   */

  const result = processResponse({
    response: aiResponse,
    schema: promptDefinition.schema,
  });

  /*
   * Step 7
   * Return processed result.
   */

  return {
    task,

    documentType,

    provider: aiResponse.provider,

    model: aiResponse.model,

    result,

    usage: aiResponse.usage,

    finishReason:
      aiResponse.finishReason,

    generatedAt: new Date(),

    extractionMetadata:
      extractionResult.metadata,
  };
};