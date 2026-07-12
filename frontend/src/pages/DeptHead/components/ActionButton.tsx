// ============================================================
// src/pages/DeptHead/components/ActionButton.tsx
// Standardised action buttons (primary, secondary, danger, ghost)
// ============================================================

import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary:   { backgroundColor: 'var(--accent-primary)',   color: '#fff', border: '1px solid var(--accent-primary)' },
  secondary: { backgroundColor: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)' },
  danger:    { backgroundColor: 'rgba(239,68,68,0.1)',     color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  ghost:     { backgroundColor: 'transparent',             color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' },
  success:   { backgroundColor: 'rgba(16,185,129,0.1)',    color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '0.4rem 0.875rem', fontSize: '0.775rem', gap: '0.35rem' },
  md: { padding: '0.55rem 1.125rem', fontSize: '0.875rem', gap: '0.5rem' },
  lg: { padding: '0.7rem 1.5rem', fontSize: '0.95rem', gap: '0.6rem' },
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  children, onClick, variant = 'secondary', size = 'md', icon: Icon,
  iconPosition = 'left', loading = false, disabled = false, type = 'button',
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all 150ms',
        flexShrink: 0,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      onMouseEnter={e => {
        if (!isDisabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
        }
      }}
      onMouseLeave={e => {
        if (!isDisabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        }
      }}
    >
      {loading && iconPosition === 'left' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={15} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={15} />}
      {loading && iconPosition === 'right' && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
    </button>
  );
};
