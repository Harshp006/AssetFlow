import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface DashboardData {
  totalEmployees?: number;
  totalAssets?: number;
  pendingRequests?: number;
  employees?: any[];
}

const Stat = ({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) => (
  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  const load = useCallback(async () => {
    try {
      const [empRes, assetRes, reqRes] = await Promise.all([
        api.get('/auth/employees'),
        api.get('/asset-manager/assets?limit=5'),
        api.get('/asset-manager/requests?status=Pending&limit=5'),
      ]);
      setData({
        totalEmployees: empRes.data.data?.length || 0,
        totalAssets: assetRes.data.data?.total || 0,
        pendingRequests: reqRes.data.data?.total || 0,
        employees: (empRes.data.data || []).slice(0, 5),
      });
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`:root { --card-bg: ${cardBg}; --border: ${border}; --text-primary: ${textPrimary}; --text-muted: ${textMuted}; }`}</style>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Here's your company overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={{ height: '88px', borderRadius: '12px', background: isDark ? '#1e293b' : '#f1f5f9', animation: 'pulse 1.5s ease-in-out infinite' }} />)
        ) : (
          <>
            <Stat label="Total Employees" value={data.totalEmployees || 0} icon="👥" color="#ef4444" />
            <Stat label="Total Assets" value={data.totalAssets || 0} icon="📦" color="#f59e0b" />
            <Stat label="Pending Requests" value={data.pendingRequests || 0} icon="📋" color="#3b82f6" />
          </>
        )}
      </div>

      {/* Recent Employees */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: textPrimary, marginBottom: '1rem' }}>Recent Employees</h3>
        {loading ? (
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>Loading...</p>
        ) : data.employees?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
            <p style={{ fontWeight: 500 }}>No employees yet</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Go to Employees tab to add your first team member</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Employee Code', 'Role', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.employees?.map((emp: any) => (
                <tr key={emp.id}>
                  <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.875rem', color: textPrimary }}>{emp.name}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.875rem', color: '#3b82f6', fontFamily: 'monospace' }}>{emp.employeeCode}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: textMuted }}>{emp.role}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: emp.isActive ? '#10b98120' : '#ef444420', color: emp.isActive ? '#10b981' : '#ef4444' }}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};
