import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import validationMiddleware from '../middlewares/validation.middleware';

const router = Router();

// Route for user registration
router.post('/register', registerValidator, validationMiddleware, register);

// Route for user login
router.post('/login', loginValidator, validationMiddleware, login);

export default router;
