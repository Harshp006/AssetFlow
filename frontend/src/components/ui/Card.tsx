import React from 'react';

export interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, children, className = '', headerAction }) => {
  return (
    <div className={`card ${className}`}>
      {(title || description || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {description && <p className="card-description">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};
