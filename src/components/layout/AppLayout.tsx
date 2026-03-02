import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { VaultLockOverlay } from './VaultLockOverlay';
import { useVault } from '../../context/VaultContext';

interface AppLayoutProps {
  children: React.ReactNode;
  requiresUnlock?: boolean;
}

export function AppLayout({ children, requiresUnlock = false }: AppLayoutProps) {
  const { status } = useVault();

  return (
    <div className="min-h-screen bg-black font-sans text-text">
      <TopBar />
      <main className="relative pb-20 sm:pb-6">
        {children}
      </main>
      {status === 'unlocked' && <BottomNav />}
      {requiresUnlock && status === 'locked' && <VaultLockOverlay />}
      {requiresUnlock && status === 'no-vault' && <VaultLockOverlay />}
    </div>
  );
}
