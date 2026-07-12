import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/response';
import AppError from '../utils/AppError';

const getIds = (req: Request) => {
  const userId = parseInt(String(req.user?.userId), 10);
  const companyId = parseInt(String((req.user as any)?.companyId), 10);
  if (!userId || !companyId) throw new AppError('Unauthorized', 401);
  return { userId, companyId };
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getEmployeeDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId, companyId } = getIds(req);

  const [myAssets, myPendingRequests, myNotifications] = await Promise.all([
    prisma.asset.findMany({
      where: { assignedToId: userId },
      select: { id: true, name: true, assetTag: true, status: true, category: true, location: true },
    }),
    prisma.assetRequest.count({ where: { requestedById: userId, status: 'Pending' } }),
    prisma.notification.findMany({
      where: { userId, isRead: false }, take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  successResponse(res, 'Dashboard loaded.', {
    myAssetCount: myAssets.length,
    pendingRequests: myPendingRequests,
    unreadNotifications: myNotifications.length,
    myAssets,
    recentNotifications: myNotifications,
  });
});

// ─── My Assets ────────────────────────────────────────────────────────────────
export const getMyAssets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = getIds(req);

  const assets = await prisma.asset.findMany({
    where: { assignedToId: userId },
    orderBy: { createdAt: 'desc' },
  });

  successResponse(res, 'My assets retrieved.', assets);
});

// ─── Asset Requests ───────────────────────────────────────────────────────────
export const getMyRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = getIds(req);

  const requests = await prisma.assetRequest.findMany({
    where: { requestedById: userId },
    orderBy: { createdAt: 'desc' },
    include: { asset: true, resolvedBy: { select: { name: true } } },
  });

  successResponse(res, 'My requests retrieved.', requests);
});

export const createMyRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = getIds(req);
  const { reason, priority, assetType } = req.body;

  if (!reason) throw new AppError('Reason is required.', 400);

  const request = await prisma.assetRequest.create({
    data: {
      requestedById: userId,
      reason,
      priority: priority || 'Medium',
      assetType: assetType || null,
    },
  });

  successResponse(res, 'Request submitted successfully.', request, 201);
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const getMyNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = getIds(req);

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  successResponse(res, 'Notifications retrieved.', notifications);
});

export const markMyNotifRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = getIds(req);
  const id = parseInt(req.params.id as string);

  const notif = await prisma.notification.findFirst({ where: { id, userId } });
  if (!notif) throw new AppError('Notification not found.', 404);

  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  successResponse(res, 'Notification marked as read.', null);
});

// ─── Profile ──────────────────────────────────────────────────────────────────
export const getMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = getIds(req);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, employeeCode: true,
      role: true, isActive: true, createdAt: true,
      company: { select: { name: true, companyCode: true } },
      _count: { select: { assets: true, requestedRequests: true } },
    },
  });

  if (!user) throw new AppError('User not found.', 404);
  successResponse(res, 'Profile retrieved.', user);
});
