import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

interface Employee { id: number; name: string; email: string; employeeCode: string; role: string; isActive: boolean; createdAt: string; assignedAssets?: number; totalRequests?: number; }

const ROLES = ['EMPLOYEE', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'];

export const AdminEmployees: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/auth/employees');
      setEmployees(res.data.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const res = await api.post('/auth/employees', form);
      const emp = res.data.data;
      setSuccessMsg(`✅ Created! Employee Code: ${emp.employeeCode}`);
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
      await load();
      setTimeout(() => { setShowModal(false); setSuccessMsg(''); }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create employee.');
    } finally { setCreating(false); }
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await api.patch(`/auth/employees/${id}/role`, { role });
      setEmployees(es => es.map(e => e.id === id ? { ...e, role } : e));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await api.patch(`/auth/employees/${id}/toggle-active`);
      const updated = res.data.data;
      setEmployees(es => es.map(e => e.id === id ? { ...e, isActive: updated.isActive } : e));
    } catch { alert('Failed to update status.'); }
  };

  const filtered = employees.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeCode.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>Employees</h1>
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>{employees.length} total · Manage roles and access</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            placeholder="Search by name, code or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', width: '280px' }}
          />
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              {['Name & Email', 'Employee Code', 'Role', 'Assets', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: textMuted }}>Loading employees...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: textMuted }}>
                {search ? 'No employees match your search.' : 'No employees yet. Click "+ Add Employee" to create one.'}
              </td></tr>
            ) : filtered.map(emp => (
              <tr key={emp.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ef444430', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: textPrimary, fontSize: '0.875rem' }}>{emp.name}</div>
                      <div style={{ color: textMuted, fontSize: '0.75rem' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', color: '#3b82f6', fontSize: '0.875rem' }}>{emp.employeeCode}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  {emp.role === 'ADMIN' ? (
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#ef444420', color: '#ef4444' }}>ADMIN</span>
                  ) : (
                    <select
                      value={emp.role}
                      onChange={e => handleRoleChange(emp.id, e.target.value)}
                      style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{emp.assignedAssets ?? 0}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: emp.isActive ? '#10b98120' : '#ef444420', color: emp.isActive ? '#10b981' : '#ef4444' }}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  {emp.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleToggleActive(emp.id)}
                      style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      {emp.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Employee Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary }}>Add New Employee</h2>
              <button onClick={() => { setShowModal(false); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textMuted }}>✕</button>
            </div>

            {successMsg ? (
              <div style={{ padding: '1.5rem', borderRadius: '10px', background: '#10b98120', border: '1px solid #10b98140', color: '#10b981', textAlign: 'center', fontWeight: 500 }}>
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Full Name</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Email</label>
                  <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="john@company.com" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Password</label>
                  <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 6 characters" minLength={6} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Role</label>
                  <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>
                {error && <div style={{ padding: '0.625rem', borderRadius: '8px', background: '#ef444420', border: '1px solid #ef444440', color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={creating} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                    {creating ? 'Creating...' : 'Create Employee'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
