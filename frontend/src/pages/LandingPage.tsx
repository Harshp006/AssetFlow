import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Theme-specific styles
  const bg = isDark ? '#0f172a' : '#f8fafc';
  const headerBg = isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#475569';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const primaryButtonBg = isDark ? '#3b82f6' : '#2563eb';
  const primaryButtonHover = isDark ? '#2563eb' : '#1d4ed8';
  const secondaryButtonBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)';
  const secondaryButtonBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.15)';
  const badgeBg = isDark ? 'rgba(59,130,246,0.1)' : 'rgba(37,99,235,0.05)';
  const badgeBorder = isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.15)';
  const badgeText = isDark ? '#93c5fd' : '#2563eb';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      color: textPrimary,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      transition: 'background-color 0.3s, color 0.3s',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
        backgroundColor: headerBg,
        borderBottom: `1px solid ${border}`,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'border-color 0.3s, background-color 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: `linear-gradient(135deg, ${primaryButtonBg}, #6366f1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}>
            A
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>AssetFlow</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: `1px solid ${border}`,
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: textPrimary,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = secondaryButtonBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isDark ? 'Light Theme' : 'Dark Theme'}
          </button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: textPrimary,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = secondaryButtonBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Sign In
            </span>
          </Link>
          <Link to="/register-company" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: primaryButtonBg,
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = primaryButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryButtonBg}
            >
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        flexGrow: 1,
      }}>
        <div style={{
          display: 'inline-flex',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          color: badgeText,
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}>
          Enterprise Ready
        </div>

        <h1 style={{
          fontSize: '3.75rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          maxWidth: '800px',
          margin: '0 auto 1.5rem',
        }}>
          Modern Asset and Resource Management.
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: textSecondary,
          maxWidth: '600px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6,
        }}>
          Track inventory, manage lifecycles, assign permissions, and generate audit reports — all within a single unified workspace.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
          <Link to="/register-company" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              border: 'none',
              background: primaryButtonBg,
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = primaryButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryButtonBg}
            >
              Register Your Company
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              border: `1px solid ${secondaryButtonBorder}`,
              background: 'transparent',
              color: textPrimary,
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = secondaryButtonBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Access Workspace
            </button>
          </Link>
        </div>

        {/* Roles Grid */}
        <div style={{
          textAlign: 'left',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            Integrated Workspace Roles
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {[
              {
                role: 'Administrator',
                desc: 'Control central settings, invite employees, manage role definitions, and access the entire workspace dashboard.',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)',
              },
              {
                role: 'Asset Manager',
                desc: 'Register incoming inventory, oversee maintenance logs, review pending requests, and allocate resources.',
                borderColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
              },
              {
                role: 'Department Head',
                desc: 'View assets allocated to your business unit, coordinate team logistics, and handle approval workflows.',
                borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)',
              },
              {
                role: 'Employee',
                desc: 'View personal allocations, report operational issues, raise resource requests, and update contact profiles.',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              },
            ].map(r => (
              <div key={r.role} style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderTop: `3px solid ${r.borderColor.replace('0.2', '0.8').replace('0.15', '0.8')}`,
                borderRadius: '10px',
                padding: '1.5rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: textPrimary }}>{r.role}</div>
                <p style={{ fontSize: '0.85rem', color: textSecondary, lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${border}`,
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: textSecondary,
        transition: 'border-color 0.3s',
      }}>
        <span>© {new Date().getFullYear()} AssetFlow. Dedicated Resource Planning.</span>
      </footer>
    </div>
  );
};
