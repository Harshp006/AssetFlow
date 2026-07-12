import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getNotifications, markRead, markAllRead } from '../../services/mock/employeeData';
import type { AppNotification } from '../../types/models';
import { CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const navigate = useNavigate();

  const reload = () => setNotifications(getNotifications());
  useEffect(() => { reload(); }, []);

  const handleMarkRead = (id: string) => { markRead(id); reload(); };
  const handleMarkAllRead = () => { markAllRead(); reload(); };

  const filtered = filter === 'All' ? notifications : notifications.filter(n => !n.read);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Notifications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Stay updated on your requests, bookings, and asset statuses.</p>
        </div>
        <Button variant="secondary" onClick={handleMarkAllRead}>
          <CheckCheck size={16} /> Mark All Read
        </Button>
      </header>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <button onClick={() => setFilter('All')} className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 'var(--font-size-xs)' }}>All</button>
        <button onClick={() => setFilter('Unread')} className={`btn ${filter === 'Unread' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 'var(--font-size-xs)' }}>
          Unread {notifications.filter(n => !n.read).length > 0 && `(${notifications.filter(n => !n.read).length})`}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {filtered.length === 0 && (
          <Card><p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--spacing-8)' }}>No notifications to display.</p></Card>
        )}
        {filtered.map(n => (
          <Card key={n.id}>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.read ? 'transparent' : 'var(--accent-primary)', flexShrink: 0, marginTop: '8px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-1)' }}>
                  <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.title}</h4>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: n.read ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}>{n.message}</p>
                
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-3)' }}>
                  {n.link && (
                    <button onClick={() => { handleMarkRead(n.id); navigate(n.link!); }} style={{ color: 'var(--accent-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                      View Details
                    </button>
                  )}
                  {!n.read && (
                    <button onClick={() => handleMarkRead(n.id)} style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
