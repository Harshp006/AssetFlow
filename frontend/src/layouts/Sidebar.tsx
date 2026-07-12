import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft, PenTool, Calendar, FileText, Settings, LogOut, Plus, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/mock/employeeData';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Base Admin/Other roles nav items
  const defaultNavItems: Array<{ name: string, path: string, icon: any, badge?: number }> = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Assets', path: '/assets', icon: Package },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
    { name: 'Maintenance', path: '/maintenance', icon: PenTool },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Employee-specific nav items
  const employeeNavItems: Array<{ name: string, path: string, icon: any, badge?: number }> = [
    { name: 'Dashboard', path: '/employee', icon: LayoutDashboard },
    { name: 'My Assets', path: '/employee/my-assets', icon: Package },
    { name: 'Request Asset', path: '/employee/request-asset', icon: Plus },
    { name: 'Resource Booking', path: '/employee/bookings', icon: Calendar },
    { name: 'Maintenance', path: '/employee/maintenance', icon: PenTool },
    { name: 'Transfer Requests', path: '/employee/transfers', icon: ArrowRightLeft },
    { name: 'Return Requests', path: '/employee/returns', icon: ArrowRightLeft }, // Assuming same icon for now, could use a different one
    { name: 'Notifications', path: '/employee/notifications', icon: Bell, badge: getUnreadCount() },
    { name: 'Profile', path: '/employee/profile', icon: User },
  ];

  const navItems = user?.role === 'Employee' ? employeeNavItems : defaultNavItems;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <div style={{
        padding: 'var(--spacing-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-on-accent)',
          fontWeight: 'bold',
          fontSize: 'var(--font-size-lg)',
        }}>
          A
        </div>
        <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>AssetFlow</span>
      </div>

      <nav style={{ flex: 1, padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-3)',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--bg-surface-hover)' : 'transparent',
              fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
              transition: 'all var(--transition-fast)',
            })}
          >
            <item.icon size={20} />
            <span style={{ flex: 1 }}>{item.name}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-on-accent)', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            padding: 'var(--spacing-3)',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
