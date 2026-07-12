import React from 'react';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your application preferences and configurations.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)', maxWidth: '800px' }}>
        <Card title="Appearance" description="Customize how the application looks on your device.">
          <div style={{ 
            marginTop: 'var(--spacing-6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--bg-base)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                Theme preference
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>
                Switch between light and dark mode.
              </p>
            </div>
            
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                padding: 'var(--spacing-2)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-full)',
                position: 'relative',
                width: '72px',
                height: '36px',
                cursor: 'pointer',
                transition: 'background-color var(--transition-fast)'
              }}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: theme === 'light' ? '2px' : 'calc(100% - 32px)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'left var(--transition-normal)',
                boxShadow: 'var(--shadow-sm)'
              }} />
              <div style={{ 
                position: 'absolute', left: '8px', zIndex: 1, 
                color: theme === 'light' ? 'var(--text-on-accent)' : 'var(--text-tertiary)',
                transition: 'color var(--transition-fast)'
              }}>
                <Sun size={16} />
              </div>
              <div style={{ 
                position: 'absolute', right: '8px', zIndex: 1, 
                color: theme === 'dark' ? 'var(--text-on-accent)' : 'var(--text-tertiary)',
                transition: 'color var(--transition-fast)'
              }}>
                <Moon size={16} />
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
