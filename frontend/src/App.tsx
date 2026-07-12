import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// ── Public pages ──────────────────────────────────────────────────────────────
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { RegisterCompany } from './pages/RegisterCompany';

// ── Layouts ───────────────────────────────────────────────────────────────────
import { AppShell } from './layouts/AppShell';

// ── Admin pages ───────────────────────────────────────────────────────────────
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminEmployees } from './pages/Admin/Employees';
import { AdminAssets } from './pages/Admin/Assets';
import { AdminSettings } from './pages/Admin/Settings';

// ── Asset Manager pages ───────────────────────────────────────────────────────
import { AssetManagerDashboard } from './pages/AssetManager/Dashboard';
import { AssetManagerAssets } from './pages/AssetManager/Assets';
import { AssetManagerRequests } from './pages/AssetManager/Requests';
import { AssetManagerMaintenance } from './pages/AssetManager/Maintenance';
import { AssetManagerReports } from './pages/AssetManager/Reports';

import {
  DeptHeadDashboard,
  DepartmentAssets as DeptHeadAssets,
  Employees as DeptHeadEmployees,
  AssetRequests as DeptHeadRequests,
  Maintenance as DeptHeadMaintenance,
  Reports as DeptHeadReports,
  Notifications as DeptHeadNotifications,
} from './pages/DeptHead';

// ── Employee pages ────────────────────────────────────────────────────────────
import { EmployeeDashboard } from './pages/employee/Dashboard';
import { EmployeeMyAssets } from './pages/employee/MyAssets';
import { EmployeeRequests } from './pages/employee/Requests';
import { EmployeeNotifications } from './pages/employee/Notifications';
import { EmployeeProfile } from './pages/employee/Profile';

// ── Role Guard ─────────────────────────────────────────────────────────────────
const RoleGuard = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8', fontSize: '1rem' }}>Loading...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const home: Record<string, string> = { ADMIN: '/admin', ASSET_MANAGER: '/asset-manager', DEPARTMENT_HEAD: '/dept-head', EMPLOYEE: '/employee' };
    return <Navigate to={home[user.role] || '/login'} replace />;
  }
  return <>{children}</>;
};

// ── Auth redirect ──────────────────────────────────────────────────────────────
const AuthRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  const home: Record<string, string> = { ADMIN: '/admin', ASSET_MANAGER: '/asset-manager', DEPARTMENT_HEAD: '/dept-head', EMPLOYEE: '/employee' };
  return <Navigate to={home[user.role] || '/'} replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-company" element={<RegisterCompany />} />
            <Route path="/dashboard" element={<AuthRedirect />} />

            {/* ── Admin ── */}
            <Route element={<RoleGuard roles={['ADMIN']}><AppShell role="ADMIN" /></RoleGuard>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<AdminEmployees />} />
              <Route path="/admin/assets" element={<AdminAssets />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* ── Asset Manager ── */}
            <Route element={<RoleGuard roles={['ASSET_MANAGER']}><AppShell role="ASSET_MANAGER" /></RoleGuard>}>
              <Route path="/asset-manager" element={<AssetManagerDashboard />} />
              <Route path="/asset-manager/assets" element={<AssetManagerAssets />} />
              <Route path="/asset-manager/requests" element={<AssetManagerRequests />} />
              <Route path="/asset-manager/maintenance" element={<AssetManagerMaintenance />} />
              <Route path="/asset-manager/reports" element={<AssetManagerReports />} />
            </Route>

            {/* ── Department Head ── */}
            <Route element={<RoleGuard roles={['DEPARTMENT_HEAD']}><AppShell role="DEPARTMENT_HEAD" /></RoleGuard>}>
              <Route path="/dept-head" element={<DeptHeadDashboard />} />
              <Route path="/dept-head/assets" element={<DeptHeadAssets />} />
              <Route path="/dept-head/employees" element={<DeptHeadEmployees />} />
              <Route path="/dept-head/requests" element={<DeptHeadRequests />} />
              <Route path="/dept-head/maintenance" element={<DeptHeadMaintenance />} />
              <Route path="/dept-head/reports" element={<DeptHeadReports />} />
              <Route path="/dept-head/notifications" element={<DeptHeadNotifications />} />
            </Route>

            {/* ── Employee ── */}
            <Route element={<RoleGuard roles={['EMPLOYEE']}><AppShell role="EMPLOYEE" /></RoleGuard>}>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/my-assets" element={<EmployeeMyAssets />} />
              <Route path="/employee/requests" element={<EmployeeRequests />} />
              <Route path="/employee/notifications" element={<EmployeeNotifications />} />
              <Route path="/employee/profile" element={<EmployeeProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
