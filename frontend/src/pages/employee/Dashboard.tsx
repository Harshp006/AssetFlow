import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employee/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { title: 'My Assets', value: data?.myAssetCount ?? 0, icon: '📦', color: '#10b981' },
    { title: 'Pending Requests', value: data?.pendingRequests ?? 0, icon: '📋', color: '#f59e0b' },
    { title: 'Unread Notifications', value: data?.unreadNotifications ?? 0, icon: '🔔', color: '#ef4444' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Employee · {user?.companyName}</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {loading ? (
          [1, 2, 3].map(i => <div key={i} style={{ height: '88px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}`, animation: 'pulse 1.5s ease-in-out infinite' }} />)
        ) : (
          kpis.map((kpi, idx) => (
            <div key={idx} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${kpi.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {kpi.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: textPrimary, lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: '0.8rem', color: textMuted, marginTop: '0.25rem' }}>{kpi.title}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: textPrimary, marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/employee/requests')} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            ➕ Request New Asset
          </button>
          <button onClick={() => navigate('/employee/my-assets')} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>
            📦 View Assigned Assets
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Recent Notifications */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: textPrimary }}>Recent Notifications</h3>
            <button onClick={() => navigate('/employee/notifications')} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {loading ? (
            <p style={{ color: textMuted }}>Loading...</p>
          ) : !data?.recentNotifications || data.recentNotifications.length === 0 ? (
            <p style={{ color: textMuted, fontSize: '0.875rem' }}>No unread notifications.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.recentNotifications.map((n: any) => (
                <div key={n.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${border}` }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary }}>{n.title}</div>
                    <div style={{ fontSize: '0.8rem', color: textMuted, marginTop: '0.2rem' }}>{n.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Assigned Assets */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: textPrimary }}>My Assigned Assets</h3>
            <button onClick={() => navigate('/employee/my-assets')} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {loading ? (
            <p style={{ color: textMuted }}>Loading...</p>
          ) : !data?.myAssets || data.myAssets.length === 0 ? (
            <p style={{ color: textMuted, fontSize: '0.875rem' }}>No assets assigned to you yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.myAssets.map((a: any) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${border}` }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary }}>{a.name}</div>
                    <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.2rem' }}>Tag: {a.assetTag}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '20px', background: '#10b98120', color: '#10b981', fontWeight: 500 }}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};
