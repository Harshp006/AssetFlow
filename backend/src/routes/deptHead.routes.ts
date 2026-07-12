import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getDeptHeadDashboard, getDeptAssets, getDeptEmployees,
  getDeptRequests, resolveDeptRequest,
  getDeptMaintenance, createDeptMaintenance,
  getDeptReports,
  getDeptNotifications, markNotifRead, markAllNotifsRead,
} from '../controllers/deptHead.controller';

const router = Router();
router.use(authMiddleware);

router.get('/dashboard', getDeptHeadDashboard);
router.get('/assets', getDeptAssets);
router.get('/employees', getDeptEmployees);
router.get('/requests', getDeptRequests);
router.patch('/requests/:id/resolve', resolveDeptRequest);
router.get('/maintenance', getDeptMaintenance);
router.post('/maintenance', createDeptMaintenance);
router.get('/reports', getDeptReports);
router.get('/notifications', getDeptNotifications);
router.patch('/notifications/:id/read', markNotifRead);
router.patch('/notifications/read-all', markAllNotifsRead);

export default router;
