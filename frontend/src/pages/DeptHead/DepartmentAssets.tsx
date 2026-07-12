// ============================================================
// src/pages/DeptHead/DepartmentAssets.tsx
// Department Assets – table with search, filters, pagination
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Package } from 'lucide-react';
import { getDepartmentAssets, DeptAsset } from '../../services/departmentHeadService';
import { PageHeader } from './components/PageHeader';
import { SearchAndFilter } from './components/SearchAndFilter';
import { StatusBadge } from './components/StatusBadge';
import { DataTable, Column } from './components/DataTable';
import { Pagination } from './components/Pagination';
import { ErrorState } from './components/ErrorState';

const STATUS_OPTIONS = [
  { label: 'Available', value: 'Available' },
  { label: 'Allocated', value: 'Allocated' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Reserved', value: 'Reserved' },
  { label: 'Lost', value: 'Lost' },
  { label: 'Retired', value: 'Retired' },
];

export const DepartmentAssets: React.FC = () => {
  const [data, setData] = useState<DeptAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getDepartmentAssets(page, LIMIT, search, statusFilter);
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter/search change
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const columns: Column<DeptAsset>[] = [
    {
      key: 'assetTag',
      label: 'Asset Tag',
      width: '110px',
      render: (v) => (
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 600 }}>
          {String(v ?? '—')}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Asset Name',
      render: (_, row) => (
        <div>
          <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '1px' }}>
            S/N: {row.serialNumber}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (v) => (
        <span style={{
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          backgroundColor: 'var(--bg-surface-elevated)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
        }}>
          {String(v ?? '—')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{String(v ?? '—')}</span>,
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (v) => v ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)' + '22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)',
          }}>
            {String(v).charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{String(v)}</span>
        </div>
      ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unassigned</span>,
    },
    {
      key: 'acquisitionCost',
      label: 'Value',
      align: 'right',
      render: (v) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          ${Number(v ?? 0).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Department Assets"
        subtitle="All assets assigned to your department."
        breadcrumbs={[{ label: 'Department Assets' }]}
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          {/* Summary strip */}
          {!isLoading && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
              padding: '0.875rem 1.25rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
            }}>
              {[
                { label: 'Total', value: total, color: 'var(--accent-primary)' },
                { label: 'Available', value: data.filter(d => d.status === 'Available').length, color: '#10b981' },
                { label: 'Allocated', value: data.filter(d => d.status === 'Allocated').length, color: '#3b82f6' },
                { label: 'In Maintenance', value: data.filter(d => d.status === 'Under Maintenance').length, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{s.label}:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          <SearchAndFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search assets, serial numbers…"
            filters={[{
              label: 'Status',
              value: statusFilter,
              options: STATUS_OPTIONS,
              onChange: setStatusFilter,
            }]}
          />

          <DataTable<DeptAsset>
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowKey={r => r.id}
            emptyTitle="No assets found"
            emptySubtitle="Try adjusting search or filter criteria."
            emptyIcon={<Package size={40} />}
          />

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
