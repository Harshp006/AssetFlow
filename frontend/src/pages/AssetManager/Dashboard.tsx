import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AssetManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/asset-manager/dashboard').then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Total Assets', value: data.totalAssets, icon: '📦', color: '#3b82f6' },
    { label: 'Available', value: data.availableAssets, icon: '✅', color: '#10b981' },
    { label: 'Allocated', value: data.allocatedAssets, icon: '🔄', color: '#f59e0b' },
    { label: 'Pending Requests', value: data.pendingRequests, icon: '📋', color: '#ef4444' },
    { label: 'Total Value', value: `₹${Number(data.totalValue || 0).toLocaleString()}`, icon: '💰', color: '#8b5cf6' },
    { label: 'Employees', value: data.totalEmployees, icon: '👥', color: '#06b6d4' },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Asset Manager · {user?.companyName}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {loading ? [1,2,3,4,5,6].map(i => <div key={i} style={{ height: '90px', borderRadius: '12px', background: cardBg, animation: 'pulse 1.5s ease-in-out infinite' }} />) :
        stats.map(s => (
          <div key={s.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Assets + Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: '0.875rem', fontSize: '0.95rem' }}>Recent Assets</h3>
          {loading ? <p style={{ color: textMuted, fontSize: '0.875rem' }}>Loading...</p> : data?.recentAssets?.length === 0 ? (
            <p style={{ color: textMuted, fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No assets yet. Add your first asset.</p>
          ) : data?.recentAssets?.map((a: any) => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: '0.875rem', color: textPrimary }}>{a.name}</span>
              <span style={{ fontSize: '0.75rem', color: a.status === 'Available' ? '#10b981' : '#f59e0b' }}>{a.status}</span>
            </div>
          ))}
        </div>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: '0.875rem', fontSize: '0.95rem' }}>Recent Requests</h3>
          {loading ? <p style={{ color: textMuted, fontSize: '0.875rem' }}>Loading...</p> : data?.recentRequests?.length === 0 ? (
            <p style={{ color: textMuted, fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No pending requests.</p>
          ) : data?.recentRequests?.map((r: any) => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: '0.875rem', color: textPrimary }}>{r.requestedBy}</span>
              <span style={{ fontSize: '0.75rem', color: r.status === 'Pending' ? '#f59e0b' : r.status === 'Approved' ? '#10b981' : '#ef4444' }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};
