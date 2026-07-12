// ============================================================
// src/services/departmentHeadService.ts
// Service layer for Department Head module — ready for backend integration.
// All endpoints call the configured API_BASE_URL via axios.
// ============================================================

import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('af_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses
const handleError = (err: unknown): never => {
  const axiosErr = err as AxiosError<{ message?: string }>;
  if (axiosErr.response?.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  const msg = axiosErr.response?.data?.message || axiosErr.message || 'An unexpected error occurred';
  throw new Error(msg);
};

// ─── Types ──────────────────────────────────────────────────

export interface DeptDashboard {
  assetCount: number;
  assetsInUse: number;
  pendingRequests: number;
  maintenanceCount: number;
  employeeCount: number;
  recentActivity: ActivityItem[];
  notifications: NotificationItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  user: string;
  timestamp: string;
  type: 'asset' | 'maintenance' | 'request' | 'transfer';
}

export interface DeptAsset {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  serialNumber: string;
  status: 'Available' | 'Allocated' | 'Under Maintenance' | 'Reserved' | 'Lost' | 'Retired';
  location: string;
  assignedTo?: string;
  assignedToId?: string;
  acquisitionCost: number;
  acquisitionDate: string;
}

export interface DeptEmployee {
  id: string;
  name: string;
  email: string;
  designation: string;
  status: 'Active' | 'Inactive';
  assignedAssets: number;
  phone?: string;
  joinedAt: string;
}

export interface AssetRequest {
  id: string;
  assetId?: string;
  assetName?: string;
  requestedBy: string;
  requestedById: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  resolvedBy?: string;
  resolvedNote?: string;
}

export interface CreateAssetRequestPayload {
  assetId?: string;
  reason: string;
  priority: 'Low' | 'Medium' | 'High';
  targetEmployeeId?: string;
}

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  issue: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  technician?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CreateMaintenancePayload {
  assetId: string;
  issue: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface DeptReport {
  period: string;
  totalAssets: number;
  activeAssets: number;
  maintenanceCount: number;
  allocationCount: number;
  assetUtilization: number;
  maintenanceTrend: TrendPoint[];
  allocationSummary: AllocationSummaryItem[];
}

export interface TrendPoint {
  month: string;
  count: number;
}

export interface AllocationSummaryItem {
  status: string;
  count: number;
  percentage: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Service Methods ─────────────────────────────────────────

export const getDepartmentDashboard = async (): Promise<DeptDashboard> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: DeptDashboard }>('/dept-head/dashboard');
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getDepartmentAssets = async (
  page = 1,
  limit = 20,
  search = '',
  status = '',
): Promise<PaginatedResponse<DeptAsset>> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<DeptAsset> }>('/dept-head/assets', {
      params: { page, limit, search, status },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getDepartmentEmployees = async (
  page = 1,
  limit = 20,
  search = '',
): Promise<PaginatedResponse<DeptEmployee>> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<DeptEmployee> }>('/dept-head/employees', {
      params: { page, limit, search },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getDepartmentRequests = async (
  page = 1,
  limit = 20,
  status = '',
): Promise<PaginatedResponse<AssetRequest>> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<AssetRequest> }>('/dept-head/requests', {
      params: { page, limit, status },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const createAssetRequest = async (payload: CreateAssetRequestPayload): Promise<AssetRequest> => {
  try {
    const res = await apiClient.post<{ success: boolean; data: AssetRequest }>('/dept-head/requests', payload);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getDepartmentMaintenance = async (
  page = 1,
  limit = 20,
  status = '',
): Promise<PaginatedResponse<MaintenanceRequest>> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<MaintenanceRequest> }>('/dept-head/maintenance', {
      params: { page, limit, status },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const createMaintenanceRequest = async (payload: CreateMaintenancePayload): Promise<MaintenanceRequest> => {
  try {
    const res = await apiClient.post<{ success: boolean; data: MaintenanceRequest }>('/dept-head/maintenance', payload);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getDepartmentReports = async (period = '30d'): Promise<DeptReport> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: DeptReport }>('/dept-head/reports', {
      params: { period },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const getNotifications = async (
  page = 1,
  limit = 20,
  unreadOnly = false,
): Promise<PaginatedResponse<NotificationItem>> => {
  try {
    const res = await apiClient.get<{ success: boolean; data: PaginatedResponse<NotificationItem> }>('/dept-head/notifications', {
      params: { page, limit, unreadOnly },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const markNotificationRead = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/dept-head/notifications/${id}/read`);
  } catch (err) {
    return handleError(err);
  }
};

export const markAllNotificationsRead = async (): Promise<void> => {
  try {
    await apiClient.patch('/dept-head/notifications/read-all');
  } catch (err) {
    return handleError(err);
  }
};
