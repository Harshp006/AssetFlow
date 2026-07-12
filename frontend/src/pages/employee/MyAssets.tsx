import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const EmployeeMyAssets: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMaintModal, setShowMaintModal] = useState<any>(null);
  const [maintForm, setMaintForm] = useState({ issue: '', priority: 'MEDIUM' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/employee/my-assets')
      .then(res => setAssets(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/asset-manager/maintenance', {
        assetId: showMaintModal.id,
        issue: maintForm.issue,
        priority: maintForm.priority
      });
      setSuccess(true);
      setTimeout(() => {
        setShowMaintModal(null);
        setMaintForm({ issue: '', priority: 'MEDIUM' });
        setSuccess(false);
        load();
      }, 2000);
    } catch {
      alert('Failed to submit maintenance request.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    Available: '#10b981',
    Allocated: '#3b82f6',
    'Under Maintenance': '#f59e0b',
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary, marginBottom: '0.25rem' }}>My Assigned Assets</h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Assets currently registered to you</p>
      </div>

      {/* Assets List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {loading ? (
          [1, 2].map(i => <div key={i} style={{ height: '140px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}`, animation: 'pulse 1.5s ease-in-out infinite' }} />)
        ) : assets.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: cardBg, border: `1px solid ${border}`, borderRadius: '12px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
            <h3 style={{ color: textPrimary, fontWeight: 600 }}>No Assigned Assets</h3>
            <p style={{ color: textMuted, fontSize: '0.875rem', marginTop: '0.25rem' }}>If you need an asset, please submit a request.</p>
          </div>
        ) : (
          assets.map(a => (
            <div key={a.id} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: textPrimary, fontSize: '1rem' }}>{a.name}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '20px', background: `${statusColors[a.status] || '#6b7280'}20`, color: statusColors[a.status] || '#6b7280', fontWeight: 500 }}>{a.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8rem', color: textMuted, marginBottom: '1rem' }}>
                  <div>Asset Tag: <span style={{ fontFamily: 'monospace', color: textPrimary }}>{a.assetTag || '—'}</span></div>
                  <div>Serial No: <span style={{ fontFamily: 'monospace', color: textPrimary }}>{a.serialNumber}</span></div>
                  <div>Category: <span style={{ color: textPrimary }}>{a.category}</span></div>
                  <div>Location: <span style={{ color: textPrimary }}>{a.location || '—'}</span></div>
                </div>
              </div>
              {a.status !== 'Under Maintenance' && (
                <button onClick={() => setShowMaintModal(a)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #f59e0b', background: 'transparent', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 150ms' }}>
                  🔧 Report Issue / Maintenance
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Maintenance Request Modal */}
      {showMaintModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPrimary }}>Report Issue</h2>
              <button onClick={() => setShowMaintModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: textMuted }}>✕</button>
            </div>
            {success ? (
              <div style={{ padding: '1.5rem', borderRadius: '10px', background: '#10b98120', border: '1px solid #10b98140', color: '#10b981', textAlign: 'center', fontWeight: 500 }}>
                ✅ Maintenance request submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: textMuted, fontSize: '0.875rem' }}>Reporting issue for: <strong style={{ color: textPrimary }}>{showMaintModal.name}</strong></p>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Describe the issue</label>
                  <textarea value={maintForm.issue} onChange={e => setMaintForm(f => ({ ...f, issue: e.target.value }))} required rows={3} placeholder="Please describe what is wrong with the asset..." style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>Priority</label>
                  <select value={maintForm.priority} onChange={e => setMaintForm(f => ({ ...f, priority: e.target.value }))} style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowMaintModal(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${border}`, background: 'transparent', color: textPrimary, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{submitting ? 'Submitting...' : 'Submit Request'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};
