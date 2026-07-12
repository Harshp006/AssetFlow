import React, { useState, useEffect } from 'react';

import { StatusBadge } from '../../components/employee/StatusBadge';
import { Button } from '../../components/ui/Button';
import { getMyAssets, createMaintenanceRequest, createTransferRequest, createReturnRequest } from '../../services/mock/employeeData';
import type { Asset, MaintenancePriority } from '../../types/models';
import { Wrench, ArrowRightLeft, Undo2, History, X, Search } from 'lucide-react';

type ModalType = 'maintenance' | 'transfer' | 'return' | 'history' | null;

export const MyAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Maintenance form
  const [mntPriority, setMntPriority] = useState<MaintenancePriority>('Medium');
  const [mntDesc, setMntDesc] = useState('');
  // Transfer form
  const [tfTo, setTfTo] = useState('');
  const [tfType, setTfType] = useState<'Employee' | 'Department'>('Employee');
  const [tfReason, setTfReason] = useState('');
  // Return form
  const [retNotes, setRetNotes] = useState('');

  const reload = () => setAssets(getMyAssets());
  useEffect(() => { reload(); }, []);

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.tag.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (type: ModalType, asset: Asset) => { setSelectedAsset(asset); setModalType(type); setMntDesc(''); setMntPriority('Medium'); setTfTo(''); setTfReason(''); setRetNotes(''); };
  const closeModal = () => { setModalType(null); setSelectedAsset(null); };

  const handleMaintenance = () => {
    if (!selectedAsset || !mntDesc.trim()) return;
    createMaintenanceRequest({ assetId: selectedAsset.id, assetName: selectedAsset.name, priority: mntPriority, description: mntDesc });
    closeModal(); reload();
  };
  const handleTransfer = () => {
    if (!selectedAsset || !tfTo.trim() || !tfReason.trim()) return;
    createTransferRequest({ assetId: selectedAsset.id, assetName: selectedAsset.name, transferTo: tfTo, transferType: tfType, reason: tfReason });
    closeModal(); reload();
  };
  const handleReturn = () => {
    if (!selectedAsset) return;
    createReturnRequest({ assetId: selectedAsset.id, assetName: selectedAsset.name, notes: retNotes });
    closeModal(); reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>My Assets</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{assets.length} assets currently assigned to you.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-2) var(--spacing-3)', width: '280px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ marginRight: 'var(--spacing-2)' }} />
          <input type="text" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: 'var(--font-size-sm)' }} />
        </div>
      </header>

      {/* Asset Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Tag</th>
              <th>Category</th>
              <th>Serial No.</th>
              <th>Status</th>
              <th>Condition</th>
              <th>Location</th>
              <th>Allocated</th>
              <th>Return By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(asset => (
              <tr key={asset.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span style={{ fontSize: '1.25rem' }}>{asset.image}</span>
                    <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{asset.name}</span>
                  </div>
                </td>
                <td><code style={{ fontSize: 'var(--font-size-xs)', backgroundColor: 'var(--bg-surface-hover)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>{asset.tag}</code></td>
                <td>{asset.category}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{asset.serialNumber}</td>
                <td><StatusBadge status={asset.status} /></td>
                <td><StatusBadge status={asset.condition} /></td>
                <td>{asset.location}</td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{asset.allocationDate}</td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{asset.expectedReturnDate}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                    <button title="Raise Maintenance" onClick={() => openModal('maintenance', asset)} style={{ padding: '4px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-warning)' }}><Wrench size={15} /></button>
                    <button title="Transfer" onClick={() => openModal('transfer', asset)} style={{ padding: '4px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}><ArrowRightLeft size={15} /></button>
                    <button title="Return" onClick={() => openModal('return', asset)} style={{ padding: '4px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-danger)' }}><Undo2 size={15} /></button>
                    <button title="History" onClick={() => openModal('history', asset)} style={{ padding: '4px', borderRadius: 'var(--radius-sm)', color: 'var(--text-tertiary)' }}><History size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-tertiary)' }}>No assets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Backdrop */}
      {modalType && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', width: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                {modalType === 'maintenance' && 'Raise Maintenance'}
                {modalType === 'transfer' && 'Transfer Asset'}
                {modalType === 'return' && 'Return Asset'}
                {modalType === 'history' && 'Asset History'}
              </h3>
              <button onClick={closeModal} style={{ color: 'var(--text-tertiary)' }}><X size={20} /></button>
            </div>

            {selectedAsset && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
                <span style={{ fontSize: '1.5rem' }}>{selectedAsset.image}</span>
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{selectedAsset.name}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{selectedAsset.tag} · {selectedAsset.serialNumber}</p>
                </div>
              </div>
            )}

            {/* Maintenance Form */}
            {modalType === 'maintenance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div className="input-group">
                  <label className="input-label">Priority</label>
                  <select className="input-field" value={mntPriority} onChange={e => setMntPriority(e.target.value as MaintenancePriority)}>
                    <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Issue Description *</label>
                  <textarea className="input-field" rows={4} placeholder="Describe the issue..." value={mntDesc} onChange={e => setMntDesc(e.target.value)} />
                </div>
                <Button onClick={handleMaintenance} disabled={!mntDesc.trim()}>Submit Request</Button>
              </div>
            )}

            {/* Transfer Form */}
            {modalType === 'transfer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div className="input-group">
                  <label className="input-label">Transfer Type</label>
                  <select className="input-field" value={tfType} onChange={e => setTfType(e.target.value as 'Employee' | 'Department')}>
                    <option value="Employee">Employee</option><option value="Department">Department</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Transfer To *</label>
                  <input className="input-field" placeholder={tfType === 'Employee' ? 'Employee name...' : 'Department name...'} value={tfTo} onChange={e => setTfTo(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Reason *</label>
                  <textarea className="input-field" rows={3} placeholder="Reason for transfer..." value={tfReason} onChange={e => setTfReason(e.target.value)} />
                </div>
                <Button onClick={handleTransfer} disabled={!tfTo.trim() || !tfReason.trim()}>Submit Transfer</Button>
              </div>
            )}

            {/* Return Confirm */}
            {modalType === 'return' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Are you sure you want to initiate a return for this asset?</p>
                <div className="input-group">
                  <label className="input-label">Return Notes (optional)</label>
                  <textarea className="input-field" rows={3} placeholder="Any notes about the condition..." value={retNotes} onChange={e => setRetNotes(e.target.value)} />
                </div>
                <Button variant="danger" onClick={handleReturn}>Confirm Return</Button>
              </div>
            )}

            {/* History */}
            {modalType === 'history' && selectedAsset && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Allocated On</span><span>{selectedAsset.allocationDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Expected Return</span><span>{selectedAsset.expectedReturnDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Condition</span><StatusBadge status={selectedAsset.condition} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Status</span><StatusBadge status={selectedAsset.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Value</span><span>${selectedAsset.value.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
