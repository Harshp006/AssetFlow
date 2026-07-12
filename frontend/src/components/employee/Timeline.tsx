import React from 'react';
import type { TimelineEvent } from '../../types/models';

interface TimelineProps {
  events: TimelineEvent[];
}

const statusColors: Record<string, string> = {
  'Pending': 'var(--accent-warning)',
  'Approved': 'var(--accent-secondary)',
  'Assigned': 'var(--accent-primary)',
  'In Progress': 'var(--accent-primary)',
  'Resolved': 'var(--accent-secondary)',
  'Rejected': 'var(--accent-danger)',
  'Completed': 'var(--accent-secondary)',
  'Pending Department Approval': 'var(--accent-warning)',
  'Pending Asset Manager': 'var(--accent-warning)',
  'Pending Return Inspection': 'var(--accent-warning)',
};

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 'var(--spacing-2)' }}>
      {events.map((event, idx) => {
        const color = statusColors[event.status] || 'var(--text-tertiary)';
        const isLast = idx === events.length - 1;
        return (
          <div key={event.id} style={{ display: 'flex', gap: 'var(--spacing-4)', minHeight: isLast ? 'auto' : '64px' }}>
            {/* Dot + Line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color,
                border: `2px solid ${color}`, flexShrink: 0, marginTop: '4px',
                boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 20%, transparent)`
              }} />
              {!isLast && (
                <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border-subtle)', marginTop: '4px' }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: '2px' }}>
                <span style={{
                  fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)',
                  color, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {event.status}
                </span>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', margin: '2px 0' }}>
                {event.description}
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                {event.actor} · {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
