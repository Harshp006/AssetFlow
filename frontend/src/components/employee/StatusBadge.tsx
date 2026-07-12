import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, { bg: string; text: string }> = {
  'Active': { bg: 'var(--accent-secondary)', text: 'var(--text-on-accent)' },
  'Excellent': { bg: 'var(--accent-secondary)', text: 'var(--text-on-accent)' },
  'Good': { bg: 'var(--accent-primary)', text: 'var(--text-on-accent)' },
  'Fair': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'Poor': { bg: 'var(--accent-danger)', text: 'var(--text-on-accent)' },
  'Pending': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'Approved': { bg: 'var(--accent-secondary)', text: 'var(--text-on-accent)' },
  'Rejected': { bg: 'var(--accent-danger)', text: 'var(--text-on-accent)' },
  'Allocated': { bg: 'var(--accent-primary)', text: 'var(--text-on-accent)' },
  'In Maintenance': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'Returned': { bg: 'var(--text-tertiary)', text: 'var(--text-on-accent)' },
  'Upcoming': { bg: 'var(--accent-primary)', text: 'var(--text-on-accent)' },
  'Ongoing': { bg: 'var(--accent-secondary)', text: 'var(--text-on-accent)' },
  'Completed': { bg: 'var(--accent-secondary)', text: 'var(--text-on-accent)' },
  'Cancelled': { bg: 'var(--accent-danger)', text: 'var(--text-on-accent)' },
  'Assigned': { bg: 'var(--accent-primary)', text: 'var(--text-on-accent)' },
  'In Progress': { bg: 'var(--accent-primary)', text: 'var(--text-on-accent)' },
  'Resolved': { bg: 'var(--accent-secondary)', text: 'var(--text-on-accent)' },
  'Pending Department Approval': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'Pending Asset Manager': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'Pending Return Inspection': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'Low': { bg: 'var(--text-tertiary)', text: 'var(--text-on-accent)' },
  'Medium': { bg: 'var(--accent-warning)', text: 'var(--text-on-accent)' },
  'High': { bg: 'var(--accent-danger)', text: 'var(--text-on-accent)' },
  'Critical': { bg: 'var(--accent-danger)', text: 'var(--text-on-accent)' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const colors = colorMap[status] || { bg: 'var(--text-tertiary)', text: 'var(--text-on-accent)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: size === 'sm' ? 'var(--font-size-xs)' : 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      backgroundColor: colors.bg,
      color: colors.text,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
};
