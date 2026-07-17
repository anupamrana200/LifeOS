import asyncHandler from '../utils/asyncHandler.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import sendResponse from '../utils/apiResponse.js';
import * as documentService from '../services/document.service.js';

export const uploadDocument = asyncHandler(async (req, res) => {
  const document = await documentService.createDocument({
    owner: req.user._id,
    file: req.file,

    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    expiryDate: req.body.expiryDate,
    tags: req.body.tags,
  });

  return sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Document uploaded successfully.',
    data: {
      document,
    },
  });
});

export const getDocuments = asyncHandler(async (req, res) => {
  const result = await documentService.getDocuments(req.user._id, {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    category: req.query.category,
    search: req.query.search,
    sort: req.query.sort,
  });

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Documents retrieved successfully.',
    data: result,
  });
});

export const getDocument = asyncHandler(async (req, res) => {
  const document = await documentService.getDocument(
    req.params.documentId,
    req.user._id,
  );

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Document retrieved successfully.',
    data: {
      document,
    },
  });
});

export const previewDocument = asyncHandler(async (req, res) => {
  const { buffer, mimeType } = await documentService.previewDocument(
    req.params.documentId,
    req.user._id,
  );

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', buffer.length);

  return res.send(buffer);
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const { buffer, mimeType, originalFileName } =
    await documentService.downloadDocument(
      req.params.documentId,
      req.user._id,
    );

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', buffer.length);

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${originalFileName}"`,
  );

  return res.send(buffer);
});

export const updateDocument = asyncHandler(async (req, res) => {
  const document = await documentService.updateDocument({
    documentId: req.params.documentId,
    ownerId: req.user._id,

    file: req.file,

    ...req.body,
  });

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Document updated successfully.',
    data: {
      document,
    },
  });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(
    req.params.documentId,
    req.user._id,
  );

  return sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Document deleted successfully.',
  });
});