import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/employee/StatusBadge';
import { getAssetRequests, createAssetRequest } from '../../services/mock/employeeData';
import type { AssetRequest, AssetCategory, RequestPriority } from '../../types/models';
import { Plus } from 'lucide-react';

const categories: AssetCategory[] = ['Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Printer', 'Furniture', 'Vehicle', 'Projector', 'Other'];
const priorities: RequestPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const RequestAsset: React.FC = () => {
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<AssetCategory>('Laptop');
  const [preferred, setPreferred] = useState('');
  const [reason, setReason] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('Medium');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const reload = () => setRequests(getAssetRequests());
  useEffect(() => { reload(); }, []);

  const filtered = filterStatus === 'All' ? requests : requests.filter(r => r.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !returnDate) return;
    createAssetRequest({ category, preferredAsset: preferred || null, reason, expectedReturnDate: returnDate, priority });
    setShowForm(false); setCategory('Laptop'); setPreferred(''); setReason(''); setReturnDate(''); setPriority('Medium');
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Request Asset</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Submit new asset allocation requests and track their progress.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> New Request
        </Button>
      </header>

      {/* New Request Form */}
      {showForm && (
        <Card title="New Asset Request">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div className="input-group">
                <label className="input-label">Category *</label>
                <select className="input-field" value={category} onChange={e => setCategory(e.target.value as AssetCategory)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Priority *</label>
                <select className="input-field" value={priority} onChange={e => setPriority(e.target.value as RequestPriority)}>
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Preferred Asset (optional)</label>
              <input className="input-field" placeholder="e.g. iPad Pro 12.9&quot;" value={preferred} onChange={e => setPreferred(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Reason *</label>
              <textarea className="input-field" rows={3} placeholder="Why do you need this asset?" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Expected Return Date *</label>
              <input className="input-field" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Button type="submit" disabled={!reason.trim() || !returnDate}>Submit Request</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        {['All', 'Pending', 'Approved', 'Rejected', 'Allocated'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 'var(--font-size-xs)' }}>{s}</button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th><th>Preferred Asset</th><th>Reason</th><th>Priority</th><th>Return Date</th><th>Status</th><th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{r.category}</td>
                <td>{r.preferredAsset || '—'}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                <td><StatusBadge status={r.priority} /></td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{r.expectedReturnDate}</td>
                <td><StatusBadge status={r.status} /></td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-tertiary)' }}>No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
