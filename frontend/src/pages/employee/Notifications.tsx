import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const EmployeeNotifications: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/employee/notifications')
      .then(res => setNotifications(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    try {
      await api.patch(`/employee/notifications/${id}/read`);
      setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      alert('Failed to mark notification as read.');
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>Notifications</h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>{notifications.filter(n => !n.isRead).length} unread notifications</p>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          [1, 2].map(i => <div key={i} style={{ height: '70px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}`, animation: 'pulse 1.5s ease-in-out infinite' }} />)
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', color: textMuted }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
            <p style={{ fontWeight: 500, color: textPrimary }}>All caught up!</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>No notifications to display.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '12px', background: cardBg, border: `1px solid ${border}`, opacity: n.isRead ? 0.7 : 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.isRead ? 'transparent' : '#ef4444', marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary }}>{n.title}</div>
                  <div style={{ fontSize: '0.8rem', color: textMuted, marginTop: '0.2' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} style={{ padding: '0.375rem 0.75rem', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};
