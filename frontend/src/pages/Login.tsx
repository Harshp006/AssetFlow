import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Login: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ companyCode: '', employeeCode: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isDark = theme === 'dark';

  // Dynamic theme styling
  const bg = isDark ? '#0f172a' : '#f0f4ff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#475569';
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1';
  const shadow = isDark ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(0,0,0,0.08)';

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const paths: Record<string, string> = {
      ADMIN: '/admin',
      ASSET_MANAGER: '/asset-manager',
      DEPARTMENT_HEAD: '/dept-head',
      EMPLOYEE: '/employee',
    };
    navigate(paths[user.role] || '/login', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(form.companyCode.trim().toUpperCase(), form.employeeCode.trim().toUpperCase(), form.password);
    if (!ok) setError('Invalid company code, employee code, or password.');
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontSize: '0.925rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 150ms',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif",
      background: bg, transition: 'background-color 0.3s',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        background: cardBg, border: `1px solid ${border}`, borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '440px',
        boxShadow: shadow, transition: 'background-color 0.3s, border-color 0.3s',
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '52px', height: '52px', borderRadius: '13px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            color: '#fff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem',
          }}>AF</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>
            Login
          </h2>
          <p style={{ color: textSecondary, fontSize: '0.875rem' }}>Enter your company and employee credentials</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Company Code */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: textSecondary, marginBottom: '0.375rem' }}>
              Company Code
            </label>
            <input
              style={inputStyle}
              value={form.companyCode}
              onChange={e => setForm(f => ({ ...f, companyCode: e.target.value }))}
              placeholder="e.g. ASF-1234"
              required
              autoComplete="organization"
            />
          </div>

          {/* Employee Code */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: textSecondary, marginBottom: '0.375rem' }}>
              Employee Code
            </label>
            <input
              style={inputStyle}
              value={form.employeeCode}
              onChange={e => setForm(f => ({ ...f, employeeCode: e.target.value }))}
              placeholder="e.g. EMP-0001 or ADM-0001"
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: textSecondary, marginBottom: '0.375rem' }}>
              Password
            </label>
            <input
              style={inputStyle}
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: textSecondary }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
              />
              Remember Me
            </label>
            <span style={{ fontSize: '0.875rem', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Forgot Password?</span>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: '8px',
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.875rem', borderRadius: '10px', border: 'none',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #6366f1)',
              color: '#fff', fontSize: '1rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(37,99,235,0.2)',
              transition: 'all 200ms',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/" style={{ color: textSecondary, fontSize: '0.875rem', textDecoration: 'none' }}>
            Back to Home
          </Link>
          <p style={{ fontSize: '0.875rem', color: textSecondary }}>
            New company?{' '}
            <Link to="/register-company" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
