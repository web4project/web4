import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pin, Clock, LayoutTemplate, Sparkles, BarChart3, FileText, Link, CheckSquare, Wallet, Code, ArrowRight, Key } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { BentoCard } from '../components/ui/BentoCard';
import { TagChips } from '../components/ui/TagInput';
import { EmptyState } from '../components/ui/EmptyState';
import type { DecryptedItem } from '../types';

const TYPE_ICONS: Record<string, typeof FileText> = {
  note: FileText,
  link: Link,
  checklist: CheckSquare,
  wallet: Wallet,
  code: Code,
  password: Key,
};

function MemoryRow({ item, onClick }: { item: DecryptedItem; onClick: () => void }) {
  const Icon = TYPE_ICONS[item.type] ?? FileText;
  return (
    <button onClick={onClick} className="flex w-full items-start gap-3 rounded-xl border border-border bg-surface-3 p-3.5 text-left hover:border-border-2 hover:bg-surface-2 transition-all group">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/5 border border-accent/10">
        <Icon size={13} className="text-accent/70" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{item.title}</p>
        {item.body && <p className="text-xs text-text-muted truncate mt-0.5">{item.body}</p>}
        <TagChips tags={item.tags.slice(0, 3)} />
      </div>
      {item.pinned && <Pin size={11} className="text-accent shrink-0 mt-1" />}
      <ArrowRight size={13} className="text-text-dim shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { items, meta } = useVault();

  const pinned = useMemo(() => items.filter((i) => i.pinned).slice(0, 4), [items]);
  const recent = useMemo(() => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5), [items]);

  const stats = useMemo(() => {
    const types = items.reduce((acc, i) => { acc[i.type] = (acc[i.type] ?? 0) + 1; return acc; }, {} as Record<string, number>);
    const lastUpdated = items.length ? new Date(Math.max(...items.map((i) => new Date(i.updatedAt).getTime()))).toLocaleDateString() : null;
    return { total: items.length, types, lastUpdated };
  }, [items]);

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">
          {meta?.vaultName ?? 'My Vault'}
        </h1>
        <p className="text-sm text-text-muted mt-0.5">
          {items.length} {items.length === 1 ? 'memory' : 'memories'} encrypted
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <BentoCard onClick={() => navigate('/vault/new')} hover accent className="col-span-2 sm:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/30">
              <Plus size={18} className="text-accent" />
            </div>
            <ArrowRight size={14} className="text-accent/50" />
          </div>
          <div>
            <p className="font-semibold text-text">Quick Capture</p>
            <p className="text-xs text-text-muted mt-0.5">Add a new memory to your vault</p>
          </div>
        </BentoCard>

        <BentoCard className="flex flex-col justify-between">
          <p className="text-xs text-text-muted font-medium">Total</p>
          <div>
            <p className="text-3xl font-bold text-text">{stats.total}</p>
            <p className="text-xs text-text-dim">memories</p>
          </div>
        </BentoCard>

        <BentoCard className="flex flex-col justify-between">
          <p className="text-xs text-text-muted font-medium">Last Updated</p>
          <div>
            <p className="text-sm font-semibold text-text">{stats.lastUpdated ?? '—'}</p>
            <p className="text-xs text-text-dim">{pinned.length} pinned</p>
          </div>
        </BentoCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 space-y-3">
          <BentoCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-accent" />
                <h2 className="text-sm font-semibold text-text">Recent</h2>
              </div>
              <button onClick={() => navigate('/vault/search')} className="text-xs text-text-dim hover:text-accent transition-colors">View all</button>
            </div>
            {recent.length > 0 ? (
              <div className="space-y-2">
                {recent.map((item) => (
                  <MemoryRow key={item.id} item={item} onClick={() => navigate(`/vault/item/${item.id}`)} />
                ))}
              </div>
            ) : (
              <EmptyState icon={FileText} title="No memories yet" description="Start by capturing your first thought" action={
                <button onClick={() => navigate('/vault/new')} className="text-xs text-accent hover:text-accent-dim transition-colors">Add memory →</button>
              } />
            )}
          </BentoCard>
        </div>

        <div className="space-y-3">
          {pinned.length > 0 && (
            <BentoCard>
              <div className="flex items-center gap-2 mb-4">
                <Pin size={13} className="text-accent" />
                <h2 className="text-sm font-semibold text-text">Pinned</h2>
              </div>
              <div className="space-y-2">
                {pinned.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/vault/item/${item.id}`)}
                    className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface-3 px-3 py-2 text-left hover:border-border-2 transition-all"
                  >
                    <span className="text-xs text-text truncate flex-1">{item.title}</span>
                  </button>
                ))}
              </div>
            </BentoCard>
          )}

          <BentoCard onClick={() => navigate('/vault/ask')} hover>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-accent" />
              <h2 className="text-sm font-semibold text-text">Ask Vault</h2>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">Search your memories with natural language queries.</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-accent/70">
              Try it <ArrowRight size={11} />
            </div>
          </BentoCard>

          <BentoCard onClick={() => navigate('/vault/templates')} hover>
            <div className="flex items-center gap-2 mb-2">
              <LayoutTemplate size={13} className="text-accent" />
              <h2 className="text-sm font-semibold text-text">Templates</h2>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">Use pre-built or custom templates for faster capture.</p>
          </BentoCard>

          {stats.total > 0 && (
            <BentoCard>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={13} className="text-accent" />
                <h2 className="text-sm font-semibold text-text">Breakdown</h2>
              </div>
              <div className="space-y-1.5">
                {Object.entries(stats.types).map(([type, count]) => {
                  const Icon = TYPE_ICONS[type] ?? FileText;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <Icon size={11} className="text-text-dim" />
                      <span className="text-xs text-text-muted capitalize flex-1">{type}</span>
                      <span className="text-xs font-medium text-text">{count}</span>
                    </div>
                  );
                })}
              </div>
            </BentoCard>
          )}
        </div>
      </div>
    </div>
  );
}
