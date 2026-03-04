import { useState, useRef } from 'react';
import { X, Download, Upload, AlertTriangle } from 'lucide-react';
import { exportVault, importVault } from '../../lib/vault';
import type { ExportFile } from '../../types';
import { PrimaryButton } from '../ui/PrimaryButton';
import { toast } from '../../hooks/useToast';

interface ImportExportModalProps {
  onClose: () => void;
}

export function ImportExportModal({ onClose }: ImportExportModalProps) {
  const [tab, setTab] = useState<'export' | 'import'>('export');
  const [loading, setLoading] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await exportVault();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `web4project.vault.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Vault exported successfully', 'success');
      onClose();
    } catch (err) {
      toast('Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const text = await file.text();
      const data: ExportFile = JSON.parse(text);
      const count = await importVault(data, overwrite);
      toast(`Imported ${count} items successfully`, 'success');
      onClose();
      window.location.reload();
    } catch {
      toast('Import failed — invalid vault file', 'error');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border-2 bg-surface-2/90 backdrop-blur-xl shadow-2xl shadow-black/60 animate-slide-up">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <h2 className="font-semibold text-text">Import / Export</h2>
          <button onClick={onClose} className="text-text-dim hover:text-text transition-colors"><X size={18} /></button>
        </div>

        <div className="flex border-b border-border">
          {(['export', 'import'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-all ${tab === t ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {tab === 'export' ? (
            <>
              <p className="text-sm text-text-muted leading-relaxed">
                Export your encrypted vault as a <code className="text-accent text-xs">web4project.vault.json</code> file.
                Your data remains fully encrypted — the passphrase is never stored.
              </p>
              <PrimaryButton onClick={handleExport} loading={loading} className="w-full">
                <Download size={15} />
                Export Vault
              </PrimaryButton>
            </>
          ) : (
            <>
              <p className="text-sm text-text-muted leading-relaxed">
                Import a previously exported vault file. This will restore encrypted items to IndexedDB.
              </p>
              <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                <AlertTriangle size={15} className="text-warning shrink-0" />
                <p className="text-xs text-warning/80">Overwrite mode will delete your current vault.</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                  className="rounded border-border-2 bg-surface accent-accent"
                />
                Overwrite existing vault
              </label>
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-2 bg-surface-3 p-6 hover:border-accent/40 hover:bg-accent/5 transition-all">
                <Upload size={18} className="text-text-dim" />
                <span className="text-sm text-text-muted">Click to choose vault file</span>
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} disabled={loading} />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
