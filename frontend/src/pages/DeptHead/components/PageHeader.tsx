// ============================================================
// src/pages/DeptHead/components/PageHeader.tsx
// Reusable page header with title, breadcrumb, and actions
// ============================================================

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions }) => {
  return (
    <div style={{
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.5rem',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Department Head</span>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                <span style={{
                  fontSize: '0.75rem',
                  color: i === breadcrumbs.length - 1 ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                }}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
        }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
};
