// ============================
// AssetFlow Type Definitions
// ============================

export type Role = 'Admin' | 'Department Head' | 'Asset Manager' | 'Employee';

export type AssetStatus = 'Active' | 'In Maintenance' | 'Transferred' | 'Returned' | 'Disposed';
export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type AssetCategory = 'Laptop' | 'Desktop' | 'Monitor' | 'Phone' | 'Tablet' | 'Printer' | 'Furniture' | 'Vehicle' | 'Projector' | 'Conference Room' | 'Other';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Allocated';
export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type BookingStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
export type ResourceType = 'Conference Room' | 'Projector' | 'Vehicle' | 'Shared Equipment';

export type MaintenanceStatus = 'Pending' | 'Approved' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TransferStatus = 'Pending Department Approval' | 'Pending Asset Manager' | 'Approved' | 'Completed' | 'Rejected';

export type ReturnStatus = 'Pending Return Inspection' | 'Approved' | 'Completed' | 'Rejected';

export type NotificationType =
  | 'asset_allocated'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'maintenance_approved'
  | 'maintenance_rejected'
  | 'transfer_approved'
  | 'transfer_rejected'
  | 'return_approved'
  | 'overdue_reminder'
  | 'general';

// ============================
// Core Entities
// ============================

export interface Asset {
  id: string;
  name: string;
  tag: string;
  category: AssetCategory;
  serialNumber: string;
  status: AssetStatus;
  condition: AssetCondition;
  location: string;
  allocatedTo: string | null; // userId
  allocationDate: string | null;
  expectedReturnDate: string | null;
  image: string; // emoji or placeholder
  value: number;
}

export interface AssetRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  category: AssetCategory;
  preferredAsset: string | null;
  reason: string;
  expectedReturnDate: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  employeeId: string;
  employeeName: string;
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  capacity?: number;
  available: boolean;
}

export interface MaintenanceRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  assetId: string;
  assetName: string;
  priority: MaintenancePriority;
  description: string;
  photo?: string;
  status: MaintenanceStatus;
  technicianName?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface TransferRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  assetId: string;
  assetName: string;
  transferTo: string; // name of employee or department
  transferType: 'Employee' | 'Department';
  reason: string;
  status: TransferStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface ReturnRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  assetId: string;
  assetName: string;
  notes: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: Role;
  employeeId: string;
  joinedDate: string;
  profilePicture: string;
}
