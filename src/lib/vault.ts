import { uuidv4 } from '../utils/uuid';
import { createVaultKey, deriveKey, encryptPayload, decryptPayload, wipeKey } from './crypto';
import {
  db,
  saveVaultMeta,
  getVaultMeta,
  getAllItems,
  saveItem,
  deleteItem as dbDeleteItem,
} from './db';
import { buildSearchIndex, addItemToIndex, removeItemFromIndex } from './search';
import type {
  VaultMeta,
  VaultItem,
  DecryptedItem,
  ItemPayload,
  ExportFile,
} from '../types';

export async function createVault(passphrase: string, vaultName: string): Promise<Uint8Array> {
  const { key, params } = await createVaultKey(passphrase);
  const meta: VaultMeta = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    vaultName,
    salt: params.salt,
    opsLimit: params.opsLimit,
    memLimit: params.memLimit,
  };
  await saveVaultMeta(meta);
  return key;
}

export async function unlockVault(passphrase: string): Promise<{ key: Uint8Array; items: DecryptedItem[] }> {
  const meta = await getVaultMeta();
  if (!meta) throw new Error('No vault found');

  const key = await deriveKey(passphrase, {
    salt: meta.salt,
    opsLimit: meta.opsLimit,
    memLimit: meta.memLimit,
  });

  const encryptedItems = await getAllItems();
  const items: DecryptedItem[] = [];

  for (const item of encryptedItems) {
    try {
      const payloadStr = decryptPayload(key, item.ciphertext, item.nonce);
      const payload: ItemPayload = JSON.parse(payloadStr);
      items.push({
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        ...payload,
      });
    } catch {
      throw new Error('Invalid passphrase or corrupted data');
    }
  }

  buildSearchIndex(items);
  return { key, items };
}

export async function addItem(key: Uint8Array, payload: ItemPayload): Promise<DecryptedItem> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const { ciphertext, nonce } = encryptPayload(key, JSON.stringify(payload));

  const vaultItem: VaultItem = {
    id,
    type: payload.type,
    createdAt: now,
    updatedAt: now,
    pinned: payload.pinned,
    tagsIndex: payload.tags,
    ciphertext,
    nonce,
  };

  await saveItem(vaultItem);

  const decrypted: DecryptedItem = { id, createdAt: now, updatedAt: now, ...payload };
  addItemToIndex(decrypted);
  return decrypted;
}

export async function updateItem(
  key: Uint8Array,
  id: string,
  payload: ItemPayload,
  createdAt: string
): Promise<DecryptedItem> {
  const now = new Date().toISOString();
  const { ciphertext, nonce } = encryptPayload(key, JSON.stringify(payload));

  const vaultItem: VaultItem = {
    id,
    type: payload.type,
    createdAt,
    updatedAt: now,
    pinned: payload.pinned,
    tagsIndex: payload.tags,
    ciphertext,
    nonce,
  };

  await saveItem(vaultItem);

  const decrypted: DecryptedItem = { id, createdAt, updatedAt: now, ...payload };
  addItemToIndex(decrypted);
  return decrypted;
}

export async function deleteItem(id: string): Promise<void> {
  await dbDeleteItem(id);
  removeItemFromIndex(id);
}

export async function exportVault(selectedIds?: string[]): Promise<ExportFile> {
  const meta = await getVaultMeta();
  if (!meta) throw new Error('No vault found');

  let items: VaultItem[];
  if (selectedIds && selectedIds.length > 0) {
    const all = await getAllItems();
    items = all.filter((i) => selectedIds.includes(i.id));
  } else {
    items = await getAllItems();
  }

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    meta,
    items,
  };
}

export async function importVault(data: ExportFile, overwrite: boolean): Promise<number> {
  if (data.version !== '1.0') throw new Error('Unsupported vault version');

  if (overwrite) {
    await db.vaultMeta.clear();
    await db.items.clear();
    await saveVaultMeta(data.meta);
    for (const item of data.items) {
      await saveItem(item);
    }
    return data.items.length;
  } else {
    await saveVaultMeta(data.meta);
    for (const item of data.items) {
      const existing = await db.items.get(item.id);
      if (!existing) await saveItem(item);
    }
    return data.items.length;
  }
}

export function lockVault(key: Uint8Array): void {
  try { wipeKey(key); } catch {}
}
