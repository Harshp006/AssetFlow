// ============================================================
// src/pages/DeptHead/Reports.tsx
// Department Reports – KPIs, Recharts charts, period selector
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp as _TrendingUp, Download, RefreshCw } from 'lucide-react';
import { getDepartmentReports, DeptReport } from '../../services/departmentHeadService';
import { PageHeader } from './components/PageHeader';
import { ErrorState } from './components/ErrorState';
import { ActionButton } from './components/ActionButton';
import { StatCard } from './components/StatCard';
import { Package, Wrench, Users, CheckCircle2 } from 'lucide-react';

const PERIOD_OPTIONS = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-strong)',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      boxShadow: 'var(--shadow-md)',
    }}>
      {label && <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ fontSize: '0.825rem', fontWeight: 600, color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const ChartCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; loading?: boolean }> = ({
  title, subtitle, children, loading,
}) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
  }}>
    <div style={{ marginBottom: '1.25rem' }}>
      <h3 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>{subtitle}</p>}
    </div>
    {loading
      ? <div style={{ height: '240px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      : children}
  </div>
);

export const Reports: React.FC = () => {
  const [data, setData] = useState<DeptReport | null>(null);
  const [period, setPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const d = await getDepartmentReports(period);
      setData(d);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
      <PageHeader
        title="Department Reports"
        subtitle="Analytics and insights for your department's asset lifecycle."
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Period Selector */}
            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '3px' }}>
              {PERIOD_OPTIONS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: period === p.value ? 600 : 400,
                    backgroundColor: period === p.value ? 'var(--accent-primary)' : 'transparent',
                    color: period === p.value ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <ActionButton variant="ghost" size="sm" icon={RefreshCw} onClick={load} loading={isLoading}>
              Refresh
            </ActionButton>
            <ActionButton variant="secondary" size="sm" icon={Download}>
              Export
            </ActionButton>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: '110px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))
              : data && (
                <>
                  <StatCard title="Total Assets" value={data.totalAssets} icon={Package} color="#3b82f6" />
                  <StatCard title="Active Assets" value={data.activeAssets} icon={CheckCircle2} color="#10b981"
                    trend={{ value: data.assetUtilization, label: 'utilization', positive: data.assetUtilization > 70 }} />
                  <StatCard title="Maintenance" value={data.maintenanceCount} icon={Wrench} color="#f59e0b" />
                  <StatCard title="Allocations" value={data.allocationCount} icon={Users} color="#8b5cf6" />
                </>
              )}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.25rem' }}>
            {/* Maintenance trend */}
            <ChartCard
              title="Maintenance Trend"
              subtitle="Number of tickets raised over the period"
              loading={isLoading}
            >
              {data && (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={data.maintenanceTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--chart-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--chart-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Tickets"
                      stroke="var(--chart-primary)"
                      strokeWidth={2.5}
                      dot={{ fill: 'var(--chart-primary)', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Allocation breakdown */}
            <ChartCard
              title="Asset Status Breakdown"
              subtitle="Current allocation of department assets"
              loading={isLoading}
            >
              {data && data.allocationSummary.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ResponsiveContainer width="55%" height={240}>
                    <PieChart>
                      <Pie
                        data={data.allocationSummary}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {data.allocationSummary.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    {data.allocationSummary.map((item, i) => (
                      <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', flex: 1 }}>{item.status}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.count}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ChartCard>

            {/* Bar chart – utilization */}
            <ChartCard
              title="Monthly Allocation Summary"
              subtitle="Assets allocated vs returned per month"
              loading={isLoading}
            >
              {data && (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.maintenanceTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--chart-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--chart-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '0.775rem', color: 'var(--chart-text)' }} />
                    <Bar dataKey="count" name="Maintenance" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Summary Table */}
            <ChartCard title="Summary" subtitle="Key metrics at a glance" loading={isLoading}>
              {data && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { label: 'Reporting Period', value: data.period },
                    { label: 'Total Assets', value: data.totalAssets.toLocaleString() },
                    { label: 'Active (in use)', value: data.activeAssets.toLocaleString() },
                    { label: 'Asset Utilization', value: `${data.assetUtilization}%` },
                    { label: 'Maintenance Tickets', value: data.maintenanceCount.toLocaleString() },
                    { label: 'Allocation Events', value: data.allocationCount.toLocaleString() },
                  ].map((row, i) => (
                    <div key={row.label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.7rem 0',
                      borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none',
                    }}>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{row.label}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};
