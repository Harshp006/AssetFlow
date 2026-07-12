import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table, Column } from '../components/ui/Table';
import { storage } from '../services/storage';
import { DashboardMetrics, Activity } from '../services/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';

const mockChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const data = storage.get<DashboardMetrics>('dashboard_metrics');
    if (data) setMetrics(data);
  }, []);

  if (!metrics) return null;

  const activityColumns: Column<Activity>[] = [
    { key: 'user', header: 'User' },
    { key: 'action', header: 'Action', render: (item) => (
      <span style={{ 
        color: item.action.includes('approved') ? 'var(--accent-secondary)' : 
               item.action.includes('requested') ? 'var(--accent-warning)' : 'var(--text-primary)'
      }}>
        {item.action}
      </span>
    )},
    { key: 'target', header: 'Asset / Target' },
    { key: 'timestamp', header: 'Time', render: (item) => new Date(item.timestamp).toLocaleString() },
  ];

  const kpis = [
    { title: 'Total Assets', value: metrics.totalAssets.toLocaleString(), icon: Package, color: 'var(--accent-primary)' },
    { title: 'Active Assets', value: metrics.activeAssets.toLocaleString(), icon: CheckCircle, color: 'var(--accent-secondary)' },
    { title: 'In Maintenance', value: metrics.assetsInMaintenance.toLocaleString(), icon: AlertTriangle, color: 'var(--accent-warning)' },
    { title: 'Total Value', value: `$${metrics.totalValue.toLocaleString()}`, icon: DollarSign, color: 'var(--accent-danger)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here's what's happening with your assets today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>{kpi.title}</p>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>{kpi.value}</h2>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `${kpi.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: kpi.color
              }}>
                <kpi.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card title="Asset Value Trend">
          <div style={{ height: '300px', width: '100%', marginTop: 'var(--spacing-4)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-strong)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {metrics.recentActivity.map(activity => (
              <div key={activity.id} style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{activity.user}</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{activity.action}</span>{' '}
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{activity.target}</span>
                  </p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Assets Requiring Attention" description="These assets have pending maintenance or transfer requests.">
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <Table 
            columns={activityColumns} 
            data={metrics.recentActivity} 
            keyExtractor={(item) => item.id} 
          />
        </div>
      </Card>
    </div>
  );
};
