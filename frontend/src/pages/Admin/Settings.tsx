import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Settings</h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Manage your account and company preferences</p>
      </div>

      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        {/* Company Info */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: '1rem' }}>Company Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Company Name', value: user?.companyName },
              { label: 'Company Code', value: user?.companyCode, mono: true },
              { label: 'Your Name', value: user?.name },
              { label: 'Your Email', value: user?.email },
              { label: 'Employee Code', value: user?.employeeCode, mono: true },
              { label: 'Role', value: 'Admin' },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: `1px solid ${border}` }}>
                <span style={{ fontSize: '0.875rem', color: textMuted }}>{label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit', color: mono ? '#3b82f6' : textPrimary }}>{value || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: '1rem' }}>Appearance</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>Dark Mode</p>
              <p style={{ color: textMuted, fontSize: '0.8rem' }}>Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                width: '52px', height: '28px', borderRadius: '14px', border: 'none',
                background: isDark ? '#3b82f6' : '#e2e8f0', cursor: 'pointer',
                position: 'relative', transition: 'background 200ms',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px', left: isDark ? '27px' : '3px',
                width: '22px', height: '22px', borderRadius: '50%', background: '#fff',
                transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: cardBg, border: '1px solid #ef444440', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>Session</h3>
          <p style={{ color: textMuted, fontSize: '0.875rem', marginBottom: '1rem' }}>Sign out of your account</p>
          <button
            onClick={logout}
            style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
