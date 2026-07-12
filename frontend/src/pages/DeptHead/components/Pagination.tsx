// ============================================================
// src/pages/DeptHead/components/Pagination.tsx
// Pagination controls
// ============================================================

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, total, limit, onPageChange }) => {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.8rem',
    fontWeight: active ? 600 : 400,
    backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface)',
    color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 150ms',
  });

  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '1rem',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
        Showing {from}–{to} of {total} records
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={btnStyle(false, page === 1)}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === '…'
            ? <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>…</span>
            : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                style={btnStyle(p === page, false)}
              >
                {p}
              </button>
            )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={btnStyle(false, page === totalPages)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
