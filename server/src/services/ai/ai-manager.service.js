
import { summarizeDocument } from './document-summary.service.js';

export const generateDocumentSummary = async ({
  document,
  modelProvider,
  model,
  password,
}) => {
  return summarizeDocument({
    document,
    modelProvider,
    model,
    password,
  });
};