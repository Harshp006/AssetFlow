import prisma from "../utils/prisma";

export interface MaintenanceInput {
  assetId: number;
  issue: string;
  priority: string;
  status?: string;
}

export interface MaintenanceResponse {
  id: number;
  assetId: number;
  issue: string;
  status: string;
  priority: string;
  createdAt: string;
  completedAt: string | null;
}

const mapToMaintenanceResponse = (m: any): MaintenanceResponse => {
  return {
    id: m.id,
    assetId: m.assetId,
    issue: m.issue,
    status: m.status,
    priority: m.priority,
    createdAt: m.createdAt.toISOString(),
    completedAt: m.completedAt ? m.completedAt.toISOString() : null,
  };
};

export const createMaintenanceRepository = async (
  data: MaintenanceInput
): Promise<MaintenanceResponse> => {
  const m = await prisma.maintenance.create({
    data: {
      assetId: data.assetId,
      issue: data.issue,
      priority: data.priority,
      status: data.status || "PENDING",
    },
  });
  return mapToMaintenanceResponse(m);
};

export const getMaintenancesRepository = async (): Promise<MaintenanceResponse[]> => {
  const list = await prisma.maintenance.findMany({
    orderBy: { createdAt: "desc" },
  });
  return list.map(mapToMaintenanceResponse);
};

export const updateMaintenanceRepository = async (
  id: string,
  data: Partial<MaintenanceInput> & { status?: string; completedAt?: Date }
): Promise<MaintenanceResponse> => {
  const maintenanceId = parseInt(id, 10);
  if (isNaN(maintenanceId)) throw new Error("Invalid maintenance ID");

  const m = await prisma.maintenance.update({
    where: { id: maintenanceId },
    data: {
      status: data.status,
      priority: data.priority,
      issue: data.issue,
      completedAt: data.completedAt,
    },
  });
  return mapToMaintenanceResponse(m);
};

export const getMaintenanceByIdRepository = async (
  id: string
): Promise<MaintenanceResponse | null> => {
  const maintenanceId = parseInt(id, 10);
  if (isNaN(maintenanceId)) return null;

  const m = await prisma.maintenance.findUnique({
    where: { id: maintenanceId },
  });
  if (!m) return null;
  return mapToMaintenanceResponse(m);
};
