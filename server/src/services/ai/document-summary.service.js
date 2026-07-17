import { extractText } from './text-extraction.service.js';
import { buildDocumentSummaryPrompt } from './prompt-builder.service.js';
import { generateContent } from './ai-provider.service.js';
import { validateTextResponse } from './response-validator.service.js';

export const summarizeDocument = async ({
  document,
  modelProvider,
  model,
  password = null,
}) => {
  /*
  Step 1
  */

  const extractionResult = await extractText({
  buffer: document.buffer,
  mimeType: document.mimeType,
  password,
});

  /*
  Step 2
  */

  const prompt = buildDocumentSummaryPrompt({
    documentText: extractionResult.text,
  });

  /*
  Step 3
  */

  const aiResponse = await generateContent({
    modelProvider,
    model,
    prompt,
  });

  /*
  Step 4
  */

  const summary = validateTextResponse(aiResponse);

  /*
  Step 5
  */

  return {
  summary,
  provider: modelProvider,
  model,
  generatedAt: new Date(),
  usage: aiResponse.usage,
  finishReason: aiResponse.finishReason,
  extractionMetadata: extractionResult.metadata,
};
};
