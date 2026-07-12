import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/employee/StatusBadge';
import { getMyAssets, getBookings, getAssetRequests, getMaintenanceRequests, getNotifications } from '../../services/mock/employeeData';
import { Package, Calendar, ClipboardList, Wrench, RotateCcw, Plus, CalendarPlus, AlertTriangle, ArrowRightLeft, Undo2 } from 'lucide-react';
import type { Asset, Booking, AppNotification } from '../../types/models';

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [activeMaintenance, setActiveMaintenance] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setAssets(getMyAssets());
    const bks = getBookings();
    setBookings(bks.filter(b => b.status === 'Upcoming'));
    setPendingRequests(getAssetRequests().filter(r => r.status === 'Pending').length);
    setActiveMaintenance(getMaintenanceRequests().filter(m => !['Resolved', 'Rejected'].includes(m.status)).length);
    setNotifications(getNotifications().filter(n => !n.read).slice(0, 5));
  }, []);

  const upcomingReturns = assets.filter(a => a.expectedReturnDate).sort((a, b) => (a.expectedReturnDate! > b.expectedReturnDate! ? 1 : -1)).slice(0, 3);

  const kpis = [
    { title: 'My Assets', value: assets.length, icon: Package, color: 'var(--accent-primary)' },
    { title: 'Active Bookings', value: bookings.length, icon: Calendar, color: 'var(--accent-secondary)' },
    { title: 'Pending Requests', value: pendingRequests, icon: ClipboardList, color: 'var(--accent-warning)' },
    { title: 'Active Maintenance', value: activeMaintenance, icon: Wrench, color: 'var(--accent-danger)' },
    { title: 'Upcoming Returns', value: upcomingReturns.length, icon: RotateCcw, color: 'var(--text-tertiary)' },
  ];

  const quickActions = [
    { label: 'Request Asset', icon: Plus, path: '/employee/request-asset', color: 'var(--accent-primary)' },
    { label: 'Book Resource', icon: CalendarPlus, path: '/employee/bookings', color: 'var(--accent-secondary)' },
    { label: 'Raise Maintenance', icon: AlertTriangle, path: '/employee/maintenance', color: 'var(--accent-warning)' },
    { label: 'Transfer Asset', icon: ArrowRightLeft, path: '/employee/transfers', color: 'var(--accent-primary)' },
    { label: 'Return Asset', icon: Undo2, path: '/employee/returns', color: 'var(--accent-danger)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>My Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here's a summary of your assets and activities.</p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>{kpi.title}</p>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>{kpi.value}</h2>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-full)', backgroundColor: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                <kpi.icon size={22} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
          {quickActions.map((action, idx) => (
            <button key={idx} onClick={() => navigate(action.path)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-3) var(--spacing-4)' }}>
              <action.icon size={16} style={{ color: action.color }} />
              {action.label}
            </button>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        {/* Recent Notifications */}
        <Card title="Recent Notifications" headerAction={
          <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)' }} onClick={() => navigate('/employee/notifications')}>View All</button>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
            {notifications.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No unread notifications.</p>}
            {notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', flexShrink: 0, marginTop: '6px' }} />
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>{n.title}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Bookings */}
        <Card title="Upcoming Bookings" headerAction={
          <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)' }} onClick={() => navigate('/employee/bookings')}>View All</button>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
            {bookings.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No upcoming bookings.</p>}
            {bookings.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>{b.resourceName}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{b.date} · {b.startTime} – {b.endTime}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Returns */}
      <Card title="Upcoming Expected Returns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
          {upcomingReturns.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>No upcoming returns.</p>}
          {upcomingReturns.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <span style={{ fontSize: '1.5rem' }}>{a.image}</span>
                <div>
                  <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>{a.name}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{a.tag}</p>
                </div>
              </div>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{a.expectedReturnDate}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
