import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavItem { label: string; path: string; icon: string; }

const NAV: Record<string, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Employees', path: '/admin/employees', icon: '👥' },
    { label: 'Assets', path: '/admin/assets', icon: '📦' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ],
  ASSET_MANAGER: [
    { label: 'Dashboard', path: '/asset-manager', icon: '📊' },
    { label: 'Assets', path: '/asset-manager/assets', icon: '📦' },
    { label: 'Requests', path: '/asset-manager/requests', icon: '📋' },
    { label: 'Maintenance', path: '/asset-manager/maintenance', icon: '🔧' },
    { label: 'Reports', path: '/asset-manager/reports', icon: '📈' },
  ],
  DEPARTMENT_HEAD: [
    { label: 'Dashboard', path: '/dept-head', icon: '📊' },
    { label: 'Assets', path: '/dept-head/assets', icon: '📦' },
    { label: 'Employees', path: '/dept-head/employees', icon: '👥' },
    { label: 'Requests', path: '/dept-head/requests', icon: '📋' },
    { label: 'Maintenance', path: '/dept-head/maintenance', icon: '🔧' },
    { label: 'Reports', path: '/dept-head/reports', icon: '📈' },
    { label: 'Notifications', path: '/dept-head/notifications', icon: '🔔' },
  ],
  EMPLOYEE: [
    { label: 'Dashboard', path: '/employee', icon: '📊' },
    { label: 'My Assets', path: '/employee/my-assets', icon: '📦' },
    { label: 'Requests', path: '/employee/requests', icon: '📋' },
    { label: 'Notifications', path: '/employee/notifications', icon: '🔔' },
    { label: 'Profile', path: '/employee/profile', icon: '👤' },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#ef4444',
  ASSET_MANAGER: '#f59e0b',
  DEPARTMENT_HEAD: '#8b5cf6',
  EMPLOYEE: '#10b981',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  ASSET_MANAGER: 'Asset Manager',
  DEPARTMENT_HEAD: 'Dept Head',
  EMPLOYEE: 'Employee',
};

interface AppShellProps { role: string; }

export const AppShell: React.FC<AppShellProps> = ({ role }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = NAV[role] || [];
  const color = ROLE_COLORS[role] || '#3b82f6';
  const isDark = theme === 'dark';

  const sidebarBg = isDark ? '#0f172a' : '#ffffff';
  const mainBg = isDark ? '#111827' : '#f8fafc';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const navHover = isDark ? '#1e293b' : '#f1f5f9';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif", background: mainBg }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '240px' : '64px',
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 250ms ease',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? '1rem' : '0.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          borderBottom: `1px solid ${borderColor}`,
          minHeight: '64px',
          boxSizing: 'border-box',
        }}>
          {sidebarOpen ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                }}>AF</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: textPrimary }}>AssetFlow</div>
                  <div style={{ fontSize: '0.7rem', color: textMuted }}>ERP Platform</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(o => !o)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontSize: '1.1rem', flexShrink: 0 }}
              >
                ◀
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: textMuted,
                fontSize: '1.25rem',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 0',
              }}
            >
              ▶
            </button>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ padding: '0.375rem 0.75rem', borderRadius: '20px', background: `${color}20`, border: `1px solid ${color}40`, display: 'inline-block' }}>
              <span style={{ color, fontSize: '0.75rem', fontWeight: 600 }}>{ROLE_LABELS[role]}</span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/asset-manager' || item.path === '/dept-head' || item.path === '/employee'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.75rem', borderRadius: '8px', marginBottom: '2px',
                textDecoration: 'none', color: isActive ? color : textPrimary,
                background: isActive ? `${color}15` : 'transparent',
                fontWeight: isActive ? 600 : 400, fontSize: '0.875rem',
                border: isActive ? `1px solid ${color}30` : '1px solid transparent',
                transition: 'all 150ms',
              })}
              onMouseEnter={e => { if (!(e.currentTarget.style.background.includes('15'))) e.currentTarget.style.background = navHover; }}
              onMouseLeave={e => { if (!(e.currentTarget.style.background.includes('15'))) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: User + Theme */}
        <div style={{ borderTop: `1px solid ${borderColor}`, padding: '0.75rem' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none',
              background: 'none', color: textMuted, cursor: 'pointer', fontSize: '0.85rem',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{isDark ? '☀️' : '🌙'}</span>
            {sidebarOpen && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize: '0.7rem', color: textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.employeeCode}</div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontSize: '1rem' }}>
                🚪
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          height: '64px', borderBottom: `1px solid ${borderColor}`,
          background: sidebarBg, display: 'flex', alignItems: 'center',
          padding: '0 1.5rem', gap: '1rem', flexShrink: 0,
        }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: textPrimary }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: textMuted }}>{user?.companyName} · {user?.companyCode}</div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
