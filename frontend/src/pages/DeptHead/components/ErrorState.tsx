// ============================================================
// src/pages/DeptHead/components/ErrorState.tsx
// Reusable error state display with retry action
// ============================================================

import React from 'react';
import { AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import { ActionButton } from './ActionButton';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const isUnauthorized = message === 'UNAUTHORIZED';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: isUnauthorized ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isUnauthorized
          ? <Lock size={26} style={{ color: '#f59e0b' }} />
          : <AlertTriangle size={26} style={{ color: '#ef4444' }} />
        }
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          {isUnauthorized ? 'Access Denied' : 'Something went wrong'}
        </p>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '0.3rem', maxWidth: '360px' }}>
          {isUnauthorized
            ? 'You do not have permission to view this resource. Please contact your administrator.'
            : message}
        </p>
      </div>
      {onRetry && !isUnauthorized && (
        <ActionButton onClick={onRetry} variant="secondary" icon={RefreshCw} size="sm">
          Try Again
        </ActionButton>
      )}
    </div>
  );
};
