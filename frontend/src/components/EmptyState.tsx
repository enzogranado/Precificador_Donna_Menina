import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon}
      <div className="empty-state-title">{title}</div>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}
