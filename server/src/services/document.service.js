import Document from '../models/Document.js';
import ValidationError from '../errors/ValidationError.js';
import NotFoundError from '../errors/NotFoundError.js';
import { toDocumentResponse } from '../serializers/document.serializer.js';
import {
  saveEncryptedDocument,
  readEncryptedDocument,
  deleteEncryptedDocument,
} from './document-storage.service.js';

const getOwnedDocument = async (documentId, ownerId) => {
  const document = await Document.findOne({
    _id: documentId,
    owner: ownerId,
  });

  if (!document) {
    throw new NotFoundError('Document not found.');
  }

  return document;
};

const getDocumentContent = async (documentId, ownerId) => {
  const document = await getOwnedDocument(documentId, ownerId);

  const buffer = await readEncryptedDocument(document.storagePath);

  return {
    buffer,
    mimeType: document.mimeType,
    originalFileName: document.originalFileName,
  };
};

const replaceDocumentFile = async (document, file) => {
  const { fileName, storagePath } = await saveEncryptedDocument(file.buffer);

  document.originalFileName = file.originalname;
  document.storedFileName = fileName;
  document.storagePath = storagePath;
  document.mimeType = file.mimetype;
  document.fileSize = file.size;
};


export const createDocument = async ({
  owner,
  file,
  title,
  category,
  description,
  expiryDate,
  tags,
}) => {
  if (!file) {
    throw new ValidationError('Document file is required.');
  }

  if (!file.buffer?.length) {
    throw new ValidationError('Uploaded file is empty.');
  }

  const { fileName, storagePath } = await saveEncryptedDocument(file.buffer);

  const document = await Document.create({
    owner,
    title,
    category,
    description: description || null,
    originalFileName: file.originalname,
    storedFileName: fileName,
    storagePath,
    mimeType: file.mimetype,
    fileSize: file.size,
    expiryDate: expiryDate || null,
    tags: tags || [],
  });

  return toDocumentResponse(document);
};

export const getDocuments = async (
  owner,
  {
    page = 1,
    limit = 10,
    category,
    search,
    sort = '-createdAt',
  } = {},
) => {
  const filter = { owner };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { originalFileName: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Document.countDocuments(filter),
  ]);

  return {
    documents: documents.map(toDocumentResponse),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDocument = async (documentId, ownerId) => {
  const document = await getOwnedDocument(documentId, ownerId);

  return toDocumentResponse(document);
};

export const previewDocument = (documentId, ownerId) =>
  getDocumentContent(documentId, ownerId);

export const downloadDocument = (documentId, ownerId) =>
  getDocumentContent(documentId, ownerId);



export const updateDocument = async ({
  documentId,
  ownerId,
  file,
  title,
  category,
  description,
  expiryDate,
  tags,
}) => {
  const document = await getOwnedDocument(documentId, ownerId);

  // --------------------
  // Update metadata
  // --------------------

  if (title !== undefined) {
    document.title = title;
  }

  if (category !== undefined) {
    document.category = category;
  }

  if (description !== undefined) {
    document.description = description;
  }

  if (expiryDate !== undefined) {
    document.expiryDate = expiryDate || null;
  }

  if (tags !== undefined) {
    document.tags = tags;
  }

  // --------------------
  // Replace uploaded file
  // --------------------

  if (file) {
    const oldStoragePath = document.storagePath;

    await replaceDocumentFile(document, file);

    await document.save();

    try {
      await deleteEncryptedDocument(oldStoragePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  } else {
    await document.save();
  }

  return toDocumentResponse(document);
};

export const deleteDocument = async (documentId, ownerId) => {
  const document = await getOwnedDocument(documentId, ownerId);

  try {
    await deleteEncryptedDocument(document.storagePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  await document.deleteOne();
};