import { Router } from 'express';

import { login, register, getCurrentUser, refresh, logout, logoutAll } from '../controllers/auth.controller.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';
import { protect } from '../middlewares/auth.middleware.js';



const router = Router();

router.post('/register', registerValidator, validateMiddleware, register);
router.post('/login', loginValidator, validateMiddleware, login);
router.get('/me', protect, getCurrentUser);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/logout-all', protect, logoutAll);

export default router;
