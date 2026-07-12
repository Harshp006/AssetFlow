import {
  createMaintenanceRepository,
  getMaintenancesRepository,
  updateMaintenanceRepository,
  getMaintenanceByIdRepository,
  MaintenanceInput,
  MaintenanceResponse,
} from "../repositories/maintenance.repository";
import { getAssetByIdRepository } from "../repositories/asset.repository";
import AppError from "../utils/AppError";

export const createMaintenanceService = async (
  data: MaintenanceInput
): Promise<MaintenanceResponse> => {
  // Validate asset exists
  const asset = await getAssetByIdRepository(String(data.assetId));
  if (!asset) {
    throw new AppError("Asset not found with the provided ID", 404);
  }

  return await createMaintenanceRepository(data);
};

export const getMaintenancesService = async (): Promise<MaintenanceResponse[]> => {
  return await getMaintenancesRepository();
};

export const updateMaintenanceService = async (
  id: string,
  data: Partial<MaintenanceInput> & { status?: string }
): Promise<MaintenanceResponse> => {
  const maintenance = await getMaintenanceByIdRepository(id);
  if (!maintenance) {
    throw new AppError("Maintenance record not found", 404);
  }

  let completedAt: Date | undefined;
  if (data.status === "COMPLETED" || data.status === "RESOLVED") {
    completedAt = new Date();
  }

  return await updateMaintenanceRepository(id, {
    ...data,
    completedAt,
  });
};
