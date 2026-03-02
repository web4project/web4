import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Pin, Copy, Check, StickyNote, Link, CheckSquare, Wallet, Code } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { MemoryEditor } from '../components/vault/MemoryEditor';
import { TagChips } from '../components/ui/TagInput';
import { toast } from '../hooks/useToast';
import type { ItemPayload } from '../types';

const TYPE_ICONS: Record<string, typeof StickyNote> = {
  note: StickyNote, link: Link, checklist: CheckSquare, wallet: Wallet, code: Code,
};

export function ItemViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, editMemory, removeMemory } = useVault();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const item = useMemo(() => items.find((i) => i.id === id), [items, id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-text-muted mb-4">Memory not found</p>
          <button onClick={() => navigate('/vault')} className="text-sm text-accent hover:text-accent-dim transition-colors">← Back to vault</button>
        </div>
      </div>
    );
  }

  const Icon = TYPE_ICONS[item.type] ?? StickyNote;

  const handleSave = async (payload: ItemPayload) => {
    setLoading(true);
    try {
      await editMemory(item.id, payload, item.createdAt);
      setEditing(false);
      toast('Memory updated', 'success');
    } catch {
      toast('Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this memory permanently?')) return;
    await removeMemory(item.id);
    toast('Memory deleted', 'info');
    navigate('/vault');
  };

  const handlePin = async () => {
    await editMemory(item.id, { ...item, pinned: !item.pinned }, item.createdAt);
    toast(item.pinned ? 'Unpinned' : 'Pinned', 'success');
  };

  const handleCopy = async () => {
    const text = item.type === 'checklist'
      ? item.checklistItems?.map((ci) => `[${ci.checked ? 'x' : ' '}] ${ci.text}`).join('\n') ?? ''
      : item.body;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handlePin} title={item.pinned ? 'Unpin' : 'Pin'} className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${item.pinned ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-surface-2 text-text-muted hover:border-border-2'}`}>
            <Pin size={13} />
          </button>
          <button onClick={handleCopy} title="Copy" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2 text-text-muted hover:border-border-2 transition-all">
            {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
          </button>
          <button onClick={() => setEditing((v) => !v)} className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${editing ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-surface-2 text-text-muted hover:border-border-2'}`}>
            <Edit3 size={13} />
          </button>
          <button onClick={handleDelete} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2 text-text-muted hover:border-error/50 hover:text-error transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="rounded-2xl border border-border-2 bg-surface-2 p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Edit Memory</h2>
          <MemoryEditor
            initialPayload={item}
            onSubmit={handleSave}
            loading={loading}
            submitLabel="Update"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border-2 bg-surface-2 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                <Icon size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-text leading-tight">{item.title}</h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-text-dim border border-border px-1.5 py-0.5 rounded capitalize">{item.type}</span>
                  {item.pinned && <span className="text-[10px] text-accent border border-accent/20 px-1.5 py-0.5 rounded">Pinned</span>}
                </div>
              </div>
            </div>

            {item.type === 'checklist' && item.checklistItems ? (
              <div className="space-y-2">
                {item.checklistItems.map((ci) => (
                  <div key={ci.id} className="flex items-center gap-3 py-1">
                    <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${ci.checked ? 'border-accent bg-accent/20' : 'border-border-2'}`}>
                      {ci.checked && <Check size={10} className="text-accent" />}
                    </div>
                    <span className={`text-sm ${ci.checked ? 'line-through text-text-dim' : 'text-text'}`}>{ci.text}</span>
                  </div>
                ))}
              </div>
            ) : item.type === 'code' ? (
              <div>
                {item.language && <div className="mb-2 text-[10px] text-accent/70 border border-accent/20 rounded px-2 py-0.5 inline-block">{item.language}</div>}
                <pre className="rounded-xl border border-border bg-surface-3 p-4 text-xs font-mono text-text leading-relaxed overflow-x-auto whitespace-pre-wrap">{item.body}</pre>
              </div>
            ) : (
              item.body && <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{item.body}</p>
            )}

            {item.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <TagChips tags={item.tags} size="md" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface-3 px-4 py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] text-text-dim">Created: {formattedDate(item.createdAt)}</p>
              <p className="text-[11px] text-text-dim">Updated: {formattedDate(item.updatedAt)}</p>
            </div>
            <button onClick={() => setEditing(true)} className="text-xs text-accent hover:text-accent-dim transition-colors">Edit →</button>
          </div>
        </div>
      )}
    </div>
  );
}
