import { Router } from 'express';

import { login, register } from '../controllers/auth.controller.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidator, validateMiddleware, register);
router.post('/login', loginValidator, validateMiddleware, login);

export default router;
