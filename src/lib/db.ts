import Dexie, { type Table } from 'dexie';
import type { VaultMeta, VaultItem } from '../types';

export class Web4ProjectDB extends Dexie {
  vaultMeta!: Table<VaultMeta>;
  items!: Table<VaultItem>;

  constructor() {
    super('web4project');
    this.version(1).stores({
      vaultMeta: '++id, version, createdAt',
      items: 'id, type, createdAt, updatedAt, pinned, *tagsIndex',
    });
  }
}

export const db = new Web4ProjectDB();

export async function hasVault(): Promise<boolean> {
  const count = await db.vaultMeta.count();
  return count > 0;
}

export async function getVaultMeta(): Promise<VaultMeta | undefined> {
  return db.vaultMeta.toCollection().first();
}

export async function saveVaultMeta(meta: VaultMeta): Promise<void> {
  await db.vaultMeta.clear();
  await db.vaultMeta.add(meta);
}

export async function getAllItems(): Promise<VaultItem[]> {
  return db.items.toArray();
}

export async function getItemById(id: string): Promise<VaultItem | undefined> {
  return db.items.get(id);
}

export async function saveItem(item: VaultItem): Promise<void> {
  await db.items.put(item);
}

export async function deleteItem(id: string): Promise<void> {
  await db.items.delete(id);
}

export async function clearAllData(): Promise<void> {
  await db.vaultMeta.clear();
  await db.items.clear();
}
