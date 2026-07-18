import express from 'express';

import { protect } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validate.middleware.js';

import {
  processDocumentValidator,
} from '../validators/ai.validator.js';

import {
  processDocumentController,
} from '../controllers/ai.controller.js';

const router = express.Router();

router.post(
  '/documents/:documentId/process',
  protect,
  processDocumentValidator,
  validateRequest,
  processDocumentController,
);

export default router;