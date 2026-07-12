import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/employee/StatusBadge';
import { getBookings, getResources, createBooking, cancelBooking, rescheduleBooking } from '../../services/mock/employeeData';
import type { Booking, Resource, ResourceType } from '../../types/models';
import { Plus, X, AlertCircle } from 'lucide-react';

const resourceTypes: ResourceType[] = ['Conference Room', 'Projector', 'Vehicle', 'Shared Equipment'];

export const ResourceBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [error, setError] = useState('');

  // Form state
  const [selResourceId, setSelResourceId] = useState('');
  const [selDate, setSelDate] = useState('');
  const [selStart, setSelStart] = useState('');
  const [selEnd, setSelEnd] = useState('');
  const [selPurpose, setSelPurpose] = useState('');

  // Reschedule state
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [resDate, setResDate] = useState('');
  const [resStart, setResStart] = useState('');
  const [resEnd, setResEnd] = useState('');

  const reload = () => { setBookings(getBookings()); setResources(getResources()); };
  useEffect(() => { reload(); }, []);

  const filteredResources = filterType === 'All' ? resources : resources.filter(r => r.type === filterType);
  const filteredBookings = filterStatus === 'All' ? bookings : bookings.filter(b => b.status === filterStatus);

  const selectedResource = resources.find(r => r.id === selResourceId);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selResourceId || !selDate || !selStart || !selEnd || !selPurpose.trim()) return;
    if (selStart >= selEnd) { setError('End time must be after start time.'); return; }
    const res = resources.find(r => r.id === selResourceId);
    if (!res) return;
    const result = createBooking({ resourceId: selResourceId, resourceName: res.name, resourceType: res.type, date: selDate, startTime: selStart, endTime: selEnd, purpose: selPurpose });
    if (!result) { setError('Time slot conflicts with an existing booking. Please choose a different time.'); return; }
    setShowForm(false); setSelResourceId(''); setSelDate(''); setSelStart(''); setSelEnd(''); setSelPurpose('');
    reload();
  };

  const handleCancel = (id: string) => { cancelBooking(id); reload(); };

  const handleReschedule = () => {
    if (!rescheduleId || !resDate || !resStart || !resEnd) return;
    if (resStart >= resEnd) { setError('End time must be after start time.'); return; }
    const ok = rescheduleBooking(rescheduleId, resDate, resStart, resEnd);
    if (!ok) { setError('Rescheduled time conflicts with an existing booking.'); return; }
    setRescheduleId(null); setError(''); reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Resource Booking</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Book conference rooms, projectors, vehicles and shared equipment.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setError(''); }}>
          <Plus size={16} /> New Booking
        </Button>
      </header>

      {/* Error Toast */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-3) var(--spacing-4)', backgroundColor: 'var(--accent-danger)', color: 'var(--text-on-accent)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', color: 'var(--text-on-accent)' }}><X size={16} /></button>
        </div>
      )}

      {/* Booking Form */}
      {showForm && (
        <Card title="Book a Resource">
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
            <div className="input-group">
              <label className="input-label">Resource Type</label>
              <select className="input-field" value={filterType} onChange={e => { setFilterType(e.target.value); setSelResourceId(''); }}>
                <option value="All">All Types</option>
                {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Select Resource *</label>
              <select className="input-field" value={selResourceId} onChange={e => setSelResourceId(e.target.value)}>
                <option value="">-- Select --</option>
                {filteredResources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.location}{r.capacity ? `, Cap: ${r.capacity}` : ''})</option>)}
              </select>
            </div>
            {selectedResource && (
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
                <strong>{selectedResource.name}</strong> · {selectedResource.type} · {selectedResource.location}
                {selectedResource.capacity && ` · Capacity: ${selectedResource.capacity}`}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div className="input-group">
                <label className="input-label">Date *</label>
                <input className="input-field" type="date" value={selDate} onChange={e => setSelDate(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Time *</label>
                <input className="input-field" type="time" value={selStart} onChange={e => setSelStart(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">End Time *</label>
                <input className="input-field" type="time" value={selEnd} onChange={e => setSelEnd(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Purpose *</label>
              <textarea className="input-field" rows={2} placeholder="Purpose of booking..." value={selPurpose} onChange={e => setSelPurpose(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Button type="submit" disabled={!selResourceId || !selDate || !selStart || !selEnd || !selPurpose.trim()}>Book Resource</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        {['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 'var(--font-size-xs)' }}>{s}</button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr><th>Resource</th><th>Type</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{b.resourceName}</td>
                <td>{b.resourceType}</td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{b.date}</td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{b.startTime} – {b.endTime}</td>
                <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  {b.status === 'Upcoming' && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                      <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)', padding: '2px 8px' }} onClick={() => { setRescheduleId(b.id); setResDate(b.date); setResStart(b.startTime); setResEnd(b.endTime); setError(''); }}>Reschedule</button>
                      <button className="btn btn-danger" style={{ fontSize: 'var(--font-size-xs)', padding: '2px 8px' }} onClick={() => handleCancel(b.id)}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-tertiary)' }}>No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div onClick={() => setRescheduleId(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', width: '420px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Reschedule Booking</h3>
              <button onClick={() => setRescheduleId(null)} style={{ color: 'var(--text-tertiary)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div className="input-group"><label className="input-label">New Date</label><input className="input-field" type="date" value={resDate} onChange={e => setResDate(e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div className="input-group"><label className="input-label">Start</label><input className="input-field" type="time" value={resStart} onChange={e => setResStart(e.target.value)} /></div>
                <div className="input-group"><label className="input-label">End</label><input className="input-field" type="time" value={resEnd} onChange={e => setResEnd(e.target.value)} /></div>
              </div>
              <Button onClick={handleReschedule}>Confirm Reschedule</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
