import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function PrimaryButton({ children, loading, size = 'md', glow = true, className = '', disabled, ...props }: PrimaryButtonProps) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150',
        'bg-accent text-black',
        glow ? 'hover:shadow-accent-glow' : '',
        'hover:bg-accent-dim active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none',
        sizes[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
