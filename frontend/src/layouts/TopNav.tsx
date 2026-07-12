import React from 'react';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TopNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '73px',
      backgroundColor: 'var(--bg-base)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-6)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-2) var(--spacing-3)',
          width: '100%',
          maxWidth: '400px',
        }}>
          <Search size={18} color="var(--text-tertiary)" style={{ marginRight: 'var(--spacing-2)' }} />
          <input 
            type="text" 
            placeholder="Search assets, users, or requests..." 
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: 'var(--font-size-sm)',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <button style={{
          position: 'relative',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '10px',
            height: '10px',
            backgroundColor: 'var(--accent-danger)',
            borderRadius: '50%',
            border: '2px solid var(--bg-base)',
          }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--spacing-4)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              {user?.role}
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <UserIcon size={20} color="var(--text-secondary)" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
