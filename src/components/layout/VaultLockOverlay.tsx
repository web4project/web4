import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';
import { PrimaryButton } from '../ui/PrimaryButton';

export function VaultLockOverlay() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border-2 bg-surface-2">
          <Lock size={32} className="text-accent" />
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={14} className="text-accent" />
            <span className="text-sm font-semibold text-accent tracking-wide">WEB4PROJECT</span>
          </div>
          <h2 className="text-2xl font-bold text-text">Vault is Locked</h2>
          <p className="mt-2 text-sm text-text-muted">Your memories are safely encrypted</p>
        </div>
        <PrimaryButton onClick={() => navigate('/unlock')} size="lg">
          Unlock Vault
        </PrimaryButton>
      </div>
    </div>
  );
}
