import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getEmployeeDashboard, getMyAssets,
  getMyRequests, createMyRequest,
  getMyNotifications, markMyNotifRead,
  getMyProfile,
} from '../controllers/employee.controller';

const router = Router();
router.use(authMiddleware);

router.get('/dashboard', getEmployeeDashboard);
router.get('/my-assets', getMyAssets);
router.get('/requests', getMyRequests);
router.post('/requests', createMyRequest);
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markMyNotifRead);
router.get('/profile', getMyProfile);

export default router;
