// ============================================================
// src/pages/DeptHead/Dashboard.tsx
// Department Head Dashboard – KPIs, quick actions, activity feed
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  Package, Users, FileText, Wrench, TrendingUp, Bell, Plus, Eye,
  ArrowRight, CheckCircle2, Clock, Activity, Zap
} from 'lucide-react';
import {
  getDepartmentDashboard, DeptDashboard, ActivityItem, NotificationItem,
} from '../../services/departmentHeadService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from './components/PageHeader';
import { StatCard } from './components/StatCard';
import { StatusBadge } from './components/StatusBadge';
import { ErrorState } from './components/ErrorState';
import { ActionButton } from './components/ActionButton';
import { useNavigate } from 'react-router-dom';

const SkeletonCard = () => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }}>
    {[100, 60, 80].map((w, i) => (
      <div key={i} style={{
        height: i === 0 ? '10px' : i === 1 ? '28px' : '8px',
        width: `${w}%`,
        borderRadius: '6px',
        backgroundColor: 'var(--bg-surface-elevated)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    ))}
  </div>
);

const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const typeIcon = (type: ActivityItem['type']) => {
  const map = { asset: Package, maintenance: Wrench, request: FileText, transfer: ArrowRight };
  const Icon = map[type] ?? Activity;
  return <Icon size={14} />;
};

const notifTypeColor = (type: NotificationItem['type']) => {
  const map = { info: 'var(--accent-primary)', success: '#10b981', warning: '#f59e0b', error: '#ef4444' };
  return map[type] ?? 'var(--accent-primary)';
};

export const DeptHeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DeptDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const d = await getDepartmentDashboard();
      setData(d);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const quickActions = [
    { label: 'New Asset Request', icon: Plus, path: '/dept-head/requests', color: 'var(--accent-primary)' },
    { label: 'Report Maintenance', icon: Wrench, path: '/dept-head/maintenance', color: '#f59e0b' },
    { label: 'View Assets', icon: Eye, path: '/dept-head/assets', color: '#10b981' },
    { label: 'View Reports', icon: TrendingUp, path: '/dept-head/reports', color: '#8b5cf6' },
  ];

  return (
    <div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
      <PageHeader
        title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ${user?.name?.split(' ')[0] ?? 'Head'} 👋`}
        subtitle="Here's what's happening in your department today."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : data && (
            <>
              <StatCard title="Total Assets" value={data.assetCount} icon={Package} color="#3b82f6"
                subtitle="in your department" trend={{ value: 4, label: 'vs last month', positive: true }} />
              <StatCard title="Assets In Use" value={data.assetsInUse} icon={CheckCircle2} color="#10b981"
                subtitle="actively allocated" />
              <StatCard title="Pending Requests" value={data.pendingRequests} icon={Clock} color="#f59e0b"
                subtitle="awaiting approval" />
              <StatCard title="Maintenance" value={data.maintenanceCount} icon={Wrench} color="#ef4444"
                subtitle="open tickets" />
              <StatCard title="Employees" value={data.employeeCount} icon={Users} color="#8b5cf6"
                subtitle="in department" />
            </>
          )}
      </div>

      {/* Quick Actions + Activity + Notifications row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
      }}>
        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickActions.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; e.currentTarget.style.borderColor = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: a.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <a.icon size={16} style={{ color: a.color }} />
                </div>
                {a.label}
                <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Activity size={16} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Activity</h3>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: '50px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : data && data.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {data.recentActivity.slice(0, 5).map((a, i) => (
                <div key={a.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: i < data.recentActivity.slice(0, 5).length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: 'var(--bg-surface-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-tertiary)',
                  }}>
                    {typeIcon(a.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600 }}>{a.user}</span>
                      {' '}{a.action}{' '}
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{a.target}</span>
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {timeAgo(a.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No recent activity
            </p>
          )}
        </div>

        {/* Notifications Preview */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={16} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h3>
            </div>
            <ActionButton size="sm" variant="ghost" onClick={() => navigate('/dept-head/notifications')}>
              View all
            </ActionButton>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: '52px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : data && data.notifications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {data.notifications.slice(0, 4).map((n, i) => (
                <div key={n.id} style={{
                  padding: '0.75rem 0',
                  borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: notifTypeColor(n.type),
                    flexShrink: 0, marginTop: '5px',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: n.isRead ? 400 : 500, lineHeight: 1.4 }}>
                      {n.title}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={n.priority} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
