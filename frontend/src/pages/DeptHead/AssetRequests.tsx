// ============================================================
// src/pages/DeptHead/AssetRequests.tsx
// Department Asset Requests – create, view, and filter history
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Plus, X, ChevronDown } from 'lucide-react';
import {
  getDepartmentRequests, createAssetRequest,
  AssetRequest, CreateAssetRequestPayload,
} from '../../services/departmentHeadService';
import { PageHeader } from './components/PageHeader';
import { SearchAndFilter } from './components/SearchAndFilter';
import { StatusBadge } from './components/StatusBadge';
import { DataTable, Column } from './components/DataTable';
import { Pagination } from './components/Pagination';
import { ErrorState } from './components/ErrorState';
import { ActionButton } from './components/ActionButton';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const PRIORITY_OPTIONS: { label: string; value: 'Low' | 'Medium' | 'High' }[] = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
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

interface FormState {
  assetId: string;
  reason: string;
  priority: 'Low' | 'Medium' | 'High';
}

const FORM_DEFAULTS: FormState = { assetId: '', reason: '', priority: 'Medium' };

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

export const AssetRequests: React.FC = () => {
  const [data, setData] = useState<AssetRequest[]>([]);
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
      const res = await getDepartmentRequests(page, LIMIT, statusFilter);
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
    if (!form.reason.trim()) {
      setSubmitError('Reason is required.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload: CreateAssetRequestPayload = {
        reason: form.reason,
        priority: form.priority,
        ...(form.assetId ? { assetId: form.assetId } : {}),
      };
      await createAssetRequest(payload);
      setSuccessMsg('Request submitted successfully!');
      setShowModal(false);
      setForm(FORM_DEFAULTS);
      load();
    } catch (e: unknown) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<AssetRequest>[] = [
    {
      key: 'id',
      label: '#',
      width: '60px',
      render: (_, row) => (
        <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>
          {row.id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'assetName',
      label: 'Asset',
      render: (v, row) => (
        <div>
          <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            {String(v ?? 'General Request')}
          </p>
          {row.assetId && (
            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '1px' }}>ID: {row.assetId}</p>
          )}
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (v) => (
        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '280px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {String(v)}
        </span>
      ),
    },
    { key: 'priority', label: 'Priority', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
    {
      key: 'createdAt',
      label: 'Submitted',
      render: (v) => (
        <span style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>{timeAgo(String(v))}</span>
      ),
    },
    {
      key: 'resolvedBy',
      label: 'Resolved By',
      render: (v, row) => row.resolvedBy ? (
        <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{String(v)}</span>
      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Asset Requests"
        subtitle="Create and track your department's asset requests."
        breadcrumbs={[{ label: 'Asset Requests' }]}
        actions={
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => { setShowModal(true); setSuccessMsg(null); setSubmitError(null); }}
          >
            New Request
          </ActionButton>
        }
      />

      {/* Success Banner */}
      {successMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          backgroundColor: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '8px',
          color: '#10b981',
          fontSize: '0.875rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {successMsg}
          <button onClick={() => setSuccessMsg(null)} style={{ color: '#10b981', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          <SearchAndFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search requests…"
            filters={[{
              label: 'Status',
              value: statusFilter,
              options: STATUS_OPTIONS,
              onChange: setStatusFilter,
            }]}
          />

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {['', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor: statusFilter === s ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: statusFilter === s ? 'var(--accent-primary)' + '18' : 'var(--bg-surface)',
                  color: statusFilter === s ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {s === '' ? 'All Requests' : s}
                {s === 'Pending' && !isLoading && (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    backgroundColor: '#f59e0b22',
                    color: '#f59e0b',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    {data.filter(d => d.status === 'Pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <DataTable<AssetRequest>
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowKey={r => r.id}
            emptyTitle="No requests found"
            emptySubtitle='Click "New Request" to create your first asset request.'
            emptyIcon={<FileText size={40} />}
          />

          <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
        </>
      )}

      {/* Create Request Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); } }}
        >
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: '16px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>New Asset Request</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>Submit a request for asset allocation.</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Asset ID (optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave blank for general request"
                  value={form.assetId}
                  onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Reason <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  required
                  placeholder="Describe why you need this asset…"
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
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
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as 'Low' | 'Medium' | 'High' }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}
                  >
                    {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
              </div>

              {submitError && (
                <p style={{ fontSize: '0.825rem', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.6rem 0.875rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {submitError}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <ActionButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</ActionButton>
                <ActionButton variant="primary" type="submit" loading={submitting} icon={Plus}>
                  Submit Request
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
