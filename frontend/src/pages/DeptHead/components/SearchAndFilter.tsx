// ============================================================
// src/pages/DeptHead/components/SearchAndFilter.tsx
// Search input + filter dropdowns toolbar
// ============================================================

import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  rightContent?: React.ReactNode;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchValue, onSearchChange, searchPlaceholder = 'Search…', filters, rightContent,
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap',
      marginBottom: '1.25rem',
    }}>
      {/* Search input */}
      <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
        <Search size={16} style={{
          position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-tertiary)', pointerEvents: 'none',
        }} />
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={{
            width: '100%',
            padding: '0.5rem 2.25rem 0.5rem 2.25rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)', display: 'flex', padding: '2px',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters */}
      {filters && filters.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          {filters.map(f => (
            <select
              key={f.label}
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">{f.label}: All</option>
              {f.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
        </div>
      )}

      {/* Right-side content (e.g. action buttons) */}
      {rightContent && <div style={{ marginLeft: 'auto' }}>{rightContent}</div>}
    </div>
  );
};
