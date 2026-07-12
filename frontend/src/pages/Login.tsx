import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { predefinedUsers } from '../services/mockData';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(email);
    if (!success) {
      setError('Invalid credentials or user not found.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-base)',
      padding: 'var(--spacing-4)'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '400px',
        padding: 'var(--spacing-8)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-on-accent)',
            fontWeight: 'bold',
            fontSize: 'var(--font-size-2xl)',
            margin: '0 auto var(--spacing-4)'
          }}>
            A
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>Sign in to AssetFlow</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-2)' }}>Enterprise Asset Management</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email address</label>
            <input 
              id="email"
              type="email" 
              className="input-field" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              defaultValue="password" // Mock password since we only check email
            />
          </div>

          {error && (
            <div style={{ color: 'var(--accent-danger)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 'var(--spacing-2)', height: '40px' }}>
            {loading ? 'Signing in...' : (
              <>
                Sign in <LogIn size={18} />
              </>
            )}
          </Button>
        </form>
        
        <div style={{ marginTop: 'var(--spacing-6)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border-strong)' }}>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            Demo Accounts (Click to copy)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {predefinedUsers.map(u => (
              <button
                key={u.id}
                onClick={() => setEmail(u.email)}
                style={{
                  textAlign: 'left',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
              >
                <strong>{u.role}:</strong> {u.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
