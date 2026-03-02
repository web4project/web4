import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, X, Bookmark, StickyNote, Link, CheckSquare, Wallet, Code, FileText } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { searchItems } from '../lib/search';
import { SearchBar } from '../components/vault/SearchBar';
import { TagChips } from '../components/ui/TagInput';
import { EmptyState } from '../components/ui/EmptyState';
import type { DecryptedItem, ItemType, SearchFilters } from '../types';

const TYPE_ICONS: Record<string, typeof StickyNote> = {
  note: StickyNote, link: Link, checklist: CheckSquare, wallet: Wallet, code: Code,
};

const TYPE_OPTIONS: { value: ItemType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'note', label: 'Notes' },
  { value: 'link', label: 'Links' },
  { value: 'checklist', label: 'Checklists' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'code', label: 'Code' },
];

function ResultCard({ item, onClick }: { item: DecryptedItem; onClick: () => void }) {
  const Icon = TYPE_ICONS[item.type] ?? FileText;
  return (
    <button onClick={onClick} className="flex w-full items-start gap-3 rounded-xl border border-border bg-surface-2 p-4 text-left hover:border-border-2 hover:-translate-y-0.5 transition-all group">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/5 border border-accent/10">
        <Icon size={14} className="text-accent/70" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{item.title}</p>
        {item.body && <p className="text-xs text-text-muted truncate mt-0.5">{item.body.slice(0, 100)}</p>}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-text-dim border border-border px-1.5 py-0.5 rounded capitalize">{item.type}</span>
          <TagChips tags={item.tags.slice(0, 3)} />
          {item.pinned && <span className="text-[10px] text-accent border border-accent/20 px-1.5 py-0.5 rounded">Pinned</span>}
        </div>
      </div>
    </button>
  );
}

export function Search() {
  const navigate = useNavigate();
  const { items } = useVault();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: '', pinned: null });
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<{ id: string; query: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('web4project:saved-searches') ?? '[]'); } catch { return []; }
  });

  const saveSearch = () => {
    if (!query.trim()) return;
    const id = Date.now().toString();
    const updated = [{ id, query }, ...savedSearches.slice(0, 9)];
    setSavedSearches(updated);
    localStorage.setItem('web4project:saved-searches', JSON.stringify(updated));
  };

  const results = useMemo(() => {
    let base: DecryptedItem[];
    if (query.trim()) {
      const sr = searchItems(query);
      base = sr.map((r) => items.find((i) => i.id === r.id)).filter((i): i is DecryptedItem => !!i);
    } else {
      base = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    if (filters.type) base = base.filter((i) => i.type === filters.type);
    if (filters.pinned === true) base = base.filter((i) => i.pinned);
    if (filters.tags?.length) base = base.filter((i) => filters.tags!.every((t) => i.tags.includes(t)));
    return base;
  }, [query, filters, items]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((i) => i.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [items]);

  const toggleTagFilter = useCallback((tag: string) => {
    setFilters((prev) => {
      const current = prev.tags ?? [];
      const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
      return { ...prev, tags: next };
    });
  }, []);

  const hasFilters = filters.type || filters.pinned || (filters.tags?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text mb-4">Search</h1>
        <div className="flex gap-2">
          <SearchBar value={query} onChange={setQuery} autoFocus className="flex-1" />
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${showFilters || hasFilters ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-surface-2 text-text-muted hover:border-border-2'}`}
          >
            <Filter size={13} />
            <span className="hidden sm:inline">Filter</span>
            {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
          </button>
          {query && (
            <button onClick={saveSearch} title="Save search" className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-xs text-text-muted hover:border-border-2 transition-all">
              <Bookmark size={13} />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 rounded-xl border border-border-2 bg-surface-2 p-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-text-muted mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilters((f) => ({ ...f, type: value }))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${filters.type === value ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-surface-3 text-text-muted hover:border-border-2'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={filters.pinned === true}
                onChange={(e) => setFilters((f) => ({ ...f, pinned: e.target.checked ? true : null }))}
                className="rounded border-border-2 bg-surface accent-accent"
              />
              Pinned only
            </label>
            {hasFilters && (
              <button onClick={() => setFilters({ type: '', pinned: null, tags: [] })} className="flex items-center gap-1 text-xs text-error hover:text-error/80 transition-colors">
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {allTags.slice(0, 20).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all ${(filters.tags ?? []).includes(tag) ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-surface-3 text-text-muted hover:border-border-2'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!query && !hasFilters && savedSearches.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-text-muted mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {savedSearches.slice(0, 5).map((s) => (
              <button key={s.id} onClick={() => setQuery(s.query)} className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted hover:border-border-2 hover:text-text transition-all">
                {s.query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {results.length > 0 ? (
          <>
            <p className="text-xs text-text-dim mb-3">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            {results.map((item) => (
              <ResultCard key={item.id} item={item} onClick={() => navigate(`/vault/item/${item.id}`)} />
            ))}
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title={query ? 'No results found' : 'No memories yet'}
            description={query ? `No memories matching "${query}"` : 'Your vault is empty. Add your first memory.'}
            action={!query ? <button onClick={() => navigate('/vault/new')} className="text-xs text-accent hover:text-accent-dim transition-colors">Add memory →</button> : undefined}
          />
        )}
      </div>
    </div>
  );
}
