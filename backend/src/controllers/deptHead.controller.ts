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

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDeptHeadDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);

  const [assetCount, assetsInUse, pendingRequests, maintenanceCount, employeeCount, notifications] = await Promise.all([
    prisma.asset.count({ where: { companyId } }),
    prisma.asset.count({ where: { companyId, status: 'Allocated' } }),
    prisma.assetRequest.count({ where: { requestedBy: { companyId }, status: 'Pending' } }),
    prisma.maintenance.count({ where: { asset: { companyId }, status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
    prisma.user.count({ where: { companyId, role: 'EMPLOYEE', isActive: true } }),
    prisma.notification.findMany({
      where: { user: { companyId } }, take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, message: true, isRead: true, priority: true, type: true, createdAt: true },
    }),
  ]);

  const recentRequests = await prisma.assetRequest.findMany({
    where: { requestedBy: { companyId } }, take: 5,
    orderBy: { createdAt: 'desc' },
    include: { requestedBy: { select: { name: true } }, asset: true },
  });

  const recentActivity = recentRequests.map(r => ({
    id: `req-${r.id}`,
    action: r.status === 'Pending' ? 'requested' : r.status.toLowerCase(),
    target: r.asset?.name || 'General Asset',
    user: r.requestedBy.name,
    timestamp: r.createdAt.toISOString(),
    type: 'request' as const,
  }));

  successResponse(res, 'Dashboard loaded.', {
    assetCount, assetsInUse, pendingRequests, maintenanceCount, employeeCount, recentActivity, notifications,
  });
});

// ─── Assets ───────────────────────────────────────────────────────────────────
export const getDeptAssets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { search = '', status = '', page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { companyId };
  if (status) where.status = status;
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { assetTag: { contains: search, mode: 'insensitive' } },
  ];

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { name: true, employeeCode: true } } },
    }),
    prisma.asset.count({ where }),
  ]);

  successResponse(res, 'Assets retrieved.', {
    data: assets.map(a => ({
      id: a.id, assetTag: a.assetTag, name: a.name, category: a.category,
      serialNumber: a.serialNumber, status: a.status, location: a.location,
      assignedTo: a.assignedTo?.name, acquisitionCost: a.acquisitionCost,
    })),
    total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)),
  });
});

// ─── Employees ────────────────────────────────────────────────────────────────
export const getDeptEmployees = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { search = '', page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { companyId };
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { employeeCode: { contains: search, mode: 'insensitive' } },
  ];

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, name: true, email: true, employeeCode: true,
        role: true, isActive: true, createdAt: true,
        _count: { select: { assets: true, requestedRequests: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  successResponse(res, 'Employees retrieved.', {
    data: users.map(u => ({
      id: u.id, name: u.name, email: u.email, employeeCode: u.employeeCode,
      role: u.role, isActive: u.isActive, joinedAt: u.createdAt,
      assignedAssets: u._count.assets, totalRequests: u._count.requestedRequests,
    })),
    total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)),
  });
});

// ─── Requests ─────────────────────────────────────────────────────────────────
export const getDeptRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
        requestedBy: { select: { id: true, name: true, employeeCode: true } },
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

export const resolveDeptRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const userId = getUserId(req);
  const id = parseInt(req.params.id as string);
  const { status, resolvedNote } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) throw new AppError('Status must be Approved or Rejected.', 400);

  const request = await prisma.assetRequest.findFirst({ where: { id, requestedBy: { companyId } } });
  if (!request) throw new AppError('Request not found.', 404);

  const updated = await prisma.assetRequest.update({
    where: { id }, data: { status, resolvedById: userId, resolvedNote },
  });
  successResponse(res, `Request ${status}.`, updated);
});

// ─── Maintenance ──────────────────────────────────────────────────────────────
export const getDeptMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

export const createDeptMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const { assetId, issue, priority } = req.body;

  if (!assetId || !issue) throw new AppError('Asset ID and issue are required.', 400);
  const asset = await prisma.asset.findFirst({ where: { id: parseInt(assetId), companyId } });
  if (!asset) throw new AppError('Asset not found.', 404);

  const maintenance = await prisma.maintenance.create({
    data: { assetId: parseInt(assetId), issue, priority: priority || 'MEDIUM' },
  });
  await prisma.asset.update({ where: { id: parseInt(assetId) }, data: { status: 'Under Maintenance' } });
  successResponse(res, 'Maintenance request created.', maintenance, 201);
});

// ─── Reports ──────────────────────────────────────────────────────────────────
export const getDeptReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);

  const [totalAssets, allocated, available, underMaint, totalVal, requestStats] = await Promise.all([
    prisma.asset.count({ where: { companyId } }),
    prisma.asset.count({ where: { companyId, status: 'Allocated' } }),
    prisma.asset.count({ where: { companyId, status: 'Available' } }),
    prisma.asset.count({ where: { companyId, status: 'Under Maintenance' } }),
    prisma.asset.aggregate({ where: { companyId }, _sum: { acquisitionCost: true } }),
    prisma.assetRequest.groupBy({ by: ['status'], where: { requestedBy: { companyId } }, _count: true }),
  ]);

  successResponse(res, 'Reports generated.', {
    totalAssets, allocated, available, underMaintenance: underMaint,
    totalValue: totalVal._sum.acquisitionCost || 0,
    utilizationRate: totalAssets > 0 ? Math.round((allocated / totalAssets) * 100) : 0,
    allocationSummary: [
      { status: 'Allocated', count: allocated, percentage: totalAssets ? Math.round((allocated / totalAssets) * 100) : 0 },
      { status: 'Available', count: available, percentage: totalAssets ? Math.round((available / totalAssets) * 100) : 0 },
      { status: 'Under Maintenance', count: underMaint, percentage: totalAssets ? Math.round((underMaint / totalAssets) * 100) : 0 },
    ],
    requestStats,
  });
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const getDeptNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = getCompanyId(req);
  const userId = getUserId(req);
  const { unreadOnly = 'false', page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { userId };
  if (unreadOnly === 'true') where.isRead = false;

  const [notifs, total] = await Promise.all([
    prisma.notification.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.notification.count({ where }),
  ]);

  successResponse(res, 'Notifications retrieved.', {
    data: notifs, total, page: parseInt(page),
    limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)),
  });
});

export const markNotifRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  const id = parseInt(req.params.id as string);
  const notif = await prisma.notification.findFirst({ where: { id, userId } });
  if (!notif) throw new AppError('Notification not found.', 404);
  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  successResponse(res, 'Notification marked as read.', null);
});

export const markAllNotifsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req);
  await prisma.notification.updateMany({ where: { userId }, data: { isRead: true } });
  successResponse(res, 'All notifications marked as read.', null);
});
