// ============================================================
// src/pages/DeptHead/components/DataTable.tsx
// Generic sortable data table with loading/empty states
// ============================================================

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyIcon?: React.ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

const LoadingRow = ({ colCount }: { colCount: number }) => (
  <tr>
    <td colSpan={colCount} style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-tertiary)' }}>
        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.875rem' }}>Loading data…</span>
      </div>
    </td>
  </tr>
);

const EmptyRow = ({
  colCount, title, subtitle, icon,
}: { colCount: number; title: string; subtitle?: string; icon?: React.ReactNode }) => (
  <tr>
    <td colSpan={colCount} style={{ padding: '3.5rem', textAlign: 'center' }}>
      {icon && <div style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}>{icon}</div>}
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</p>
      {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>{subtitle}</p>}
    </td>
  </tr>
);

export function DataTable<T>({
  columns, data, isLoading, emptyTitle = 'No records found', emptySubtitle, emptyIcon, rowKey, onRowClick,
}: DataTableProps<T>) {
  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: '12px',
      border: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-surface)',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {columns.map(col => (
              <th key={String(col.key)} style={{
                padding: '0.875rem 1rem',
                textAlign: col.align ?? 'left',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                whiteSpace: 'nowrap',
                width: col.width,
                backgroundColor: 'var(--bg-surface)',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <LoadingRow colCount={columns.length} />
          ) : data.length === 0 ? (
            <EmptyRow colCount={columns.length} title={emptyTitle} subtitle={emptySubtitle} icon={emptyIcon} />
          ) : (
            data.map(row => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 150ms',
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {columns.map(col => {
                  const rawVal = (row as Record<string, unknown>)[col.key as string];
                  return (
                    <td key={String(col.key)} style={{
                      padding: '0.875rem 1rem',
                      textAlign: col.align ?? 'left',
                      color: 'var(--text-primary)',
                      verticalAlign: 'middle',
                    }}>
                      {col.render ? col.render(rawVal, row) : (rawVal != null ? String(rawVal) : '—')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
