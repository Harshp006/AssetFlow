import { storage } from '../storage';
import type {
  Asset, AssetRequest, Booking, Resource, MaintenanceRequest,
  TransferRequest, ReturnRequest, AppNotification, EmployeeProfile,
} from '../../types/models';

// ============================
// Seed Data
// ============================

// Read dynamically from stored auth so it works regardless of which employee logs in
function getEmployeeId(): string {
  try {
    const u = localStorage.getItem('current_user');
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed?.id) return String(parsed.id);
    }
  } catch (_) { /* ignore */ }
  return '4'; // fallback: Emma Employee seeded ID
}
function getEmployeeName(): string {
  try {
    const u = localStorage.getItem('current_user');
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed?.name) return parsed.name;
    }
  } catch (_) { /* ignore */ }
  return 'Emma Employee';
}

const seedAssets: Asset[] = [
  { id: 'ast-1', name: 'MacBook Pro 16"', tag: 'AST-2024-001', category: 'Laptop', serialNumber: 'SN-MBP-90281', status: 'Active', condition: 'Excellent', location: 'Floor 3 - Desk 12', allocatedTo: getEmployeeId(), allocationDate: '2025-11-15', expectedReturnDate: '2026-11-15', image: '💻', value: 2499 },
  { id: 'ast-2', name: 'Dell UltraSharp 27"', tag: 'AST-2024-045', category: 'Monitor', serialNumber: 'SN-DU27-38492', status: 'Active', condition: 'Good', location: 'Floor 3 - Desk 12', allocatedTo: getEmployeeId(), allocationDate: '2025-11-15', expectedReturnDate: '2027-01-15', image: '🖥️', value: 649 },
  { id: 'ast-3', name: 'iPhone 15 Pro', tag: 'AST-2024-112', category: 'Phone', serialNumber: 'SN-IP15-77231', status: 'Active', condition: 'Excellent', location: 'Employee Carry', allocatedTo: getEmployeeId(), allocationDate: '2026-01-10', expectedReturnDate: '2027-01-10', image: '📱', value: 1199 },
  { id: 'ast-4', name: 'Ergonomic Standing Desk', tag: 'AST-2024-201', category: 'Furniture', serialNumber: 'SN-ESD-55123', status: 'Active', condition: 'Good', location: 'Floor 3 - Desk 12', allocatedTo: getEmployeeId(), allocationDate: '2025-06-01', expectedReturnDate: '2028-06-01', image: '🪑', value: 899 },
  { id: 'ast-5', name: 'HP LaserJet Pro', tag: 'AST-2024-310', category: 'Printer', serialNumber: 'SN-HLP-22134', status: 'In Maintenance', condition: 'Fair', location: 'Floor 3 - Print Bay', allocatedTo: getEmployeeId(), allocationDate: '2025-08-20', expectedReturnDate: '2026-12-20', image: '🖨️', value: 399 },
];

const seedResources: Resource[] = [
  { id: 'res-1', name: 'Board Room A', type: 'Conference Room', location: 'Floor 5', capacity: 20, available: true },
  { id: 'res-2', name: 'Meeting Room B', type: 'Conference Room', location: 'Floor 3', capacity: 8, available: true },
  { id: 'res-3', name: 'Huddle Space C', type: 'Conference Room', location: 'Floor 2', capacity: 4, available: true },
  { id: 'res-4', name: 'Epson Projector #1', type: 'Projector', location: 'Floor 5 Storage', available: true },
  { id: 'res-5', name: 'Epson Projector #2', type: 'Projector', location: 'Floor 3 Storage', available: true },
  { id: 'res-6', name: 'Company Car - Toyota', type: 'Vehicle', location: 'Parking Lot B', available: true },
  { id: 'res-7', name: 'Company Van - Ford', type: 'Vehicle', location: 'Parking Lot A', available: true },
  { id: 'res-8', name: '3D Printer', type: 'Shared Equipment', location: 'Floor 1 Lab', available: true },
];

const seedBookings: Booking[] = [
  { id: 'bk-1', employeeId: getEmployeeId(), employeeName: getEmployeeName(), resourceId: 'res-1', resourceName: 'Board Room A', resourceType: 'Conference Room', date: '2026-07-14', startTime: '10:00', endTime: '11:00', purpose: 'Sprint Planning', status: 'Upcoming', createdAt: '2026-07-10T08:00:00Z' },
  { id: 'bk-2', employeeId: getEmployeeId(), employeeName: getEmployeeName(), resourceId: 'res-4', resourceName: 'Epson Projector #1', resourceType: 'Projector', date: '2026-07-15', startTime: '14:00', endTime: '16:00', purpose: 'Client Presentation', status: 'Upcoming', createdAt: '2026-07-10T09:00:00Z' },
  { id: 'bk-3', employeeId: getEmployeeId(), employeeName: getEmployeeName(), resourceId: 'res-2', resourceName: 'Meeting Room B', resourceType: 'Conference Room', date: '2026-07-11', startTime: '09:00', endTime: '10:00', purpose: 'Standup Meeting', status: 'Completed', createdAt: '2026-07-08T08:00:00Z' },
];

const seedRequests: AssetRequest[] = [
  { id: 'req-1', employeeId: getEmployeeId(), employeeName: getEmployeeName(), category: 'Tablet', preferredAsset: 'iPad Pro 12.9"', reason: 'Needed for field inspections and note-taking during client visits', expectedReturnDate: '2027-01-15', priority: 'Medium', status: 'Pending', createdAt: '2026-07-10T10:30:00Z', updatedAt: '2026-07-10T10:30:00Z' },
  { id: 'req-2', employeeId: getEmployeeId(), employeeName: getEmployeeName(), category: 'Monitor', preferredAsset: null, reason: 'Second monitor for improved productivity', expectedReturnDate: '2027-06-01', priority: 'Low', status: 'Approved', createdAt: '2026-06-20T14:00:00Z', updatedAt: '2026-06-25T09:00:00Z' },
];

const seedMaintenance: MaintenanceRequest[] = [
  { id: 'mnt-1', employeeId: getEmployeeId(), employeeName: getEmployeeName(), assetId: 'ast-5', assetName: 'HP LaserJet Pro', priority: 'High', description: 'Printer is jamming frequently and producing streaky prints.', status: 'In Progress', technicianName: 'John Technician', createdAt: '2026-07-05T11:00:00Z', updatedAt: '2026-07-08T16:00:00Z', timeline: [
    { id: 'te-1', status: 'Pending', description: 'Maintenance request submitted', timestamp: '2026-07-05T11:00:00Z', actor: getEmployeeName() },
    { id: 'te-2', status: 'Approved', description: 'Request approved by Asset Manager', timestamp: '2026-07-06T09:30:00Z', actor: 'Mark Manager' },
    { id: 'te-3', status: 'Assigned', description: 'Technician assigned: John Technician', timestamp: '2026-07-07T08:00:00Z', actor: 'Mark Manager' },
    { id: 'te-4', status: 'In Progress', description: 'Technician is inspecting the printer', timestamp: '2026-07-08T16:00:00Z', actor: 'John Technician' },
  ] },
];

const seedTransfers: TransferRequest[] = [
  { id: 'tf-1', employeeId: getEmployeeId(), employeeName: getEmployeeName(), assetId: 'ast-2', assetName: 'Dell UltraSharp 27"', transferTo: 'Design Department', transferType: 'Department', reason: 'No longer need dual-monitor setup, design team needs it more.', status: 'Pending Department Approval', createdAt: '2026-07-09T14:00:00Z', updatedAt: '2026-07-09T14:00:00Z', timeline: [
    { id: 'tte-1', status: 'Pending Department Approval', description: 'Transfer request submitted', timestamp: '2026-07-09T14:00:00Z', actor: getEmployeeName() },
  ] },
];

const seedReturns: ReturnRequest[] = [];

const seedNotifications: AppNotification[] = [
  { id: 'ntf-1', userId: getEmployeeId(), type: 'asset_allocated', title: 'Asset Allocated', message: 'iPhone 15 Pro has been allocated to you.', read: true, createdAt: '2026-01-10T09:00:00Z', link: '/employee/my-assets' },
  { id: 'ntf-2', userId: getEmployeeId(), type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Board Room A booked for Jul 14, 10:00 - 11:00.', read: false, createdAt: '2026-07-10T08:05:00Z', link: '/employee/bookings' },
  { id: 'ntf-3', userId: getEmployeeId(), type: 'maintenance_approved', title: 'Maintenance Approved', message: 'Maintenance for HP LaserJet Pro has been approved.', read: false, createdAt: '2026-07-06T09:35:00Z', link: '/employee/maintenance' },
  { id: 'ntf-4', userId: getEmployeeId(), type: 'overdue_reminder', title: 'Upcoming Return Reminder', message: 'HP LaserJet Pro expected return date is approaching (Dec 20, 2026).', read: false, createdAt: '2026-07-12T06:00:00Z', link: '/employee/my-assets' },
  { id: 'ntf-5', userId: getEmployeeId(), type: 'general', title: 'Welcome to AssetFlow', message: 'Your employee portal is ready. Explore your assets and bookings.', read: true, createdAt: '2025-11-15T09:00:00Z' },
];

const seedProfile: EmployeeProfile = {
  id: getEmployeeId(),
  name: getEmployeeName(),
  email: 'employee@assetflow.com',
  phone: '+1 (555) 987-6543',
  department: 'Engineering',
  role: 'Employee',
  employeeId: 'EMP-2024-0042',
  joinedDate: '2024-03-15',
  profilePicture: '',
};

// ============================
// Init
// ============================

export function initializeEmployeeData(): void {
  if (!storage.get('emp_assets')) storage.set('emp_assets', seedAssets);
  if (!storage.get('emp_resources')) storage.set('emp_resources', seedResources);
  if (!storage.get('emp_bookings')) storage.set('emp_bookings', seedBookings);
  if (!storage.get('emp_requests')) storage.set('emp_requests', seedRequests);
  if (!storage.get('emp_maintenance')) storage.set('emp_maintenance', seedMaintenance);
  if (!storage.get('emp_transfers')) storage.set('emp_transfers', seedTransfers);
  if (!storage.get('emp_returns')) storage.set('emp_returns', seedReturns);
  if (!storage.get('emp_notifications')) storage.set('emp_notifications', seedNotifications);
  if (!storage.get('emp_profile')) storage.set('emp_profile', seedProfile);
}

// ============================
// CRUD Helpers
// ============================

function getList<T>(key: string): T[] {
  return storage.get<T[]>(key) ?? [];
}
function setList<T>(key: string, data: T[]): void {
  storage.set(key, data);
}

// -- Assets
export function getMyAssets(): Asset[] {
  return getList<Asset>('emp_assets').filter(a => a.allocatedTo === getEmployeeId() && a.status !== 'Returned');
}

// -- Requests
export function getAssetRequests(): AssetRequest[] {
  return getList<AssetRequest>('emp_requests').filter(r => r.employeeId === getEmployeeId());
}
export function createAssetRequest(req: Omit<AssetRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'createdAt' | 'updatedAt'>): AssetRequest {
  const list = getList<AssetRequest>('emp_requests');
  const now = new Date().toISOString();
  const newReq: AssetRequest = { ...req, id: `req-${Date.now()}`, employeeId: getEmployeeId(), employeeName: getEmployeeName(), status: 'Pending', createdAt: now, updatedAt: now };
  list.unshift(newReq);
  setList('emp_requests', list);
  addNotification({ type: 'general', title: 'Asset Request Submitted', message: `Your request for ${req.category} has been submitted.`, link: '/employee/request-asset' });
  return newReq;
}

// -- Bookings
export function getBookings(): Booking[] {
  return getList<Booking>('emp_bookings').filter(b => b.employeeId === getEmployeeId());
}
export function getResources(): Resource[] {
  return getList<Resource>('emp_resources');
}
export function checkBookingConflict(resourceId: string, date: string, startTime: string, endTime: string, excludeId?: string): boolean {
  const bookings = getList<Booking>('emp_bookings');
  return bookings.some(b => {
    if (b.id === excludeId) return false;
    if (b.resourceId !== resourceId || b.date !== date || b.status === 'Cancelled') return false;
    return startTime < b.endTime && endTime > b.startTime;
  });
}
export function createBooking(bk: Omit<Booking, 'id' | 'employeeId' | 'employeeName' | 'status' | 'createdAt'>): Booking | null {
  if (checkBookingConflict(bk.resourceId, bk.date, bk.startTime, bk.endTime)) return null;
  const list = getList<Booking>('emp_bookings');
  const newBk: Booking = { ...bk, id: `bk-${Date.now()}`, employeeId: getEmployeeId(), employeeName: getEmployeeName(), status: 'Upcoming', createdAt: new Date().toISOString() };
  list.unshift(newBk);
  setList('emp_bookings', list);
  addNotification({ type: 'booking_confirmed', title: 'Booking Confirmed', message: `${bk.resourceName} booked for ${bk.date}, ${bk.startTime} - ${bk.endTime}.`, link: '/employee/bookings' });
  return newBk;
}
export function cancelBooking(id: string): void {
  const list = getList<Booking>('emp_bookings');
  const idx = list.findIndex(b => b.id === id);
  if (idx >= 0) { list[idx].status = 'Cancelled'; setList('emp_bookings', list); addNotification({ type: 'booking_cancelled', title: 'Booking Cancelled', message: `Booking for ${list[idx].resourceName} on ${list[idx].date} was cancelled.`, link: '/employee/bookings' }); }
}
export function rescheduleBooking(id: string, date: string, startTime: string, endTime: string): boolean {
  const list = getList<Booking>('emp_bookings');
  const bk = list.find(b => b.id === id);
  if (!bk) return false;
  if (checkBookingConflict(bk.resourceId, date, startTime, endTime, id)) return false;
  bk.date = date; bk.startTime = startTime; bk.endTime = endTime;
  setList('emp_bookings', list);
  return true;
}

// -- Maintenance
export function getMaintenanceRequests(): MaintenanceRequest[] {
  return getList<MaintenanceRequest>('emp_maintenance').filter(m => m.employeeId === getEmployeeId());
}
export function createMaintenanceRequest(req: { assetId: string; assetName: string; priority: MaintenanceRequest['priority']; description: string }): MaintenanceRequest {
  const list = getList<MaintenanceRequest>('emp_maintenance');
  const now = new Date().toISOString();
  const newReq: MaintenanceRequest = { id: `mnt-${Date.now()}`, employeeId: getEmployeeId(), employeeName: getEmployeeName(), ...req, status: 'Pending', createdAt: now, updatedAt: now, timeline: [{ id: `te-${Date.now()}`, status: 'Pending', description: 'Maintenance request submitted', timestamp: now, actor: getEmployeeName() }] };
  list.unshift(newReq);
  setList('emp_maintenance', list);
  addNotification({ type: 'general', title: 'Maintenance Submitted', message: `Maintenance request for ${req.assetName} submitted.`, link: '/employee/maintenance' });
  return newReq;
}

// -- Transfers
export function getTransferRequests(): TransferRequest[] {
  return getList<TransferRequest>('emp_transfers').filter(t => t.employeeId === getEmployeeId());
}
export function createTransferRequest(req: { assetId: string; assetName: string; transferTo: string; transferType: 'Employee' | 'Department'; reason: string }): TransferRequest {
  const list = getList<TransferRequest>('emp_transfers');
  const now = new Date().toISOString();
  const newReq: TransferRequest = { id: `tf-${Date.now()}`, employeeId: getEmployeeId(), employeeName: getEmployeeName(), ...req, status: 'Pending Department Approval', createdAt: now, updatedAt: now, timeline: [{ id: `tte-${Date.now()}`, status: 'Pending Department Approval', description: 'Transfer request submitted', timestamp: now, actor: getEmployeeName() }] };
  list.unshift(newReq);
  setList('emp_transfers', list);
  addNotification({ type: 'general', title: 'Transfer Request Submitted', message: `Transfer request for ${req.assetName} submitted.`, link: '/employee/transfers' });
  return newReq;
}

// -- Returns
export function getReturnRequests(): ReturnRequest[] {
  return getList<ReturnRequest>('emp_returns').filter(r => r.employeeId === getEmployeeId());
}
export function createReturnRequest(req: { assetId: string; assetName: string; notes: string }): ReturnRequest {
  const list = getList<ReturnRequest>('emp_returns');
  const now = new Date().toISOString();
  const newReq: ReturnRequest = { id: `rt-${Date.now()}`, employeeId: getEmployeeId(), employeeName: getEmployeeName(), ...req, status: 'Pending Return Inspection', createdAt: now, updatedAt: now, timeline: [{ id: `rte-${Date.now()}`, status: 'Pending Return Inspection', description: 'Return request submitted', timestamp: now, actor: getEmployeeName() }] };
  list.unshift(newReq);
  setList('emp_returns', list);
  addNotification({ type: 'general', title: 'Return Submitted', message: `Return request for ${req.assetName} submitted.`, link: '/employee/returns' });
  return newReq;
}

// -- Notifications
export function getNotifications(): AppNotification[] {
  return getList<AppNotification>('emp_notifications').filter(n => n.userId === getEmployeeId());
}
export function getUnreadCount(): number {
  return getNotifications().filter(n => !n.read).length;
}
export function markRead(id: string): void {
  const list = getList<AppNotification>('emp_notifications');
  const n = list.find(x => x.id === id);
  if (n) { n.read = true; setList('emp_notifications', list); }
}
export function markAllRead(): void {
  const list = getList<AppNotification>('emp_notifications');
  list.forEach(n => { if (n.userId === getEmployeeId()) n.read = true; });
  setList('emp_notifications', list);
}
export function addNotification(partial: { type: AppNotification['type']; title: string; message: string; link?: string }): void {
  const list = getList<AppNotification>('emp_notifications');
  const n: AppNotification = { id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, userId: getEmployeeId(), read: false, createdAt: new Date().toISOString(), ...partial };
  list.unshift(n);
  setList('emp_notifications', list);
}

// -- Profile
export function getProfile(): EmployeeProfile {
  return storage.get<EmployeeProfile>('emp_profile') ?? seedProfile;
}
export function updateProfile(updates: Partial<Pick<EmployeeProfile, 'phone' | 'profilePicture'>>): EmployeeProfile {
  const p = getProfile();
  const updated = { ...p, ...updates };
  storage.set('emp_profile', updated);
  return updated;
}
