import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const statusColors: Record<string, string> = { Available: '#10b981', Allocated: '#3b82f6', 'Under Maintenance': '#f59e0b', Retired: '#6b7280' };

export const AssetManagerAssets: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<any>(null);
  const [form, setForm] = useState({ name: '', serialNumber: '', category: 'General', acquisitionCost: '', location: 'HQ Office', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const [assetRes, empRes] = await Promise.all([
        api.get(`/asset-manager/assets?${params}`),
        api.get('/auth/employees'),
      ]);
      setAssets(assetRes.data.data?.data || []);
      setTotal(assetRes.data.data?.total || 0);
      setEmployees(empRes.data.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setCreating(true);
    try {
      await api.post('/asset-manager/assets', { ...form, acquisitionCost: parseFloat(form.acquisitionCost) || 0 });
      setShowModal(false);
      setForm({ name: '', serialNumber: '', category: 'General', acquisitionCost: '', location: 'HQ Office', description: '' });
      await load();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create asset.'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset?')) return;
    try { await api.delete(`/asset-manager/assets/${id}`); await load(); } catch { alert('Failed to delete.'); }
  };

  const handleAssign = async (assetId: number, employeeId: number) => {
    try { await api.patch(`/asset-manager/assets/${assetId}/assign`, { employeeId }); setShowAssignModal(null); await load(); }
    catch { alert('Failed to assign.'); }
  };

  const handleUnassign = async (id: number) => {
    try { await api.patch(`/asset-manager/assets/${id}/unassign`); await load(); }
    catch { alert('Failed to unassign.'); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Assets</h1>
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>{total} total assets</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', width: '220px' }} />
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
          <button onClick={() => setShowModal(true)} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>+ Add Asset</button>
        </div>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              {['Tag', 'Name', 'Category', 'Status', 'Assigned To', 'Cost', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: textMuted }}>Loading...</td></tr>) :
            assets.length === 0 ? (<tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: textMuted }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
              <p style={{ fontWeight: 500, color: textPrimary }}>No assets yet</p>
              <p style={{ fontSize: '0.8rem' }}>Click "Add Asset" to register your first one</p>
            </td></tr>) :
            assets.map(a => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', color: '#f59e0b', fontSize: '0.8rem' }}>{a.assetTag || '—'}</td>
                <td style={{ padding: '0.875rem 1rem', color: textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>{a.name}</td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{a.category}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: `${statusColors[a.status]}20`, color: statusColors[a.status] }}>{a.status}</span>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{a.assignedTo?.name || '—'}</td>
                <td style={{ padding: '0.875rem 1rem', color: textPrimary, fontSize: '0.875rem' }}>₹{Number(a.acquisitionCost).toLocaleString()}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {a.status === 'Available' ? (
                      <button onClick={() => setShowAssignModal(a)} style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid #3b82f6`, background: 'transparent', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Assign</button>
                    ) : a.assignedToId ? (
                      <button onClick={() => handleUnassign(a.id)} style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '0.75rem', cursor: 'pointer' }}>Unassign</button>
                    ) : null}
                    <button onClick={() => handleDelete(a.id)} style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid #ef4444`, background: 'transparent', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Asset Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary }}>Add Asset</h2>
              <button onClick={() => { setShowModal(false); setError(''); }} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textMuted }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { key: 'name', label: 'Asset Name', placeholder: 'e.g. Dell Laptop' },
                { key: 'serialNumber', label: 'Serial Number', placeholder: 'e.g. SN-2025-001' },
                { key: 'category', label: 'Category', placeholder: 'e.g. Electronics' },
                { key: 'acquisitionCost', label: 'Cost (₹)', placeholder: '0.00' },
                { key: 'location', label: 'Location', placeholder: 'HQ Office' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>{f.label}</label>
                  <input style={inputStyle} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} required={f.key !== 'acquisitionCost' && f.key !== 'location'} />
                </div>
              ))}
              {error && <div style={{ padding: '0.625rem', borderRadius: '8px', background: '#ef444420', color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{creating ? 'Creating...' : 'Create Asset'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Asset Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, marginBottom: '0.5rem' }}>Assign Asset</h2>
            <p style={{ color: textMuted, fontSize: '0.875rem', marginBottom: '1.5rem' }}>Assign <strong style={{ color: textPrimary }}>{showAssignModal.name}</strong> to an employee</p>
            {employees.filter(e => e.role !== 'ADMIN').length === 0 ? (
              <p style={{ color: textMuted, textAlign: 'center', padding: '1rem' }}>No employees to assign to. Add employees first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                {employees.filter(e => e.role !== 'ADMIN').map((emp: any) => (
                  <button key={emp.id} onClick={() => handleAssign(showAssignModal.id, emp.id)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: textPrimary, fontSize: '0.875rem' }}>{emp.name}</div>
                      <div style={{ color: textMuted, fontSize: '0.75rem' }}>{emp.employeeCode} · {emp.role}</div>
                    </div>
                    <span style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600 }}>Assign →</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowAssignModal(null)} style={{ width: '100%', marginTop: '1rem', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
