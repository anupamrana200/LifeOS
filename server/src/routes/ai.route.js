import express from 'express';

import { protect } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validate.middleware.js';

import { generateSummaryValidator } from '../validators/ai.validator.js';
import { generateSummary } from '../controllers/ai.controller.js';

const router = express.Router();

router.post(
  '/documents/:documentId/summary',
  protect,
  generateSummaryValidator,
  validateRequest,
  generateSummary,
);

export default router;