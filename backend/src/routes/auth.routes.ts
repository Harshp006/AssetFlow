import { Router } from 'express';
import {
  registerAdminHandler,
  loginHandler,
  getMeHandler,
  createEmployeeHandler,
  listEmployeesHandler,
  updateRoleHandler,
  toggleActiveHandler,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register/admin', registerAdminHandler);
router.post('/login', loginHandler);

// Protected routes (requires valid JWT)
router.get('/me', authMiddleware, getMeHandler);

// Admin-only employee management
router.get('/employees', authMiddleware, listEmployeesHandler);
router.post('/employees', authMiddleware, createEmployeeHandler);
router.patch('/employees/:id/role', authMiddleware, updateRoleHandler);
router.patch('/employees/:id/toggle-active', authMiddleware, toggleActiveHandler);

export default router;
