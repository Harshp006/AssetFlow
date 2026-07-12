import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getProfile, updateProfile, getMyAssets, getBookings, getMaintenanceRequests } from '../../services/mock/employeeData';
import type { EmployeeProfile } from '../../types/models';
import { User, Mail, Phone, Building, Hash, Calendar, Camera } from 'lucide-react';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [stats, setStats] = useState({ assets: 0, bookings: 0, maintenance: 0 });

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setPhone(p.phone);
    setStats({
      assets: getMyAssets().length,
      bookings: getBookings().length,
      maintenance: getMaintenanceRequests().length
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone });
    setProfile(getProfile());
    setIsEditing(false);
    setPassword('');
    setNewPassword('');
  };

  if (!profile) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>My Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and account settings.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-6)' }}>
        
        {/* Left Column: Avatar and Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-4) 0' }}>
              <div style={{ position: 'relative', marginBottom: 'var(--spacing-4)' }}>
                <div style={{
                  width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3rem', color: 'var(--text-on-accent)', fontWeight: 'bold'
                }}>
                  {profile.name.charAt(0)}
                </div>
                {isEditing && (
                  <button style={{
                    position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-strong)', borderRadius: '50%', padding: 'var(--spacing-2)',
                    color: 'var(--text-primary)', cursor: 'pointer'
                  }}>
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{profile.name}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{profile.role}</p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: 'var(--spacing-4) -var(--spacing-6) 0', padding: 'var(--spacing-4) var(--spacing-6) 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', gap: 'var(--spacing-2)' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{stats.assets}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Assets</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{stats.bookings}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Bookings</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{stats.maintenance}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Issues</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Details Form */}
        <Card title="Personal Information" headerAction={
          !isEditing && <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
        }>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div className="input-group">
                <label className="input-label"><User size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> Full Name</label>
                <input className="input-field" value={profile.name} disabled />
              </div>
              <div className="input-group">
                <label className="input-label"><Hash size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> Employee ID</label>
                <input className="input-field" value={profile.employeeId} disabled />
              </div>
              <div className="input-group">
                <label className="input-label"><Mail size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> Email Address</label>
                <input className="input-field" value={profile.email} disabled />
              </div>
              <div className="input-group">
                <label className="input-label"><Phone size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> Phone Number</label>
                <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} disabled={!isEditing} />
              </div>
              <div className="input-group">
                <label className="input-label"><Building size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> Department</label>
                <input className="input-field" value={profile.department} disabled />
              </div>
              <div className="input-group">
                <label className="input-label"><Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> Joined Date</label>
                <input className="input-field" value={profile.joinedDate} disabled />
              </div>
            </div>

            {isEditing && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-4)' }}>
                <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-4)' }}>Change Password</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Current Password</label>
                    <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">New Password</label>
                    <input className="input-field" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-4)' }}>
                <Button variant="secondary" type="button" onClick={() => { setIsEditing(false); setPhone(profile.phone); }}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </Card>

      </div>
    </div>
  );
};
