import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { initializeMockData } from './services/mockData';

import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { MyAssets } from './pages/employee/MyAssets';
import { RequestAsset } from './pages/employee/RequestAsset';
import { ResourceBooking } from './pages/employee/ResourceBooking';
import { Maintenance } from './pages/employee/Maintenance';
import { TransferRequests } from './pages/employee/TransferRequests';
import { ReturnRequests } from './pages/employee/ReturnRequests';
import { Notifications } from './pages/employee/Notifications';
import { Profile } from './pages/employee/Profile';
import { useAuth } from './context/AuthContext';

// Placeholder for unbuilt pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <h2 style={{ color: 'var(--text-secondary)' }}>{title} Module - Coming Soon</h2>
  </div>
);

// Route guard component
const RoleRoute = ({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={user.role === 'Employee' ? '/employee' : '/'} replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  useEffect(() => {
    // Seed initial mock data into localStorage if empty
    initializeMockData();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<DashboardLayout />}>
            {/* Non-Employee Routes */}
            <Route path="/" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><Dashboard /></RoleRoute>} />
            <Route path="/assets" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><PlaceholderPage title="Assets" /></RoleRoute>} />
            <Route path="/transfers" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><PlaceholderPage title="Transfers" /></RoleRoute>} />
            <Route path="/maintenance" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><PlaceholderPage title="Maintenance" /></RoleRoute>} />
            <Route path="/bookings" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><PlaceholderPage title="Bookings" /></RoleRoute>} />
            <Route path="/reports" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><PlaceholderPage title="Reports" /></RoleRoute>} />
            <Route path="/settings" element={<RoleRoute allowedRoles={['Admin', 'Department Head', 'Asset Manager']}><Settings /></RoleRoute>} />
            
            {/* Employee Routes */}
            <Route path="/employee" element={<RoleRoute allowedRoles={['Employee']}><EmployeeDashboard /></RoleRoute>} />
            <Route path="/employee/my-assets" element={<RoleRoute allowedRoles={['Employee']}><MyAssets /></RoleRoute>} />
            <Route path="/employee/request-asset" element={<RoleRoute allowedRoles={['Employee']}><RequestAsset /></RoleRoute>} />
            <Route path="/employee/bookings" element={<RoleRoute allowedRoles={['Employee']}><ResourceBooking /></RoleRoute>} />
            <Route path="/employee/maintenance" element={<RoleRoute allowedRoles={['Employee']}><Maintenance /></RoleRoute>} />
            <Route path="/employee/transfers" element={<RoleRoute allowedRoles={['Employee']}><TransferRequests /></RoleRoute>} />
            <Route path="/employee/returns" element={<RoleRoute allowedRoles={['Employee']}><ReturnRequests /></RoleRoute>} />
            <Route path="/employee/notifications" element={<RoleRoute allowedRoles={['Employee']}><Notifications /></RoleRoute>} />
            <Route path="/employee/profile" element={<RoleRoute allowedRoles={['Employee']}><Profile /></RoleRoute>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
