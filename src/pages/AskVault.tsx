
import { AskVaultPanel } from '../components/vault/AskVaultPanel';

export function AskVault() {
  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 rounded-xl object-contain" />
          </div>
          <h1 className="text-xl font-bold text-text">Ask Vault</h1>
        </div>
        <p className="text-sm text-text-muted">Search your memories with natural language. Everything happens locally.</p>
      </div>

      <div className="rounded-2xl border border-border-2 bg-surface-2 p-5" style={{ height: 'calc(100vh - 200px)', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <AskVaultPanel />
      </div>
    </div>
  );
}
