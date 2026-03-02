import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search memories...', autoFocus, className = '' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search size={15} className="absolute left-3.5 text-text-dim pointer-events-none" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-10 py-3 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3.5 text-text-dim hover:text-text transition-colors">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
