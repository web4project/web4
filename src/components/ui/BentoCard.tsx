import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  accent?: boolean;
  span?: 'full' | 'half' | 'third' | 'auto';
}

export function BentoCard({ children, className = '', onClick, hover = false, accent = false, span = 'auto' }: BentoCardProps) {
  const spanClass = span === 'full' ? 'col-span-full' : span === 'half' ? 'md:col-span-2' : span === 'third' ? 'md:col-span-1' : '';

  return (
    <div
      className={[
        'relative rounded-xl border bg-surface-2 p-5 transition-all duration-200',
        accent ? 'border-accent/30 shadow-accent-glow-sm' : 'border-border',
        hover || onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:border-border-2 hover:shadow-lg hover:shadow-black/40' : '',
        spanClass,
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
