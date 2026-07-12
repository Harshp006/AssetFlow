import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const statusColors: Record<string, string> = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', COMPLETED: '#10b981', CANCELLED: '#6b7280' };

export const AssetManagerMaintenance: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [records, setRecords] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ assetId: '', issue: '', priority: 'MEDIUM' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.append('status', statusFilter);
      const [maintRes, assetRes] = await Promise.all([
        api.get(`/asset-manager/maintenance?${params}`),
        api.get('/asset-manager/assets?limit=100'),
      ]);
      setRecords(maintRes.data.data?.data || []);
      setTotal(maintRes.data.data?.total || 0);
      setAssets(assetRes.data.data?.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setCreating(true);
    try {
      await api.post('/asset-manager/maintenance', form);
      setShowModal(false); setForm({ assetId: '', issue: '', priority: 'MEDIUM' }); await load();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed.'); }
    finally { setCreating(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/asset-manager/maintenance/${id}`, { status }); await load(); }
    catch { alert('Failed to update.'); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Maintenance</h1>
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>{total} records</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button onClick={() => setShowModal(true)} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>+ Report Issue</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: textMuted }}>Loading...</div> :
        records.length === 0 ? (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '3rem', textAlign: 'center', color: textMuted }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔧</div>
            <p style={{ fontWeight: 500, color: textPrimary }}>No maintenance records</p>
          </div>
        ) :
        records.map(r => (
          <div key={r.id} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.375rem' }}>
                <span style={{ fontWeight: 600, color: textPrimary, fontSize: '0.9rem' }}>{r.asset?.name}</span>
                <span style={{ fontSize: '0.75rem', color: textMuted, fontFamily: 'monospace' }}>{r.asset?.assetTag}</span>
              </div>
              <p style={{ color: textMuted, fontSize: '0.875rem', marginBottom: '0.375rem' }}>{r.issue}</p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, background: `${statusColors[r.status]}20`, color: statusColors[r.status] }}>{r.status}</span>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '20px', fontSize: '0.7rem', background: r.priority === 'HIGH' ? '#ef444420' : r.priority === 'MEDIUM' ? '#f59e0b20' : '#6b728020', color: r.priority === 'HIGH' ? '#ef4444' : r.priority === 'MEDIUM' ? '#f59e0b' : '#6b7280' }}>{r.priority}</span>
                <span style={{ color: textMuted, fontSize: '0.75rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {r.status !== 'COMPLETED' && r.status !== 'CANCELLED' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {r.status === 'PENDING' && <button onClick={() => updateStatus(r.id, 'IN_PROGRESS')} style={{ padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #3b82f6', background: 'transparent', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer' }}>Start</button>}
                <button onClick={() => updateStatus(r.id, 'COMPLETED')} style={{ padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #10b981', background: 'transparent', color: '#10b981', fontSize: '0.8rem', cursor: 'pointer' }}>Complete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary }}>Report Maintenance</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textMuted }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Asset</label>
                <select style={inputStyle} value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))} required>
                  <option value="">Select asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetTag || a.serialNumber})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Issue Description</label>
                <textarea value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} required rows={3} placeholder="Describe the issue..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Priority</label>
                <select style={inputStyle} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              {error && <div style={{ padding: '0.625rem', borderRadius: '8px', background: '#ef444420', color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{creating ? 'Saving...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
