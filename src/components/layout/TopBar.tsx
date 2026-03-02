import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, Lock } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, lock } = useVault();
  const isVault = location.pathname.startsWith('/vault');

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-black/90 backdrop-blur-md px-4 sm:px-6 h-14">
      <button
        onClick={() => navigate(status === 'unlocked' ? '/vault' : '/')}
        className="flex items-center gap-2 group"
      >
        <img src="/logo.png" alt="Logo" className="h-7 w-7 rounded-lg object-contain" />
        <span className="hidden sm:block font-semibold text-sm tracking-tight text-text">
          Web4<span className="text-accent">Project</span>
        </span>
      </button>

      <div className="flex items-center gap-2">
        {status === 'unlocked' && (
          <>
            <button
              onClick={() => navigate('/vault/search')}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted hover:border-border-2 hover:text-text transition-all"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] text-text-dim border border-border px-1 rounded">⌘K</kbd>
            </button>
            <button
              onClick={() => navigate('/vault/new')}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-black hover:bg-accent-dim hover:shadow-accent-glow-sm transition-all"
            >
              <Plus size={13} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button
              onClick={lock}
              title="Lock vault"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2 text-text-muted hover:border-error/50 hover:text-error transition-all"
            >
              <Lock size={14} />
            </button>
          </>
        )}
        {status !== 'unlocked' && !isVault && (
          <button
            onClick={() => navigate('/unlock')}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-black hover:bg-accent-dim transition-all"
          >
            <img src="/logo.png" alt="Logo" className="h-4 w-4 object-contain" />
            Open Vault
          </button>
        )}
      </div>
    </header>
  );
}
