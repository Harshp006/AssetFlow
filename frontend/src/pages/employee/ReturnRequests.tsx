import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/employee/StatusBadge';
import { Timeline } from '../../components/employee/Timeline';
import { getReturnRequests, createReturnRequest, getMyAssets } from '../../services/mock/employeeData';
import type { ReturnRequest, Asset } from '../../types/models';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

export const ReturnRequests: React.FC = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [selAssetId, setSelAssetId] = useState('');
  const [retNotes, setRetNotes] = useState('');

  const reload = () => { setRequests(getReturnRequests()); setAssets(getMyAssets()); };
  useEffect(() => { reload(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAssetId) return;
    const asset = assets.find(a => a.id === selAssetId);
    if (!asset) return;
    createReturnRequest({ assetId: asset.id, assetName: asset.name, notes: retNotes });
    setShowForm(false); setSelAssetId(''); setRetNotes('');
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Return Requests</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Initiate returns for assets you no longer need or that are expiring.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Initiate Return
        </Button>
      </header>

      {showForm && (
        <Card title="Initiate Asset Return">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
            <div className="input-group">
              <label className="input-label">Select Assigned Asset *</label>
              <select className="input-field" value={selAssetId} onChange={e => setSelAssetId(e.target.value)}>
                <option value="">-- Select Asset --</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.image} {a.name} ({a.tag})</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Return Notes (Optional)</label>
              <textarea className="input-field" rows={3} placeholder="Any notes regarding the return or condition..." value={retNotes} onChange={e => setRetNotes(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Button type="submit" disabled={!selAssetId}>Submit Return</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {requests.length === 0 && (
          <Card><p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--spacing-8)' }}>No return requests yet.</p></Card>
        )}
        {requests.map(r => (
          <Card key={r.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                  <h4 style={{ fontWeight: 'var(--font-weight-semibold)' }}>{r.assetName}</h4>
                  <StatusBadge status={r.status} />
                </div>
                {r.notes && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Notes: {r.notes}</p>}
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-1)' }}>Submitted: {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} style={{ color: 'var(--text-tertiary)', padding: 'var(--spacing-2)' }}>
                {expandedId === r.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            {expandedId === r.id && (
              <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-3)' }}>Timeline</p>
                <Timeline events={r.timeline} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
