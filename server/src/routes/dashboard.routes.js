import express from 'express';
import { getDashboardOverview } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/overview', protect, getDashboardOverview);
export default router;
