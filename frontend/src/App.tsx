import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { initializeMockData } from './services/mockData';

// Placeholder for unbuilt pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <h2 style={{ color: 'var(--text-secondary)' }}>{title} Module - Coming Soon</h2>
  </div>
);

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<PlaceholderPage title="Assets" />} />
            <Route path="/transfers" element={<PlaceholderPage title="Transfers" />} />
            <Route path="/maintenance" element={<PlaceholderPage title="Maintenance" />} />
            <Route path="/bookings" element={<PlaceholderPage title="Bookings" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
