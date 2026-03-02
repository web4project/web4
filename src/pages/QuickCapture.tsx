import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { MemoryEditor } from '../components/vault/MemoryEditor';
import { toast } from '../hooks/useToast';
import type { ItemPayload } from '../types';
import { useTemplates } from '../hooks/useTemplates';

export function QuickCapture() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { addMemory } = useVault();
  const { allTemplates } = useTemplates();
  const [loading, setLoading] = useState(false);

  const templateId = params.get('template');
  const tpl = templateId ? allTemplates.find((t) => t.id === templateId) : null;

  const initialPayload: Partial<ItemPayload> = tpl
    ? { type: tpl.type, title: tpl.titleTemplate, body: tpl.bodyTemplate, tags: tpl.tags }
    : {};

  const handleSave = async (payload: ItemPayload) => {
    setLoading(true);
    try {
      await addMemory(payload);
      toast('Memory saved', 'success');
      navigate('/vault');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnother = async (payload: ItemPayload) => {
    setLoading(true);
    try {
      await addMemory(payload);
      toast('Memory saved — add another', 'success');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-6">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">New Memory</h1>
        {tpl && <p className="text-sm text-text-muted mt-1">Using template: <span className="text-accent">{tpl.name}</span></p>}
      </div>

      <div className="rounded-2xl border border-border-2 bg-surface-2 p-6">
        <MemoryEditor
          initialPayload={initialPayload}
          onSubmit={handleSave}
          onSubmitAnother={handleSaveAnother}
          loading={loading}
          submitLabel="Save Memory"
        />
      </div>
    </div>
  );
}
