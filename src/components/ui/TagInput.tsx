import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({ tags, onChange, placeholder = 'Add tag...', maxTags = 10 }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !tags.includes(tag) && tags.length < maxTags) {
      onChange([...tags, tag]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface p-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-surface-3 border border-border-2 px-2 py-0.5 text-xs font-medium text-text-muted">
          #{tag}
          <button onClick={() => removeTag(tag)} className="text-text-dim hover:text-error transition-colors ml-0.5">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length < maxTags ? placeholder : ''}
        disabled={tags.length >= maxTags}
        className="flex-1 min-w-24 bg-transparent text-xs text-text placeholder:text-text-dim outline-none"
      />
    </div>
  );
}

interface TagChipsProps {
  tags: string[];
  onClick?: (tag: string) => void;
  size?: 'sm' | 'md';
}

export function TagChips({ tags, onClick, size = 'sm' }: TagChipsProps) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={onClick ? () => onClick(tag) : undefined}
          className={[
            'inline-flex items-center rounded-md border border-border-2 bg-surface-3 font-medium text-text-muted',
            size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
            onClick ? 'cursor-pointer hover:border-accent/50 hover:text-accent transition-colors' : '',
          ].filter(Boolean).join(' ')}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
