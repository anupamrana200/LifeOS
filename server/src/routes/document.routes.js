import { Router } from 'express';

import upload from '../config/multer.config.js';
import { DOCUMENT_UPLOAD_FIELD } from '../constants/document.constants.js';
import { 
  uploadDocument, 
  getDocuments,
  getDocument, 
  previewDocument, 
  downloadDocument, 
  deleteDocument, 
  updateDocument,
} from '../controllers/document.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import { uploadDocumentValidator, updateDocumentValidator } from '../validators/document.validator.js';

const router = Router();

router.get('/', protect, getDocuments);
router.get('/:documentId/preview', protect, previewDocument);
router.get('/:documentId/download', protect, downloadDocument);
router.get('/:documentId', protect, getDocument);

router.post(
  '/',
  protect,
  upload.single(DOCUMENT_UPLOAD_FIELD),
  uploadDocumentValidator,
  validateMiddleware,
  uploadDocument,
);

router.patch(
  '/:documentId',
  protect,
  upload.single(DOCUMENT_UPLOAD_FIELD),
  updateDocumentValidator,
  validateMiddleware,
  updateDocument,
);

router.delete('/:documentId', protect, deleteDocument);

export default router;