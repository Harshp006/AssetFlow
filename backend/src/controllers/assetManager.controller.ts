import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/response';
import AppError from '../utils/AppError';

const getCompanyId = (req: Request): number => {
  const cid = (req.user as any)?.companyId;
  if (!cid) throw new AppError('Unauthorized', 401);
  return parseInt(cid, 10);
};

const getUserId = (req: Request): number => {
  const uid = req.user?.userId;
  if (!uid) throw new AppError('Unauthorized', 401);
  return parseInt(String(uid), 10);
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getAssetManagerDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);

  const [totalAssets, availableAssets, allocatedAssets, maintenanceAssets, pendingRequests, totalEmployees, recentAssets, recentRequests] = await Promise.all([
    prisma.asset.count({ where: { companyId } }),
    prisma.asset.count({ where: { companyId, status: 'Available' } }),
    prisma.asset.count({ where: { companyId, status: 'Allocated' } }),
    prisma.asset.count({ where: { companyId, status: 'Under Maintenance' } }),
    prisma.assetRequest.count({ where: { requestedBy: { companyId }, status: 'Pending' } }),
    prisma.user.count({ where: { companyId, isActive: true } }),
    prisma.asset.findMany({
      where: { companyId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { name: true, employeeCode: true } } },
    }),
    prisma.assetRequest.findMany({
      where: { requestedBy: { companyId } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { requestedBy: { select: { name: true, employeeCode: true } }, asset: true },
    }),
  ]);

  const totalValue = await prisma.asset.aggregate({ where: { companyId }, _sum: { acquisitionCost: true } });

  successResponse(res, 'Dashboard loaded.', {
    totalAssets,
    availableAssets,
    allocatedAssets,
    maintenanceAssets,
    pendingRequests,
    totalEmployees,
    totalValue: totalValue._sum.acquisitionCost || 0,
    recentAssets: recentAssets.map(a => ({
      id: a.id, name: a.name, assetTag: a.assetTag, status: a.status,
      assignedTo: a.assignedTo?.name, createdAt: a.createdAt,
    })),
    recentRequests: recentRequests.map(r => ({
      id: r.id, requestedBy: r.requestedBy.name, assetName: r.asset?.name,
      reason: r.reason, status: r.status, priority: r.priority, createdAt: r.createdAt,
    })),
  });
});

// ─── Assets CRUD ─────────────────────────────────────────────────────────────
export const getAssets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { search = '', status = '', page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { companyId };
  if (status) where.status = status;
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { assetTag: { contains: search, mode: 'insensitive' } },
    { serialNumber: { contains: search, mode: 'insensitive' } },
  ];

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { id: true, name: true, employeeCode: true, role: true } } },
    }),
    prisma.asset.count({ where }),
  ]);

  successResponse(res, 'Assets retrieved.', {
    data: assets, total, page: parseInt(page),
    limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)),
  });
});

export const createAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { name, serialNumber, category, acquisitionCost, location, description, assetTag, status } = req.body;

  if (!name || !serialNumber) throw new AppError('Name and serial number are required.', 400);

  const exists = await prisma.asset.findFirst({ where: { companyId, serialNumber } });
  if (exists) throw new AppError('An asset with this serial number already exists.', 400);

  const maxTag = await prisma.asset.count({ where: { companyId } });
  const generatedTag = assetTag || `AST-${String(maxTag + 1).padStart(4, '0')}`;

  const asset = await prisma.asset.create({
    data: {
      companyId, name, serialNumber, category: category || 'General',
      acquisitionCost: parseFloat(acquisitionCost) || 0,
      location: location || 'HQ Office',
      description, assetTag: generatedTag,
      status: status || 'Available',
    },
  });

  successResponse(res, 'Asset created.', asset, 201);
});

export const updateAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const id = parseInt(req.params.id as string, 10);
  const asset = await prisma.asset.findFirst({ where: { id, companyId } });
  if (!asset) throw new AppError('Asset not found.', 404);

  const updated = await prisma.asset.update({
    where: { id },
    data: req.body,
    include: { assignedTo: { select: { id: true, name: true, employeeCode: true } } },
  });
  successResponse(res, 'Asset updated.', updated);
});

export const deleteAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const id = parseInt(req.params.id as string, 10);
  const asset = await prisma.asset.findFirst({ where: { id, companyId } });
  if (!asset) throw new AppError('Asset not found.', 404);

  await prisma.asset.delete({ where: { id } });
  successResponse(res, 'Asset deleted.', null);
});

export const assignAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const id = parseInt(req.params.id as string, 10);
  const { employeeId } = req.body;

  const asset = await prisma.asset.findFirst({ where: { id, companyId } });
  if (!asset) throw new AppError('Asset not found.', 404);

  const employee = await prisma.user.findFirst({ where: { id: parseInt(employeeId), companyId } });
  if (!employee) throw new AppError('Employee not found.', 404);

  const updated = await prisma.asset.update({
    where: { id },
    data: { assignedToId: parseInt(employeeId), status: 'Allocated' },
    include: { assignedTo: { select: { name: true, employeeCode: true } } },
  });
  successResponse(res, 'Asset assigned.', updated);
});

export const unassignAsset = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const id = parseInt(req.params.id as string, 10);
  const asset = await prisma.asset.findFirst({ where: { id, companyId } });
  if (!asset) throw new AppError('Asset not found.', 404);

  const updated = await prisma.asset.update({
    where: { id },
    data: { assignedToId: null, status: 'Available' },
  });
  successResponse(res, 'Asset unassigned.', updated);
});

// ─── Asset Requests ───────────────────────────────────────────────────────────
export const getRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { status = '', page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { requestedBy: { companyId } };
  if (status) where.status = status;

  const [requests, total] = await Promise.all([
    prisma.assetRequest.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        requestedBy: { select: { id: true, name: true, employeeCode: true, role: true } },
        asset: true,
        resolvedBy: { select: { name: true } },
      },
    }),
    prisma.assetRequest.count({ where }),
  ]);

  successResponse(res, 'Requests retrieved.', {
    data: requests, total, page: parseInt(page),
    limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)),
  });
});

export const resolveRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const userId = getUserId(req);
  const id = parseInt(req.params.id as string, 10);
  const { status, resolvedNote, assetId } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) throw new AppError('Status must be Approved or Rejected.', 400);

  const request = await prisma.assetRequest.findFirst({
    where: { id, requestedBy: { companyId } },
  });
  if (!request) throw new AppError('Request not found.', 404);

  const data: any = { status, resolvedById: userId, resolvedNote };
  if (status === 'Approved' && assetId) {
    data.assetId = parseInt(assetId);
    // Auto-assign
    await prisma.asset.update({
      where: { id: parseInt(assetId) },
      data: { assignedToId: request.requestedById, status: 'Allocated' },
    });
  }

  const updated = await prisma.assetRequest.update({ where: { id }, data });
  successResponse(res, `Request ${status}.`, updated);
});

// ─── Maintenance ──────────────────────────────────────────────────────────────
export const getMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { status = '', page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { asset: { companyId } };
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.maintenance.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: { asset: { select: { id: true, name: true, assetTag: true } } },
    }),
    prisma.maintenance.count({ where }),
  ]);

  successResponse(res, 'Maintenance records retrieved.', {
    data: items, total, page: parseInt(page),
    limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)),
  });
});

export const createMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { assetId, issue, priority } = req.body;

  if (!assetId || !issue) throw new AppError('Asset ID and issue are required.', 400);

  const asset = await prisma.asset.findFirst({ where: { id: parseInt(assetId), companyId } });
  if (!asset) throw new AppError('Asset not found.', 404);

  const maintenance = await prisma.maintenance.create({
    data: { assetId: parseInt(assetId), issue, priority: priority || 'MEDIUM' },
  });

  await prisma.asset.update({ where: { id: parseInt(assetId) }, data: { status: 'Under Maintenance' } });

  successResponse(res, 'Maintenance record created.', maintenance, 201);
});

export const updateMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const id = parseInt(req.params.id as string, 10);
  const { status, technicianNote } = req.body;

  const record = await prisma.maintenance.findFirst({ where: { id, asset: { companyId } } });
  if (!record) throw new AppError('Maintenance record not found.', 404);

  const data: any = { status };
  if (technicianNote) data.technicianNote = technicianNote;
  if (status === 'COMPLETED') {
    data.completedAt = new Date();
    await prisma.asset.update({ where: { id: record.assetId }, data: { status: 'Available' } });
  }

  const updated = await prisma.maintenance.update({ where: { id }, data });
  successResponse(res, 'Maintenance updated.', updated);
});

// ─── Reports ──────────────────────────────────────────────────────────────────
export const getReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);

  const [totalAssets, allocated, available, underMaintenance, retired, totalValue, requestStats, userCount] = await Promise.all([
    prisma.asset.count({ where: { companyId } }),
    prisma.asset.count({ where: { companyId, status: 'Allocated' } }),
    prisma.asset.count({ where: { companyId, status: 'Available' } }),
    prisma.asset.count({ where: { companyId, status: 'Under Maintenance' } }),
    prisma.asset.count({ where: { companyId, status: 'Retired' } }),
    prisma.asset.aggregate({ where: { companyId }, _sum: { acquisitionCost: true } }),
    prisma.assetRequest.groupBy({ by: ['status'], where: { requestedBy: { companyId } }, _count: true }),
    prisma.user.count({ where: { companyId, isActive: true } }),
  ]);

  const categoryBreakdown = await prisma.asset.groupBy({
    by: ['category'], where: { companyId }, _count: true,
  });

  successResponse(res, 'Reports generated.', {
    overview: {
      totalAssets, allocated, available, underMaintenance, retired,
      totalValue: totalValue._sum.acquisitionCost || 0,
      utilizationRate: totalAssets > 0 ? Math.round((allocated / totalAssets) * 100) : 0,
      totalEmployees: userCount,
    },
    allocationSummary: [
      { status: 'Allocated', count: allocated },
      { status: 'Available', count: available },
      { status: 'Under Maintenance', count: underMaintenance },
      { status: 'Retired', count: retired },
    ],
    categoryBreakdown: categoryBreakdown.map(c => ({ category: c.category, count: c._count })),
    requestStats,
  });
});
