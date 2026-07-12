import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { successResponse } from "../utils/response";
import {
  createMaintenanceService,
  getMaintenancesService,
  updateMaintenanceService,
} from "../services/maintenance.service";

export const createMaintenance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const maintenance = await createMaintenanceService(req.body);
    successResponse(res, "Maintenance request logged successfully", maintenance, 201);
  }
);

export const getMaintenances = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const list = await getMaintenancesService();
    successResponse(res, "Maintenance records fetched successfully", list, 200);
  }
);

export const updateMaintenance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const maintenance = await updateMaintenanceService(
      String(req.params.id),
      req.body
    );
    successResponse(res, "Maintenance request updated successfully", maintenance, 200);
  }
);
