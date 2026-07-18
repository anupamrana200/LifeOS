import genericPrompt from './generic.prompt.js';
import invoicePrompt from './invoice.prompt.js';
import receiptPrompt from './receipt.prompt.js';
import identityPrompt from './identity.prompt.js';
import bankPrompt from './bank.prompt.js';

const PROMPTS = new Map([
  [genericPrompt.type, genericPrompt],
  [invoicePrompt.type, invoicePrompt],
  [receiptPrompt.type, receiptPrompt],
  [identityPrompt.type, identityPrompt],
  [bankPrompt.type, bankPrompt],
]);

export const getPrompt = (type = 'generic') =>
  PROMPTS.get(type) || genericPrompt;

export const hasPrompt = (type) =>
  PROMPTS.has(type);

export const listPromptTypes = () =>
  [...PROMPTS.keys()];
