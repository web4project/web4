import React, { useState } from 'react';
import { StickyNote, Link, CheckSquare, Wallet, Code, ChevronDown } from 'lucide-react';
import type { ItemType, ItemPayload, ChecklistItem } from '../../types';
import { TagInput } from '../ui/TagInput';
import { uuidv4 } from '../../utils/uuid';

const TYPE_OPTIONS: { type: ItemType; label: string; icon: typeof StickyNote }[] = [
  { type: 'note', label: 'Note', icon: StickyNote },
  { type: 'link', label: 'Link', icon: Link },
  { type: 'checklist', label: 'Checklist', icon: CheckSquare },
  { type: 'wallet', label: 'Wallet Address', icon: Wallet },
  { type: 'code', label: 'Code Snippet', icon: Code },
];

const LANGUAGES = ['javascript', 'typescript', 'python', 'rust', 'go', 'solidity', 'bash', 'sql', 'json', 'yaml', 'other'];

interface MemoryEditorProps {
  initialPayload?: Partial<ItemPayload>;
  onSubmit: (payload: ItemPayload) => void | Promise<void>;
  submitLabel?: string;
  onSubmitAnother?: (payload: ItemPayload) => void | Promise<void>;
  loading?: boolean;
}

export function MemoryEditor({ initialPayload, onSubmit, submitLabel = 'Save', onSubmitAnother, loading }: MemoryEditorProps) {
  const [type, setType] = useState<ItemType>(initialPayload?.type ?? 'note');
  const [title, setTitle] = useState(initialPayload?.title ?? '');
  const [body, setBody] = useState(initialPayload?.body ?? '');
  const [tags, setTags] = useState<string[]>(initialPayload?.tags ?? []);
  const [pinned, setPinned] = useState(initialPayload?.pinned ?? false);
  const [language, setLanguage] = useState(initialPayload?.language ?? 'javascript');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initialPayload?.checklistItems ?? [{ id: uuidv4(), text: '', checked: false }]
  );
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const buildPayload = (): ItemPayload => ({
    type,
    title,
    body: type === 'checklist' ? '' : body,
    tags,
    pinned,
    language: type === 'code' ? language : undefined,
    checklistItems: type === 'checklist' ? checklistItems.filter((i) => i.text.trim()) : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(buildPayload());
  };

  const handleSubmitAnother = async () => {
    if (onSubmitAnother) await onSubmitAnother(buildPayload());
  };

  const addChecklistItem = () => {
    setChecklistItems((prev) => [...prev, { id: uuidv4(), text: '', checked: false }]);
  };

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: string | boolean) => {
    setChecklistItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const selectedType = TYPE_OPTIONS.find((t) => t.type === type)!;
  const TypeIcon = selectedType.icon;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTypeMenu((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text hover:border-border-2 transition-all"
        >
          <TypeIcon size={14} className="text-accent" />
          {selectedType.label}
          <ChevronDown size={12} className="text-text-dim" />
        </button>
        {showTypeMenu && (
          <div className="absolute top-full left-0 z-20 mt-1 rounded-xl border border-border-2 bg-surface-2 p-1 shadow-xl shadow-black/50 min-w-44">
            {TYPE_OPTIONS.map(({ type: t, label, icon: Icon }) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setShowTypeMenu(false); }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${type === t ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-surface-3 hover:text-text'}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base font-medium text-text placeholder:text-text-dim outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {type === 'code' && (
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-muted outline-none focus:border-accent/50 transition-all"
          >
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <span className="text-xs text-text-dim">Language</span>
        </div>
      )}

      {type === 'checklist' ? (
        <div className="space-y-2">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => updateChecklistItem(item.id, 'checked', e.target.checked)}
                className="h-4 w-4 rounded border-border-2 bg-surface accent-accent"
              />
              <input
                value={item.text}
                onChange={(e) => updateChecklistItem(item.id, 'text', e.target.value)}
                placeholder="Item..."
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all"
              />
              <button type="button" onClick={() => removeChecklistItem(item.id)} className="text-text-dim hover:text-error transition-colors text-xs px-2">✕</button>
            </div>
          ))}
          <button type="button" onClick={addChecklistItem} className="text-xs text-accent hover:text-accent-dim transition-colors">+ Add item</button>
        </div>
      ) : (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={type === 'code' ? 'Paste your code here...' : type === 'wallet' ? 'Wallet address...' : type === 'link' ? 'https://...' : 'Write anything...'}
          rows={type === 'code' ? 10 : 5}
          className={[
            'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-y',
            type === 'code' ? 'font-mono text-xs leading-relaxed' : '',
          ].join(' ')}
        />
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-muted">Tags</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPinned((v) => !v)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${pinned ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-surface-2 text-text-muted hover:border-border-2'}`}
        >
          📌 {pinned ? 'Pinned' : 'Pin'}
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex-1 rounded-lg bg-accent py-3 text-sm font-semibold text-black hover:bg-accent-dim hover:shadow-accent-glow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onSubmitAnother && (
          <button
            type="button"
            onClick={handleSubmitAnother}
            disabled={loading || !title.trim()}
            className="rounded-lg border border-border-2 bg-surface-3 px-4 py-3 text-xs font-medium text-text-muted hover:border-border-2 hover:text-text disabled:opacity-40 transition-all"
          >
            Save & Add Another
          </button>
        )}
      </div>
    </form>
  );
}
