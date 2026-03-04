import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { DecryptedItem, ItemPayload, VaultMeta, VaultSettings } from '../types';
import { addItem, updateItem, deleteItem, lockVault } from '../lib/vault';
import { clearSearchIndex } from '../lib/search';
import { getVaultMeta, hasVault } from '../lib/db';

export type VaultStatus = 'loading' | 'no-vault' | 'locked' | 'unlocked';

interface VaultContextValue {
  status: VaultStatus;
  items: DecryptedItem[];
  meta: VaultMeta | null;
  settings: VaultSettings;
  key: Uint8Array | null;
  setStatus: (s: VaultStatus) => void;
  setItems: (items: DecryptedItem[]) => void;
  setMeta: (meta: VaultMeta | null) => void;
  setKey: (key: Uint8Array | null) => void;
  updateSettings: (s: Partial<VaultSettings>) => void;
  addMemory: (payload: ItemPayload) => Promise<DecryptedItem>;
  editMemory: (id: string, payload: ItemPayload, createdAt: string) => Promise<DecryptedItem>;
  removeMemory: (id: string) => Promise<void>;
  lock: () => void;
  resetAutoLock: () => void;
}

const VaultContext = createContext<VaultContextValue | null>(null);

const DEFAULT_SETTINGS: VaultSettings = {
  autoLockMinutes: 5,
  reducedMotion: false,
  vaultName: 'My Vault',
  theme: 'cyberpunk',
};

function loadSettings(): VaultSettings {
  try {
    const raw = localStorage.getItem('web4project:settings');
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { }
  return DEFAULT_SETTINGS;
}

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>('loading');
  const [items, setItems] = useState<DecryptedItem[]>([]);
  const [meta, setMeta] = useState<VaultMeta | null>(null);
  const [key, setKey] = useState<Uint8Array | null>(null);
  const [settings, setSettings] = useState<VaultSettings>(loadSettings);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const exists = await hasVault();
        setStatus(exists ? 'locked' : 'no-vault');
        if (exists) {
          const m = await getVaultMeta();
          if (m) setMeta(m);
        }
      } catch {
        setStatus('no-vault');
      }
    })();
  }, []);

  const lock = useCallback(() => {
    if (key) lockVault(key);
    setKey(null);
    setItems([]);
    clearSearchIndex();
    setStatus('locked');
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
  }, [key]);

  const resetAutoLock = useCallback(() => {
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    if (settings.autoLockMinutes > 0) {
      lockTimerRef.current = setTimeout(() => {
        lock();
      }, settings.autoLockMinutes * 60 * 1000);
    }
  }, [settings.autoLockMinutes, lock]);

  useEffect(() => {
    if (status === 'unlocked') {
      resetAutoLock();
      const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
      events.forEach((e) => window.addEventListener(e, resetAutoLock, { passive: true }));
      return () => {
        events.forEach((e) => window.removeEventListener(e, resetAutoLock));
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      };
    }
  }, [status, resetAutoLock]);

  const updateSettings = useCallback((partial: Partial<VaultSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('web4project:settings', JSON.stringify(next));
      if (next.theme) {
        document.documentElement.setAttribute('data-theme', next.theme);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, []);

  const addMemory = useCallback(async (payload: ItemPayload): Promise<DecryptedItem> => {
    if (!key) throw new Error('Vault is locked');
    const item = await addItem(key, payload);
    setItems((prev) => [item, ...prev]);
    return item;
  }, [key]);

  const editMemory = useCallback(async (id: string, payload: ItemPayload, createdAt: string): Promise<DecryptedItem> => {
    if (!key) throw new Error('Vault is locked');
    const item = await updateItem(key, id, payload, createdAt);
    setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
    return item;
  }, [key]);

  const removeMemory = useCallback(async (id: string): Promise<void> => {
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <VaultContext.Provider value={{
      status, items, meta, settings, key,
      setStatus, setItems, setMeta, setKey,
      updateSettings, addMemory, editMemory, removeMemory,
      lock, resetAutoLock,
    }}>
      {children}
    </VaultContext.Provider>
  );
}

export function useVault(): VaultContextValue {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
}
