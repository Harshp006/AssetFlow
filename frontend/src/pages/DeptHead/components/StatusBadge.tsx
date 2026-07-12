// ============================================================
// src/pages/DeptHead/components/StatusBadge.tsx
// Reusable status badge with semantic colour coding
// ============================================================

import React from 'react';

type BadgeVariant =
  | 'Available' | 'Allocated' | 'Under Maintenance' | 'Reserved' | 'Lost' | 'Retired'
  | 'Pending' | 'Approved' | 'Rejected'
  | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  | 'LOW' | 'MEDIUM' | 'HIGH'
  | 'Active' | 'Inactive'
  | 'info' | 'warning' | 'success' | 'error'
  | string;

const variantStyles: Record<string, { bg: string; color: string; dot: string }> = {
  Available:          { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  Allocated:          { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', dot: '#3b82f6' },
  'Under Maintenance':{ bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  Reserved:           { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', dot: '#8b5cf6' },
  Lost:               { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', dot: '#ef4444' },
  Retired:            { bg: 'rgba(113,113,122,0.15)', color: '#71717a', dot: '#71717a' },

  Pending:            { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  PENDING:            { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  Approved:           { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  Rejected:           { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', dot: '#ef4444' },

  IN_PROGRESS:        { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', dot: '#3b82f6' },
  COMPLETED:          { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  CANCELLED:          { bg: 'rgba(113,113,122,0.15)', color: '#71717a', dot: '#71717a' },

  LOW:                { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  MEDIUM:             { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  HIGH:               { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', dot: '#ef4444' },
  Low:                { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  Medium:             { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  High:               { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', dot: '#ef4444' },

  Active:             { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  Inactive:           { bg: 'rgba(113,113,122,0.15)', color: '#71717a', dot: '#71717a' },

  info:               { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', dot: '#3b82f6' },
  success:            { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  warning:            { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  error:              { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', dot: '#ef4444' },
};

const labelMap: Record<string, string> = {
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

interface StatusBadgeProps {
  status: BadgeVariant;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true, size = 'sm' }) => {
  const style = variantStyles[status] ?? { bg: 'rgba(113,113,122,0.15)', color: '#71717a', dot: '#71717a' };
  const label = labelMap[status] ?? status;
  const padding = size === 'md' ? '0.375rem 0.75rem' : '0.2rem 0.55rem';
  const fontSize = size === 'md' ? '0.8rem' : '0.7rem';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding,
      borderRadius: '9999px',
      backgroundColor: style.bg,
      color: style.color,
      fontSize,
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {showDot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.dot,
          flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
};
