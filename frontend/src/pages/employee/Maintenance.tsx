import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/employee/StatusBadge';
import { Timeline } from '../../components/employee/Timeline';
import { getMaintenanceRequests, createMaintenanceRequest, getMyAssets } from '../../services/mock/employeeData';
import type { MaintenanceRequest as MR, MaintenancePriority, Asset } from '../../types/models';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

export const Maintenance: React.FC = () => {
  const [requests, setRequests] = useState<MR[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [selAssetId, setSelAssetId] = useState('');
  const [mntPriority, setMntPriority] = useState<MaintenancePriority>('Medium');
  const [mntDesc, setMntDesc] = useState('');

  const reload = () => { setRequests(getMaintenanceRequests()); setAssets(getMyAssets()); };
  useEffect(() => { reload(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selAssetId || !mntDesc.trim()) return;
    const asset = assets.find(a => a.id === selAssetId);
    if (!asset) return;
    createMaintenanceRequest({ assetId: asset.id, assetName: asset.name, priority: mntPriority, description: mntDesc });
    setShowForm(false); setSelAssetId(''); setMntDesc(''); setMntPriority('Medium');
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Maintenance</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Raise and track maintenance requests for your assigned assets.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Raise Request
        </Button>
      </header>

      {showForm && (
        <Card title="New Maintenance Request">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
            <div className="input-group">
              <label className="input-label">Select Assigned Asset *</label>
              <select className="input-field" value={selAssetId} onChange={e => setSelAssetId(e.target.value)}>
                <option value="">-- Select Asset --</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.image} {a.name} ({a.tag})</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Priority</label>
              <select className="input-field" value={mntPriority} onChange={e => setMntPriority(e.target.value as MaintenancePriority)}>
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Issue Description *</label>
              <textarea className="input-field" rows={4} placeholder="Describe the issue in detail..." value={mntDesc} onChange={e => setMntDesc(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Button type="submit" disabled={!selAssetId || !mntDesc.trim()}>Submit Request</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Maintenance Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {requests.length === 0 && (
          <Card><p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--spacing-8)' }}>No maintenance requests yet.</p></Card>
        )}
        {requests.map(r => (
          <Card key={r.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                  <h4 style={{ fontWeight: 'var(--font-weight-semibold)' }}>{r.assetName}</h4>
                  <StatusBadge status={r.status} />
                  <StatusBadge status={r.priority} />
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{r.description}</p>
                {r.technicianName && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-1)' }}>Technician: {r.technicianName}</p>}
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
