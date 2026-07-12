import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const EmployeeRequests: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ assetType: '', reason: '', priority: 'Medium' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/employee/requests')
      .then(res => setRequests(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/employee/requests', form);
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setForm({ assetType: '', reason: '', priority: 'Medium' });
        setSuccess(false);
        load();
      }, 2000);
    } catch {
      alert('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    Pending: '#f59e0b',
    Approved: '#10b981',
    Rejected: '#ef4444'
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>Asset Requests</h1>
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>{requests.length} requests submitted</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
          + New Request
        </button>
      </div>

      {/* Requests Table */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              {['Asset Requested', 'Reason', 'Priority', 'Status', 'Date Submitted', 'Resolved Notes'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: textMuted }}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: textMuted }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                <p style={{ fontWeight: 500, color: textPrimary }}>No requests submitted yet</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click "+ New Request" to request an asset.</p>
              </td></tr>
            ) : (
              requests.map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '0.875rem 1rem', color: textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>{r.assetType || r.asset?.name || 'General Asset'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{r.reason}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: r.priority === 'High' ? '#ef444420' : r.priority === 'Medium' ? '#f59e0b20' : '#6b728020', color: r.priority === 'High' ? '#ef4444' : r.priority === 'Medium' ? '#f59e0b' : '#6b7280' }}>{r.priority}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: `${statusColors[r.status] || '#6b7280'}20`, color: statusColors[r.status] || '#6b7280' }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>
                    {r.resolvedNote || (r.status === 'Pending' ? <em style={{ fontSize: '0.8rem', color: textMuted }}>Awaiting Review</em> : '—')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary }}>Request New Asset</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textMuted }}>✕</button>
            </div>
            {success ? (
              <div style={{ padding: '1.5rem', borderRadius: '10px', background: '#10b98120', border: '1px solid #10b98140', color: '#10b981', textAlign: 'center', fontWeight: 500 }}>
                ✅ Request submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Asset Type / Name</label>
                  <input style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', boxSizing: 'border-box' }} value={form.assetType} onChange={e => setForm(f => ({ ...f, assetType: e.target.value }))} required placeholder="e.g. MacBook Pro, Monitor, Office Chair" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Reason / Business Justification</label>
                  <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required rows={3} placeholder="Please provide details for the request..." style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{submitting ? 'Submitting...' : 'Submit Request'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
