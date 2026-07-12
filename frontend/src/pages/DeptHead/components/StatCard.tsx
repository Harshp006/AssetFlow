// ============================================================
// src/pages/DeptHead/components/StatCard.tsx
// KPI metric card for dashboards
// ============================================================

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  trend?: { value: number; label: string; positive: boolean };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'box-shadow 200ms',
      cursor: 'default',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </p>
          <p style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginTop: '0.3rem' }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{subtitle}</p>
          )}
        </div>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: color + '1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>

      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
        }}>
          <span style={{ color: trend.positive ? '#10b981' : '#ef4444', fontWeight: 600 }}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
};
