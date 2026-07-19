import { decryptJson, decryptText } from '../services/encryption.service.js';

export const toDocumentResponse = (document) => ({
  id: (document._id ?? document.id).toString(),
  title: decryptText(document.title, 'document.title'),
  category: document.category,
  description: decryptText(document.description, 'document.description'),
  originalFileName: decryptText(document.originalFileName, 'document.filename'),
  mimeType: document.mimeType,
  fileSize: document.fileSize,
  expiryDate: document.expiryDate,
  tags: (document.tags || []).map((tag) => decryptText(tag, 'document.tag')),
  aiStatus: document.aiStatus,
  aiSummary: decryptText(document.aiSummary, 'document.aiSummary'),
  aiMetadata: decryptJson(document.aiMetadata, 'document.aiMetadata'),
  isArchived: document.isArchived,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});
