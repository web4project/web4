import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, StickyNote, Link, CheckSquare, Wallet, Code } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import type { VaultTemplate, ItemType } from '../types';

const TYPE_ICONS: Record<string, typeof StickyNote> = {
  note: StickyNote, link: Link, checklist: CheckSquare, wallet: Wallet, code: Code,
};

const TYPE_OPTIONS: ItemType[] = ['note', 'link', 'checklist', 'wallet', 'code'];

function TemplateCard({ tpl, onUse, onDelete }: { tpl: VaultTemplate; onUse: () => void; onDelete?: () => void }) {
  const Icon = TYPE_ICONS[tpl.type] ?? StickyNote;
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4 hover:border-border-2 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/5 border border-accent/10">
          <Icon size={14} className="text-accent/70" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{tpl.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{tpl.description}</p>
        </div>
        {!tpl.isBuiltIn && onDelete && (
          <button onClick={onDelete} className="text-text-dim hover:text-error transition-colors shrink-0">
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-dim border border-border px-1.5 py-0.5 rounded capitalize">{tpl.type}</span>
        <button onClick={onUse} className="text-xs text-accent hover:text-accent-dim font-medium transition-colors">Use template →</button>
      </div>
    </div>
  );
}

export function Templates() {
  const navigate = useNavigate();
  const { allTemplates, builtIn, custom, addTemplate, removeTemplate } = useTemplates();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', type: 'note' as ItemType, titleTemplate: '', bodyTemplate: '' });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    addTemplate({ ...form, tags: [] });
    setShowForm(false);
    setForm({ name: '', description: '', type: 'note', titleTemplate: '', bodyTemplate: '' });
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">Templates</h1>
          <p className="text-sm text-text-muted mt-0.5">{allTemplates.length} templates</p>
        </div>
        <SecondaryButton size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus size={13} /> Custom
        </SecondaryButton>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-border-2 bg-surface-2 p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-text mb-4">Create Template</h2>
          <div className="space-y-3">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Template name..." className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all" />
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description..." className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all" />
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ItemType }))} className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-accent/50 transition-all">
              {TYPE_OPTIONS.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            <input value={form.titleTemplate} onChange={(e) => setForm((f) => ({ ...f, titleTemplate: e.target.value }))} placeholder="Default title (optional)..." className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all" />
            <textarea value={form.bodyTemplate} onChange={(e) => setForm((f) => ({ ...f, bodyTemplate: e.target.value }))} placeholder="Default body content (optional)..." rows={4} className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all resize-none" />
            <div className="flex gap-2">
              <PrimaryButton size="sm" onClick={handleCreate} disabled={!form.name.trim()}>Create</PrimaryButton>
              <SecondaryButton size="sm" onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs font-medium text-text-muted mb-3">Built-in</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {builtIn.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} onUse={() => navigate(`/vault/new?template=${tpl.id}`)} />
          ))}
        </div>
      </div>

      {custom.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-muted mb-3">Custom</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {custom.map((tpl) => (
              <TemplateCard key={tpl.id} tpl={tpl} onUse={() => navigate(`/vault/new?template=${tpl.id}`)} onDelete={() => removeTemplate(tpl.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
