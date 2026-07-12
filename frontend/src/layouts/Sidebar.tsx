import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft, PenTool, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Assets', path: '/assets', icon: Package },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
    { name: 'Maintenance', path: '/maintenance', icon: PenTool },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

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
            {item.name}
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
