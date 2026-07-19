import Document from '../models/Document.js';
import ValidationError from '../errors/ValidationError.js';
import NotFoundError from '../errors/NotFoundError.js';
import { toDocumentResponse } from '../serializers/document.serializer.js';
import { saveEncryptedDocument, readEncryptedDocument, deleteEncryptedDocument } from './document-storage.service.js';
import { decryptText, encryptText } from './encryption.service.js';

const encryptTags = (tags) => Array.isArray(tags) ? tags.map((tag) => encryptText(tag, 'document.tag')) : [];
const getOwnedDocument = async (documentId, ownerId) => {
  const document = await Document.findOne({ _id: documentId, owner: ownerId });
  if (!document) throw new NotFoundError('Document not found.');
  return document;
};

export const getDocumentContent = async (documentId, ownerId) => {
  const document = await getOwnedDocument(documentId, ownerId);
  return { document, buffer: await readEncryptedDocument(document.storagePath), mimeType: document.mimeType, originalFileName: decryptText(document.originalFileName, 'document.filename') };
};

const replaceDocumentFile = async (document, file) => {
  const { fileName, storagePath } = await saveEncryptedDocument(file.buffer);
  document.originalFileName = encryptText(file.originalname, 'document.filename');
  document.storedFileName = fileName;
  document.storagePath = storagePath;
  document.mimeType = file.mimetype;
  document.fileSize = file.size;
};

export const createDocument = async ({ owner, file, title, category, description, expiryDate, tags }) => {
  if (!file?.buffer?.length) throw new ValidationError(file ? 'Uploaded file is empty.' : 'Document file is required.');
  const { fileName, storagePath } = await saveEncryptedDocument(file.buffer);
  const document = await Document.create({ owner, title: encryptText(title, 'document.title'), category, description: description ? encryptText(description, 'document.description') : null, originalFileName: encryptText(file.originalname, 'document.filename'), storedFileName: fileName, storagePath, mimeType: file.mimetype, fileSize: file.size, expiryDate: expiryDate || null, tags: encryptTags(tags) });
  return toDocumentResponse(document);
};

export const getDocuments = async (owner, { page = 1, limit = 10, category, search, sort = '-createdAt' } = {}) => {
  const rawDocuments = await Document.find({ owner, ...(category ? { category } : {}) }).sort(sort).lean();
  const serialized = rawDocuments.map(toDocumentResponse);
  const query = search?.trim().toLowerCase();
  const matching = query ? serialized.filter((document) => [document.title, document.description, document.originalFileName, ...(document.tags || [])].some((value) => value?.toLowerCase().includes(query))) : serialized;
  const total = matching.length;
  return { documents: matching.slice((page - 1) * limit, page * limit), pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getDocument = async (documentId, ownerId) => toDocumentResponse(await getOwnedDocument(documentId, ownerId));
export const previewDocument = (documentId, ownerId) => getDocumentContent(documentId, ownerId);
export const downloadDocument = (documentId, ownerId) => getDocumentContent(documentId, ownerId);

export const updateDocument = async ({ documentId, ownerId, file, title, category, description, expiryDate, tags }) => {
  const document = await getOwnedDocument(documentId, ownerId);
  if (title !== undefined) document.title = encryptText(title, 'document.title');
  if (category !== undefined) document.category = category;
  if (description !== undefined) document.description = description ? encryptText(description, 'document.description') : null;
  if (expiryDate !== undefined) document.expiryDate = expiryDate || null;
  if (tags !== undefined) document.tags = encryptTags(tags);
  if (file) {
    const oldStoragePath = document.storagePath;
    await replaceDocumentFile(document, file);
    await document.save();
    try { await deleteEncryptedDocument(oldStoragePath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  } else await document.save();
  return toDocumentResponse(document);
};

export const deleteDocument = async (documentId, ownerId) => {
  const document = await getOwnedDocument(documentId, ownerId);
  try { await deleteEncryptedDocument(document.storagePath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await document.deleteOne();
};
