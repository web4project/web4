import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function SecondaryButton({ children, size = 'md', className = '', ...props }: SecondaryButtonProps) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };

  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150',
        'border border-border-2 bg-surface-3 text-text',
        'hover:border-text-dim hover:bg-surface-2 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-black',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        sizes[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  );
}
