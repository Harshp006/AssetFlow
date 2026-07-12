import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const EmployeeProfile: React.FC = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employee/profile')
      .then(res => setProfile(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>My Profile</h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Your personal employee account information</p>
      </div>

      {loading ? (
        <div style={{ maxWidth: '600px', height: '300px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}`, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ) : (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
          {/* Card */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: `1px solid ${border}`, paddingBottom: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textPrimary }}>{profile?.name}</h3>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#10b98120', color: '#10b981', fontWeight: 600 }}>Employee</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Email Address', value: profile?.email },
                { label: 'Employee Code', value: profile?.employeeCode, mono: true },
                { label: 'Company Name', value: profile?.company?.name },
                { label: 'Company Code', value: profile?.company?.companyCode, mono: true },
                { label: 'Total Assigned Assets', value: profile?._count?.assets ?? 0 },
                { label: 'Total Requests Raised', value: profile?._count?.requestedRequests ?? 0 },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: '0.875rem', color: textMuted }}>{label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit', color: mono ? '#3b82f6' : textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>Logout</p>
              <p style={{ color: textMuted, fontSize: '0.8rem' }}>Sign out of this device</p>
            </div>
            <button onClick={logout} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};
