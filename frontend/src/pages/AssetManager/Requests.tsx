import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const statusColors: Record<string, string> = { Pending: '#f59e0b', Approved: '#10b981', Rejected: '#ef4444' };

export const AssetManagerRequests: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [requests, setRequests] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [resolveModal, setResolveModal] = useState<any>(null);
  const [resolveForm, setResolveForm] = useState({ status: 'Approved', resolvedNote: '', assetId: '' });
  const [resolving, setResolving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.append('status', statusFilter);
      const [reqRes, assetRes] = await Promise.all([
        api.get(`/asset-manager/requests?${params}`),
        api.get('/asset-manager/assets?status=Available&limit=100'),
      ]);
      setRequests(reqRes.data.data?.data || []);
      setTotal(reqRes.data.data?.total || 0);
      setAssets(assetRes.data.data?.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault(); setResolving(true);
    try {
      await api.patch(`/asset-manager/requests/${resolveModal.id}/resolve`, resolveForm);
      setResolveModal(null); await load();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to resolve.'); }
    finally { setResolving(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Asset Requests</h1>
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>{total} total requests</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              {['Requested By', 'Asset Type', 'Reason', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: textMuted }}>Loading...</td></tr> :
            requests.length === 0 ? <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: textMuted }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
              <p style={{ fontWeight: 500, color: textPrimary }}>No requests yet</p>
            </td></tr> :
            requests.map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontWeight: 500, color: textPrimary, fontSize: '0.875rem' }}>{r.requestedBy?.name}</div>
                  <div style={{ color: textMuted, fontSize: '0.75rem' }}>{r.requestedBy?.employeeCode}</div>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{r.assetType || r.asset?.name || 'General'}</td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.8rem', maxWidth: '200px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</div></td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: r.priority === 'High' ? '#ef444420' : r.priority === 'Medium' ? '#f59e0b20' : '#6b728020', color: r.priority === 'High' ? '#ef4444' : r.priority === 'Medium' ? '#f59e0b' : '#6b7280' }}>{r.priority}</span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: `${statusColors[r.status]}20`, color: statusColors[r.status] }}>{r.status}</span>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  {r.status === 'Pending' && (
                    <button onClick={() => { setResolveModal(r); setResolveForm({ status: 'Approved', resolvedNote: '', assetId: '' }); }} style={{ padding: '0.25rem 0.625rem', borderRadius: '6px', border: `1px solid #3b82f6`, background: 'transparent', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Review</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resolve Modal */}
      {resolveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px', border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary, marginBottom: '0.5rem' }}>Review Request</h2>
            <p style={{ color: textMuted, fontSize: '0.875rem', marginBottom: '1.5rem' }}>From: <strong style={{ color: textPrimary }}>{resolveModal.requestedBy?.name}</strong> — {resolveModal.reason}</p>
            <form onSubmit={handleResolve} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Decision</label>
                <select value={resolveForm.status} onChange={e => setResolveForm(f => ({ ...f, status: e.target.value }))} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>
              {resolveForm.status === 'Approved' && assets.length > 0 && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Assign Asset (optional)</label>
                  <select value={resolveForm.assetId} onChange={e => setResolveForm(f => ({ ...f, assetId: e.target.value }))} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
                    <option value="">-- No asset --</option>
                    {assets.map((a: any) => <option key={a.id} value={a.id}>{a.name} ({a.assetTag || a.serialNumber})</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Note (optional)</label>
                <textarea value={resolveForm.resolvedNote} onChange={e => setResolveForm(f => ({ ...f, resolvedNote: e.target.value }))} rows={3} placeholder="Add a note for the requestor..." style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setResolveModal(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={resolving} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: resolveForm.status === 'Approved' ? '#10b981' : '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  {resolving ? 'Saving...' : resolveForm.status === 'Approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
