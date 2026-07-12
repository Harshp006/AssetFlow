import { storage } from './storage';

export type Role = 'Admin' | 'Department Head' | 'Asset Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export const predefinedUsers: User[] = [
  { id: '1', name: 'Alice Admin', email: 'admin@assetflow.com', role: 'Admin' },
  { id: '2', name: 'David DeptHead', email: 'd.head@assetflow.com', role: 'Department Head' },
  { id: '3', name: 'Mark Manager', email: 'manager@assetflow.com', role: 'Asset Manager' },
  { id: '4', name: 'Emma Employee', email: 'employee@assetflow.com', role: 'Employee' },
];

export interface DashboardMetrics {
  totalAssets: number;
  activeAssets: number;
  assetsInMaintenance: number;
  totalValue: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export const initialMetrics: DashboardMetrics = {
  totalAssets: 1248,
  activeAssets: 1102,
  assetsInMaintenance: 45,
  totalValue: 1250000,
  recentActivity: [
    { id: 'a1', user: 'Mark Manager', action: 'assigned', target: 'MacBook Pro 16"', timestamp: '2026-07-12T10:30:00Z' },
    { id: 'a2', user: 'Alice Admin', action: 'approved maintenance', target: 'Dell Server R740', timestamp: '2026-07-12T09:15:00Z' },
    { id: 'a3', user: 'Emma Employee', action: 'requested', target: 'Ergonomic Chair', timestamp: '2026-07-11T16:45:00Z' },
    { id: 'a4', user: 'David DeptHead', action: 'approved transfer', target: 'Design Dept Monitors', timestamp: '2026-07-11T14:20:00Z' },
  ]
};

export const initializeMockData = () => {
  if (!storage.get('users')) {
    storage.set('users', predefinedUsers);
  }
  if (!storage.get('dashboard_metrics')) {
    storage.set('dashboard_metrics', initialMetrics);
  }
};
