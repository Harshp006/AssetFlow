import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const AdminAssets: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  const [assets, setAssets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const res = await api.get(`/asset-manager/assets?${params}`);
      setAssets(res.data.data?.data || []);
      setTotal(res.data.data?.total || 0);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => { load(); }, [load]);

  const statusColors: Record<string, string> = { Available: '#10b981', Allocated: '#3b82f6', 'Under Maintenance': '#f59e0b', Retired: '#6b7280' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Assets</h1>
          <p style={{ color: textMuted, fontSize: '0.875rem' }}>{total} total assets in your company</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }} />
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.625rem', borderRadius: '8px', border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: '0.875rem' }}>
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              {['Asset Tag', 'Name', 'Category', 'Status', 'Assigned To', 'Cost'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: textMuted }}>Loading...</td></tr>
            ) : assets.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: textMuted }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
                <p style={{ fontWeight: 500, color: textPrimary }}>No assets yet</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Assets are created by the Asset Manager role.</p>
              </td></tr>
            ) : assets.map((a: any) => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', color: '#f59e0b', fontSize: '0.875rem' }}>{a.assetTag || '—'}</td>
                <td style={{ padding: '0.875rem 1rem', color: textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>{a.name}</td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{a.category}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, background: `${statusColors[a.status] || '#6b7280'}20`, color: statusColors[a.status] || '#6b7280' }}>{a.status}</span>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: textMuted, fontSize: '0.875rem' }}>{a.assignedTo?.name || '—'}</td>
                <td style={{ padding: '0.875rem 1rem', color: textPrimary, fontSize: '0.875rem' }}>₹{Number(a.acquisitionCost).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
