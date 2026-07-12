import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getAssetManagerDashboard,
  getAssets, createAsset, updateAsset, deleteAsset, assignAsset, unassignAsset,
  getRequests, resolveRequest,
  getMaintenance, createMaintenance, updateMaintenance,
  getReports,
} from '../controllers/assetManager.controller';

const router = Router();
router.use(authMiddleware);

router.get('/dashboard', getAssetManagerDashboard);

// Assets
router.get('/assets', getAssets);
router.post('/assets', createAsset);
router.put('/assets/:id', updateAsset);
router.delete('/assets/:id', deleteAsset);
router.patch('/assets/:id/assign', assignAsset);
router.patch('/assets/:id/unassign', unassignAsset);

// Requests
router.get('/requests', getRequests);
router.patch('/requests/:id/resolve', resolveRequest);

// Maintenance
router.get('/maintenance', getMaintenance);
router.post('/maintenance', createMaintenance);
router.patch('/maintenance/:id', updateMaintenance);

// Reports
router.get('/reports', getReports);

export default router;
