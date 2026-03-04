export type ItemType = 'note' | 'link' | 'checklist' | 'wallet' | 'code' | 'password';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface VaultMeta {
  id?: number;
  version: string;
  createdAt: string;
  vaultName: string;
  salt: string;
  opsLimit: number;
  memLimit: number;
}

export interface VaultItem {
  id: string;
  type: ItemType;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  tagsIndex: string[];
  ciphertext: string;
  nonce: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 string
}

export interface ItemPayload {
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  type: ItemType;
  checklistItems?: ChecklistItem[];
  language?: string;
  attachments?: Attachment[];
}

export interface DecryptedItem extends ItemPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  filters: SearchFilters;
  createdAt: string;
}

export interface SearchFilters {
  tags?: string[];
  type?: ItemType | '';
  pinned?: boolean | null;
  dateFrom?: string;
  dateTo?: string;
}

export interface VaultTemplate {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  titleTemplate: string;
  bodyTemplate: string;
  tags: string[];
  isBuiltIn: boolean;
}

export interface VaultSettings {
  autoLockMinutes: number;
  reducedMotion: boolean;
  vaultName: string;
  theme?: 'cyberpunk' | 'minimal-light' | 'matrix';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface ExportFile {
  version: string;
  exportedAt: string;
  meta: VaultMeta;
  items: VaultItem[];
}
