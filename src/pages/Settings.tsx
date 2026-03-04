import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Download, Upload, RefreshCw, Trash2, AlertTriangle, Shield, Eye, Cloud } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { buildSearchIndex } from '../lib/search';
import { clearAllData } from '../lib/db';
import { ImportExportModal } from '../components/vault/ImportExportModal';
import { syncWithSupabase } from '../lib/sync';
import { toast } from '../hooks/useToast';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, lock, items, status } = useVault();
  const [showExport, setShowExport] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleRebuildIndex = async () => {
    setRebuilding(true);
    try {
      buildSearchIndex(items);
      toast('Search index rebuilt', 'success');
    } finally {
      setRebuilding(false);
    }
  };

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleSync = async () => {
    if (!settings.supabaseUrl || !settings.supabaseAnonKey) {
      toast('Please enter Supabase credentials first', 'error');
      return;
    }
    setSyncing(true);
    setSyncMessage('Starting sync...');
    try {
      await syncWithSupabase(settings.supabaseUrl, settings.supabaseAnonKey, setSyncMessage);
      toast('Cloud sync completed seamlessly!', 'success');
      setTimeout(() => window.location.reload(), 1500); // Reload to reflect merged state if needed
    } catch (err: any) {
      toast(err.message || 'Sync failed', 'error');
      setSyncMessage('');
    } finally {
      setSyncing(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('This will permanently delete your vault and all memories. This cannot be undone. Are you absolutely sure?')) return;
    if (!confirm('Final confirmation: Delete all vault data?')) return;
    setClearing(true);
    try {
      await clearAllData();
      toast('All data cleared', 'info');
      window.location.href = '/';
    } catch {
      toast('Failed to clear data', 'error');
    } finally {
      setClearing(false);
    }
  };

  const AUTO_LOCK_OPTIONS = [
    { value: 0, label: 'Never' },
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
  ];

  const THEME_OPTIONS = [
    { value: 'cyberpunk', label: 'Neon Dark (Cyberpunk)' },
    { value: 'minimal-light', label: 'Minimal Light' },
    { value: 'matrix', label: 'Matrix Green' },
  ];

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      {showExport && <ImportExportModal onClose={() => setShowExport(false)} />}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Manage your vault preferences and data</p>
      </div>

      <div className="space-y-4">
        <Section icon={Lock} title="Security">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">Auto-lock</p>
                <p className="text-xs text-text-muted mt-0.5">Lock vault after inactivity</p>
              </div>
              <select
                value={settings.autoLockMinutes}
                onChange={(e) => updateSettings({ autoLockMinutes: Number(e.target.value) })}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent/50 transition-all"
              >
                {AUTO_LOCK_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            {status === 'unlocked' && (
              <button
                onClick={() => { lock(); navigate('/unlock'); }}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-3 px-4 py-3 text-sm text-text-muted hover:border-error/30 hover:text-error transition-all"
              >
                <Lock size={14} />
                Lock Vault Now
              </button>
            )}
          </div>
        </Section>

        <Section icon={Cloud} title="Cloud Sync (BYOC)">
          <div className="space-y-4">
            <p className="text-xs text-text-muted leading-relaxed">
              Connect your own Supabase database to sync your encrypted vault across devices. Create a table named <code>vault_sync</code> with columns <code>id</code> (text, primary key) and <code>data</code> (jsonb).
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted mb-1 block">Supabase Project URL</label>
                <input
                  type="url"
                  placeholder="https://xyz.supabase.co"
                  value={settings.supabaseUrl || ''}
                  onChange={(e) => updateSettings({ supabaseUrl: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted mb-1 block">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJh..."
                  value={settings.supabaseAnonKey || ''}
                  onChange={(e) => updateSettings({ supabaseAnonKey: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 transition-all font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={syncing || !settings.supabaseUrl || !settings.supabaseAnonKey}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-black hover:bg-accent-dim disabled:opacity-40 transition-all mt-4"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              {syncing ? syncMessage || 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </Section>

        <Section icon={Download} title="Backup & Restore">
          <div className="space-y-3">
            <p className="text-xs text-text-muted leading-relaxed">
              Export your encrypted vault file. Import it on any device. The file is useless without your passphrase.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExport(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-3 py-3 text-sm text-text-muted hover:border-border-2 hover:text-text transition-all"
              >
                <Download size={14} /> Export
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-3 py-3 text-sm text-text-muted hover:border-border-2 hover:text-text transition-all"
              >
                <Upload size={14} /> Import
              </button>
            </div>
          </div>
        </Section>

        <Section icon={Eye} title="Appearance">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">Theme</p>
                <p className="text-xs text-text-muted mt-0.5">Choose your vault's look</p>
              </div>
              <select
                value={settings.theme || 'cyberpunk'}
                onChange={(e) => updateSettings({ theme: e.target.value as any })}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent/50 transition-all"
              >
                {THEME_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-sm font-medium text-text">Reduced motion</p>
                <p className="text-xs text-text-muted mt-0.5">Minimize animations</p>
              </div>
              <button
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`relative h-6 w-11 rounded-full transition-colors ${settings.reducedMotion ? 'bg-accent' : 'bg-surface-3 border border-border-2'}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings.reducedMotion ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </Section>

        <Section icon={RefreshCw} title="Data Tools">
          <div className="space-y-3">
            <button
              onClick={handleRebuildIndex}
              disabled={rebuilding || status !== 'unlocked'}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-3 px-4 py-3 text-sm text-text-muted hover:border-border-2 hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw size={14} className={rebuilding ? 'animate-spin' : ''} />
              Rebuild Search Index
              <span className="ml-auto text-xs text-text-dim">{items.length} items</span>
            </button>
          </div>
        </Section>

        <Section icon={Trash2} title="Danger Zone" danger>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-3">
              <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
              <p className="text-xs text-error/80 leading-relaxed">
                Clearing data is permanent and irreversible. Export your vault first if you want a backup.
              </p>
            </div>
            <button
              onClick={handleClearData}
              disabled={clearing}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-error/5 py-3 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Trash2 size={14} />
              {clearing ? 'Clearing...' : 'Clear All Local Data'}
            </button>
          </div>
        </Section>

        <div className="rounded-xl border border-border bg-surface-3 px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield size={13} className="text-accent" />
            <span className="text-sm font-semibold text-text">Web4<span className="text-accent">Project</span></span>
          </div>
          <p className="text-xs text-text-dim">No accounts. No servers. No tracking.</p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-text-dim">
            <button onClick={() => navigate('/privacy')} className="hover:text-text-muted transition-colors">Privacy</button>
            <button onClick={() => navigate('/how')} className="hover:text-text-muted transition-colors">How it Works</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, danger }: { icon: typeof Lock; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-surface-2 overflow-hidden ${danger ? 'border-error/20' : 'border-border'}`}>
      <div className={`flex items-center gap-3 px-5 py-3.5 border-b ${danger ? 'border-error/20' : 'border-border'}`}>
        <Icon size={14} className={danger ? 'text-error' : 'text-accent'} />
        <h2 className={`text-sm font-semibold ${danger ? 'text-error' : 'text-text'}`}>{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
