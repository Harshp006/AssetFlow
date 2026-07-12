import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const AssetManagerReports: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/asset-manager/reports').then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: textMuted, textAlign: 'center' }}>Loading reports...</div>;

  const allocationColors = ['#10b981', '#3b82f6', '#f59e0b', '#6b7280'];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Reports</h1>
        <p style={{ color: textMuted, fontSize: '0.875rem' }}>Asset & utilization overview for your company</p>
      </div>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Assets', value: data?.overview?.totalAssets || 0, color: '#3b82f6' },
          { label: 'Allocated', value: data?.overview?.allocated || 0, color: '#f59e0b' },
          { label: 'Available', value: data?.overview?.available || 0, color: '#10b981' },
          { label: 'Under Maint.', value: data?.overview?.underMaintenance || 0, color: '#ef4444' },
          { label: 'Total Value', value: `₹${Number(data?.overview?.totalValue || 0).toLocaleString()}`, color: '#8b5cf6' },
          { label: 'Utilization', value: `${data?.overview?.utilizationRate || 0}%`, color: '#06b6d4' },
        ].map(s => (
          <div key={s.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Allocation Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: '1rem', fontSize: '0.95rem' }}>Asset Status Breakdown</h3>
          {(data?.allocationSummary || []).map((s: any, i: number) => (
            <div key={s.status} style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: textMuted }}>{s.status}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textPrimary }}>{s.count}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: isDark ? '#334155' : '#e2e8f0' }}>
                <div style={{ height: '100%', borderRadius: '3px', background: allocationColors[i] || '#3b82f6', width: `${data?.overview?.totalAssets ? Math.round((s.count / data.overview.totalAssets) * 100) : 0}%` }} />
              </div>
            </div>
          ))}
          {(!data?.allocationSummary || data.allocationSummary.length === 0) && (
            <p style={{ color: textMuted, fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No data yet</p>
          )}
        </div>

        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: '1rem', fontSize: '0.95rem' }}>Category Breakdown</h3>
          {(data?.categoryBreakdown || []).map((c: any) => (
            <div key={c.category} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: '0.875rem', color: textPrimary }}>{c.category}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textMuted }}>{c.count} assets</span>
            </div>
          ))}
          {(!data?.categoryBreakdown || data.categoryBreakdown.length === 0) && (
            <p style={{ color: textMuted, fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No categories yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
