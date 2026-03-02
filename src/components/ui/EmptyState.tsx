import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-2 bg-surface-3">
        <Icon size={28} className="text-text-dim" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-text">{title}</h3>
      {description && <p className="mb-5 max-w-xs text-sm text-text-muted leading-relaxed">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
