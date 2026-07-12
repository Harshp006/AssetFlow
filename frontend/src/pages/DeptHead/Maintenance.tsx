// ============================================================
// src/pages/DeptHead/Maintenance.tsx
// Department Maintenance Requests – raise, track status, filter
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Wrench, Plus, X, ChevronDown, AlertTriangle } from 'lucide-react';
import {
  getDepartmentMaintenance, createMaintenanceRequest,
  MaintenanceRequest, CreateMaintenancePayload,
} from '../../services/departmentHeadService';
import { PageHeader } from './components/PageHeader';
import { SearchAndFilter } from './components/SearchAndFilter';
import { StatusBadge } from './components/StatusBadge';
import { DataTable, Column } from './components/DataTable';
import { Pagination } from './components/Pagination';
import { ErrorState } from './components/ErrorState';
import { ActionButton } from './components/ActionButton';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const PRIORITY_OPTIONS: { label: string; value: 'LOW' | 'MEDIUM' | 'HIGH' }[] = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

interface FormState { assetId: string; issue: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; }
const FORM_DEFAULTS: FormState = { assetId: '', issue: '', priority: 'MEDIUM' };

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.875rem',
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-strong)',
  borderRadius: '8px',
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
  outline: 'none',
};

export const Maintenance: React.FC = () => {
  const [data, setData] = useState<MaintenanceRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_DEFAULTS);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const LIMIT = 15;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getDepartmentMaintenance(page, LIMIT, statusFilter);
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.assetId.trim()) { setSubmitError('Asset ID is required.'); return; }
    if (!form.issue.trim()) { setSubmitError('Issue description is required.'); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload: CreateMaintenancePayload = { assetId: form.assetId, issue: form.issue, priority: form.priority };
      await createMaintenanceRequest(payload);
      setSuccessMsg('Maintenance request raised successfully!');
      setShowModal(false);
      setForm(FORM_DEFAULTS);
      load();
    } catch (e: unknown) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = search
    ? data.filter(d =>
        d.assetName.toLowerCase().includes(search.toLowerCase()) ||
        d.issue.toLowerCase().includes(search.toLowerCase()) ||
        d.assetTag.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const columns: Column<MaintenanceRequest>[] = [
    {
      key: 'assetTag',
      label: 'Asset',
      render: (_, row) => (
        <div>
          <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{row.assetName}</p>
          <p style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-tertiary)', marginTop: '1px' }}>{row.assetTag}</p>
        </div>
      ),
    },
    {
      key: 'issue',
      label: 'Issue',
      render: (v) => (
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '300px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {String(v)}
        </span>
      ),
    },
    { key: 'priority', label: 'Priority', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    {
      key: 'technician',
      label: 'Technician',
      render: (v) => v
        ? <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{String(v)}</span>
        : <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Unassigned</span>,
    },
    {
      key: 'createdAt',
      label: 'Raised',
      render: (v) => <span style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>{timeAgo(String(v))}</span>,
    },
    {
      key: 'completedAt',
      label: 'Resolved',
      render: (v) => v
        ? <span style={{ fontSize: '0.775rem', color: '#10b981' }}>{new Date(String(v)).toLocaleDateString()}</span>
        : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>,
    },
  ];

  const stats = [
    { label: 'Total', v: total, c: 'var(--accent-primary)' },
    { label: 'Pending', v: data.filter(d => d.status === 'PENDING').length, c: '#f59e0b' },
    { label: 'In Progress', v: data.filter(d => d.status === 'IN_PROGRESS').length, c: '#3b82f6' },
    { label: 'Completed', v: data.filter(d => d.status === 'COMPLETED').length, c: '#10b981' },
  ];

  return (
    <div>
      <PageHeader
        title="Maintenance Requests"
        subtitle="Raise and track maintenance tickets for your department's assets."
        breadcrumbs={[{ label: 'Maintenance' }]}
        actions={
          <ActionButton variant="primary" icon={Plus} onClick={() => { setShowModal(true); setSuccessMsg(null); setSubmitError(null); }}>
            Raise Ticket
          </ActionButton>
        }
      />

      {successMsg && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#10b981', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {successMsg}
          <button onClick={() => setSuccessMsg(null)} style={{ color: '#10b981', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          {/* Stats strip */}
          {!isLoading && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', padding: '0.875rem 1.25rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              {stats.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.c, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{s.label}:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.v}</span>
                </div>
              ))}
            </div>
          )}

          <SearchAndFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by asset name, tag, or issue…"
            filters={[{
              label: 'Status',
              value: statusFilter,
              options: STATUS_OPTIONS,
              onChange: setStatusFilter,
            }]}
          />

          <DataTable<MaintenanceRequest>
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            rowKey={r => r.id}
            emptyTitle="No maintenance tickets"
            emptySubtitle='Click "Raise Ticket" to report a new maintenance issue.'
            emptyIcon={<Wrench size={40} />}
          />

          <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
        </>
      )}

      {/* Raise Ticket Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Raise Maintenance Ticket</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>Report an issue for a department asset.</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Asset ID <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter the asset ID or asset tag"
                  value={form.assetId}
                  onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Issue Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  required
                  placeholder="Describe the issue in detail…"
                  value={form.issue}
                  onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Priority
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}
                  >
                    {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
              </div>

              {form.priority === 'HIGH' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.65rem 0.875rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
                  <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '0.775rem', color: '#ef4444', lineHeight: 1.4 }}>
                    HIGH priority tickets will be escalated immediately to the Asset Manager.
                  </p>
                </div>
              )}

              {submitError && (
                <p style={{ fontSize: '0.825rem', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.6rem 0.875rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {submitError}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <ActionButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</ActionButton>
                <ActionButton variant="primary" type="submit" loading={submitting} icon={Wrench}>
                  Submit Ticket
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
