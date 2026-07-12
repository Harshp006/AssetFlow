import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';
import { predefinedUsers } from '../../services/mockData';

export const RoleSwitcher: React.FC = () => {
  const { user, switchRole, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}>
      {isOpen && (
        <div className="glass-panel" style={{ 
          marginBottom: '0.5rem', 
          borderRadius: 'var(--radius-md)', 
          padding: 'var(--spacing-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-2)',
          width: '200px'
        }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>
            Dev Role Switcher
          </div>
          {predefinedUsers.map(u => (
            <button
              key={u.id}
              onClick={() => {
                switchRole(u.role);
                setIsOpen(false);
              }}
              style={{
                textAlign: 'left',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: user?.role === u.role ? 'var(--accent-primary)' : 'transparent',
                color: user?.role === u.role ? '#fff' : 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (user?.role !== u.role) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (user?.role !== u.role) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {u.role}
            </button>
          ))}
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-warning)',
          boxShadow: 'var(--shadow-lg)'
        }}
        title="Development Role Switcher"
      >
        <Shield size={20} />
      </button>
    </div>
  );
};
