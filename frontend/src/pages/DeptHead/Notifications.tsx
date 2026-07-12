// ============================================================
// src/pages/DeptHead/Notifications.tsx
// Department Notifications – read/unread, mark all read, filter
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Bell, CheckCheck, BellOff, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
  NotificationItem,
} from '../../services/departmentHeadService';
import { PageHeader } from './components/PageHeader';
import { Pagination } from './components/Pagination';
import { ErrorState } from './components/ErrorState';
import { ActionButton } from './components/ActionButton';
import { StatusBadge } from './components/StatusBadge';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  info:    <Info size={18} style={{ color: '#3b82f6' }} />,
  warning: <AlertTriangle size={18} style={{ color: '#f59e0b' }} />,
  success: <CheckCircle2 size={18} style={{ color: '#10b981' }} />,
  error:   <XCircle size={18} style={{ color: '#ef4444' }} />,
};

const TYPE_BG: Record<string, string> = {
  info:    'rgba(59,130,246,0.1)',
  warning: 'rgba(245,158,11,0.1)',
  success: 'rgba(16,185,129,0.1)',
  error:   'rgba(239,68,68,0.1)',
};

const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const Notifications: React.FC = () => {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const LIMIT = 15;
  const unreadCount = data.filter(n => !n.isRead).length;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getNotifications(page, LIMIT, unreadOnly);
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, unreadOnly]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [unreadOnly]);

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      await markNotificationRead(id);
      setData(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      // silently fail
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setData(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      // silently fail
    } finally {
      setMarkingAll(false);
    }
  };

  const SkeletonItem = () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '1.1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: '12px', width: '60%', borderRadius: '6px', backgroundColor: 'var(--bg-surface-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '10px', width: '85%', borderRadius: '6px', backgroundColor: 'var(--bg-surface-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );

  return (
    <div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
      <PageHeader
        title="Notifications"
        subtitle={!isLoading && unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.` : 'Stay up to date with department activity.'}
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={unreadCount > 0 ? (
          <ActionButton
            variant="secondary"
            size="sm"
            icon={CheckCheck}
            loading={markingAll}
            onClick={handleMarkAll}
          >
            Mark All Read
          </ActionButton>
        ) : undefined}
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
            {[
              { label: 'All', v: false },
              { label: 'Unread Only', v: true },
            ].map(tab => (
              <button
                key={tab.label}
                onClick={() => setUnreadOnly(tab.v)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor: unreadOnly === tab.v ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: unreadOnly === tab.v ? 'var(--accent-primary)' + '18' : 'var(--bg-surface)',
                  color: unreadOnly === tab.v ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {tab.label}
                {tab.v && !isLoading && unreadCount > 0 && (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              {!isLoading && `${total} total`}
            </span>
          </div>

          {/* Notification list */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
            ) : data.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '0.75rem' }}>
                <BellOff size={44} style={{ color: 'var(--text-muted)' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {unreadOnly ? 'All caught up!' : 'No notifications'}
                </p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                  {unreadOnly ? 'You have no unread notifications.' : 'Notifications will appear here.'}
                </p>
              </div>
            ) : (
              data.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.1rem 1.25rem',
                    borderBottom: i < data.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    backgroundColor: n.isRead ? 'transparent' : 'rgba(59,130,246,0.03)',
                    transition: 'background-color 150ms',
                    cursor: 'default',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = n.isRead ? 'transparent' : 'rgba(59,130,246,0.03)'; }}
                >
                  {/* Unread indicator */}
                  {!n.isRead && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: '0 4px 4px 0',
                    }} />
                  )}

                  {/* Type icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: TYPE_BG[n.type] ?? 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {TYPE_ICONS[n.type] ?? <Bell size={18} style={{ color: 'var(--text-tertiary)' }} />}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: n.isRead ? 400 : 600,
                        color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)',
                        lineHeight: 1.4,
                      }}>
                        {n.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <StatusBadge status={n.priority} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.3rem', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                  </div>

                  {/* Mark read button */}
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      disabled={markingId === n.id}
                      title="Mark as read"
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.725rem',
                        fontWeight: 500,
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-tertiary)',
                        cursor: markingId === n.id ? 'not-allowed' : 'pointer',
                        opacity: markingId === n.id ? 0.5 : 1,
                        transition: 'all 150ms',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    >
                      <CheckCheck size={12} />
                      Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};
