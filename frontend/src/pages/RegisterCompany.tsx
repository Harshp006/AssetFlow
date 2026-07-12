import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const RegisterCompany: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({ companyName: '', name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ companyCode: string; employeeCode: string; companyName: string } | null>(null);

  // Dynamic theme styling
  const bg = isDark ? '#0f172a' : '#f0f4ff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#475569';
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1';
  const innerCardBg = isDark ? '#0f172a' : '#f8fafc';
  const innerCardBorder = isDark ? '#334155' : '#e2e8f0';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: form.companyName, name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess({ companyCode: data.data.companyCode, employeeCode: data.data.user.employeeCode, companyName: data.data.companyName });
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 150ms',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', color: textSecondary, marginBottom: '0.375rem', fontWeight: 600 };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Inter', sans-serif", transition: 'background-color 0.3s' }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '20px', padding: '2.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Company Created!</h2>
          <p style={{ color: textSecondary, marginBottom: '2rem' }}>Share the codes below with your employees so they can join.</p>
          
          <div style={{ background: innerCardBg, borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: `1px solid ${innerCardBorder}` }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: `1px solid ${innerCardBorder}`, paddingBottom: '1rem' }}>
              <p style={{ color: textSecondary, fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 600 }}>COMPANY NAME</p>
              <p style={{ color: textPrimary, fontWeight: 700, fontSize: '1.2rem' }}>{success.companyName}</p>
            </div>
            <div style={{ marginBottom: '1.5rem', borderBottom: `1px solid ${innerCardBorder}`, paddingBottom: '1rem' }}>
              <p style={{ color: textSecondary, fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 600 }}>YOUR COMPANY CODE</p>
              <p style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{success.companyCode}</p>
              <p style={{ color: textSecondary, fontSize: '0.75rem', marginTop: '0.25rem' }}>Employees need this to log in</p>
            </div>
            <div>
              <p style={{ color: textSecondary, fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 600 }}>YOUR EMPLOYEE CODE (Admin)</p>
              <p style={{ color: '#d97706', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{success.employeeCode}</p>
              <p style={{ color: textSecondary, fontSize: '0.75rem', marginTop: '0.25rem' }}>Use this to log in along with your company code</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Inter', sans-serif", transition: 'background-color 0.3s' }}>
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '20px', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem',
          }}>AF</div>
          <h1 style={{ color: textPrimary, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Register Your Company</h1>
          <p style={{ color: textSecondary, fontSize: '0.875rem' }}>You'll become the Admin. Others join with your Company Code.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Company Name</label>
            <input style={inputStyle} name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Acme Corp" required />
          </div>
          <div>
            <label style={labelStyle}>Your Full Name</label>
            <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Smith" required />
          </div>
          <div>
            <label style={labelStyle}>Business Email</label>
            <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@company.com" required />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input style={inputStyle} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: '#ef444420', border: '1px solid #ef444450', color: '#fca5a5', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '0.875rem', borderRadius: '10px', border: 'none',
            background: loading ? '#64748b' : 'linear-gradient(135deg, #2563eb, #6366f1)',
            color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
            boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
          }}>
            {loading ? 'Creating...' : 'Create Company'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: textSecondary }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};
