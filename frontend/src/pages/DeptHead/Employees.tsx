// ============================================================
// src/pages/DeptHead/Employees.tsx
// Department Employees – list with search and profile view
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Mail, Phone, Package, UserCheck, UserX } from 'lucide-react';
import { getDepartmentEmployees, DeptEmployee } from '../../services/departmentHeadService';
import { PageHeader } from './components/PageHeader';
import { SearchAndFilter } from './components/SearchAndFilter';
import { StatusBadge } from './components/StatusBadge';
import { Pagination } from './components/Pagination';
import { ErrorState } from './components/ErrorState';

const AVATAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

export const Employees: React.FC = () => {
  const [data, setData] = useState<DeptEmployee[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getDepartmentEmployees(page, LIMIT, search);
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const SkeletonCard = () => (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
      {[55, 80, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? '48px' : '12px',
          width: i === 0 ? '48px' : `${w}%`,
          borderRadius: i === 0 ? '50%' : '6px',
          backgroundColor: 'var(--bg-surface-elevated)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Department Employees"
        subtitle={`${total} member${total !== 1 ? 's' : ''} in your department.`}
        breadcrumbs={[{ label: 'Employees' }]}
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          <SearchAndFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search employees by name or email…"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : data.length === 0
              ? (
                <div style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4rem 2rem',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                }}>
                  <Users size={40} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No employees found</p>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>Try adjusting your search.</p>
                </div>
              )
              : data.map(emp => (
                <div key={emp.id} style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  transition: 'box-shadow 150ms, border-color 150ms',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  {/* Avatar + Name row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: avatarColor(emp.name) + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 700, color: avatarColor(emp.name),
                      border: `2px solid ${avatarColor(emp.name)}44`,
                    }}>
                      {initials(emp.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {emp.name}
                      </p>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)', marginTop: '1px' }}>{emp.designation || 'Team Member'}</p>
                    </div>
                    <StatusBadge status={emp.status} />
                  </div>

                  {/* Contact info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {emp.email}
                      </span>
                    </div>
                    {emp.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{emp.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Package size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>Assets:</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {emp.assignedAssets}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                      {emp.status === 'Active'
                        ? <UserCheck size={14} style={{ color: '#10b981' }} />
                        : <UserX size={14} style={{ color: 'var(--text-muted)' }} />}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Joined {new Date(emp.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
