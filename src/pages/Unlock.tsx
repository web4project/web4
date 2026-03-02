import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle, Lock } from 'lucide-react';
import { createVault, unlockVault } from '../lib/vault';
import { getVaultMeta } from '../lib/db';
import { useVault } from '../context/VaultContext';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { toast } from '../hooks/useToast';

export function Unlock() {
  const navigate = useNavigate();
  const { status, setStatus, setItems, setKey, setMeta, meta } = useVault();
  const [mode, setMode] = useState<'create' | 'unlock'>(status === 'no-vault' ? 'create' : 'unlock');
  const [passphrase, setPassphrase] = useState('');
  const [confirm, setConfirm] = useState('');
  const [vaultName, setVaultName] = useState('My Vault');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unlocked') navigate('/vault', { replace: true });
  }, [status, navigate]);

  const strength = (() => {
    if (!passphrase) return 0;
    let s = 0;
    if (passphrase.length >= 12) s++;
    if (passphrase.length >= 20) s++;
    if (/[A-Z]/.test(passphrase)) s++;
    if (/[0-9]/.test(passphrase)) s++;
    if (/[^A-Za-z0-9]/.test(passphrase)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength];
  const strengthColor = ['', 'text-error', 'text-warning', 'text-warning', 'text-success', 'text-accent'][strength];
  const strengthBg = ['', 'bg-error', 'bg-warning', 'bg-warning', 'bg-success', 'bg-accent'][strength];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (passphrase.length < 8) return setError('Passphrase must be at least 8 characters');
    if (passphrase !== confirm) return setError('Passphrases do not match');
    setLoading(true);
    try {
      const key = await createVault(passphrase, vaultName);
      setKey(key);
      setItems([]);
      setStatus('unlocked');
      const m = await getVaultMeta();
      if (m) setMeta(m);
      toast('Vault created successfully!', 'success');
      navigate('/vault', { replace: true });
    } catch (err) {
      console.error('Vault creation error:', err);
      setError('Failed to create vault. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { key, items } = await unlockVault(passphrase);
      setKey(key);
      setItems(items);
      setStatus('unlocked');
      toast(`Vault unlocked — ${items.length} memories loaded`, 'success');
      navigate('/vault', { replace: true });
    } catch {
      setError('Incorrect passphrase or corrupted vault');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-accent-glow-sm">
            {mode === 'create' ? <Shield size={24} className="text-accent" /> : <Lock size={24} className="text-accent" />}
          </div>
          <h1 className="text-2xl font-bold text-text">{mode === 'create' ? 'Create Your Vault' : 'Unlock Vault'}</h1>
          <p className="mt-2 text-sm text-text-muted">
            {mode === 'create' ? 'Set a strong passphrase to encrypt your memories' : meta?.vaultName ? `Opening "${meta.vaultName}"` : 'Enter your passphrase to decrypt'}
          </p>
        </div>

        <div className="rounded-2xl border border-border-2 bg-surface-2/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">
          {status !== 'no-vault' && (
            <div className="flex mb-6 rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => { setMode('unlock'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === 'unlock' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'}`}
              >
                Unlock
              </button>
              <button
                onClick={() => { setMode('create'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === 'create' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'}`}
              >
                New Vault
              </button>
            </div>
          )}

          <form onSubmit={mode === 'create' ? handleCreate : handleUnlock} className="space-y-4">
            {mode === 'create' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Vault Name</label>
                <input
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  placeholder="My Vault"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Passphrase</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter passphrase..."
                  autoFocus
                  required
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {mode === 'create' && passphrase && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${i <= strength ? strengthBg : 'bg-border-2'}`} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-medium ${strengthColor}`}>{strengthLabel}</p>
                </div>
              )}
            </div>

            {mode === 'create' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Confirm Passphrase</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm passphrase..."
                  required
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim outline-none focus:ring-1 transition-all ${confirm && confirm !== passphrase ? 'border-error/50 focus:border-error focus:ring-error/20' : 'border-border focus:border-accent/50 focus:ring-accent/20'}`}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/5 px-3 py-2.5">
                <AlertTriangle size={14} className="text-error shrink-0" />
                <p className="text-xs text-error">{error}</p>
              </div>
            )}

            {mode === 'create' && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 p-3">
                <AlertTriangle size={13} className="text-warning shrink-0 mt-0.5" />
                <p className="text-[11px] text-warning/80 leading-relaxed">
                  If you forget your passphrase, your vault cannot be recovered. There is no reset mechanism.
                </p>
              </div>
            )}

            <PrimaryButton type="submit" loading={loading} className="w-full mt-2" size="lg">
              {mode === 'create' ? 'Create Encrypted Vault' : 'Unlock Vault'}
            </PrimaryButton>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-text-dim">
          Your passphrase never leaves this device.{' '}
          <button onClick={() => navigate('/how')} className="text-accent/70 hover:text-accent transition-colors">Learn more</button>
        </p>
      </div>
    </div>
  );
}
