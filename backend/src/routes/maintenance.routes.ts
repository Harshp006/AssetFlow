import { Router } from "express";
import {
  createMaintenance,
  getMaintenances,
  updateMaintenance,
} from "../controllers/maintenance.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  createMaintenanceValidator,
  updateMaintenanceValidator,
} from "../validators/maintenance.validator";

const router = Router();

// Protect all maintenance routes with JWT authentication middleware
router.use(authMiddleware);

router.get("/", getMaintenances);

router.post(
  "/",
  createMaintenanceValidator,
  validationMiddleware,
  createMaintenance
);

router.put(
  "/:id",
  updateMaintenanceValidator,
  validationMiddleware,
  updateMaintenance
);

export default router;
