import MiniSearch from 'minisearch';
import type { DecryptedItem } from '../types';

export interface SearchDocument {
  id: string;
  title: string;
  body: string;
  tags: string;
  type: string;
  pinned: boolean;
  createdAt: string;
}

let searchIndex: MiniSearch<SearchDocument> | null = null;

export function createSearchIndex(): MiniSearch<SearchDocument> {
  return new MiniSearch<SearchDocument>({
    fields: ['title', 'body', 'tags'],
    storeFields: ['id', 'title', 'type', 'pinned', 'createdAt', 'tags'],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
}

export function buildSearchIndex(items: DecryptedItem[]): void {
  searchIndex = createSearchIndex();
  const docs: SearchDocument[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    tags: item.tags.join(' '),
    type: item.type,
    pinned: item.pinned,
    createdAt: item.createdAt,
  }));
  searchIndex.addAll(docs);
}

export function searchItems(query: string): SearchDocument[] {
  if (!searchIndex || !query.trim()) return [];
  return searchIndex.search(query) as unknown as SearchDocument[];
}

export function addItemToIndex(item: DecryptedItem): void {
  if (!searchIndex) return;
  const existing = searchIndex.has(item.id);
  if (existing) searchIndex.remove({ id: item.id } as SearchDocument);
  searchIndex.add({
    id: item.id,
    title: item.title,
    body: item.body,
    tags: item.tags.join(' '),
    type: item.type,
    pinned: item.pinned,
    createdAt: item.createdAt,
  });
}

export function removeItemFromIndex(id: string): void {
  if (!searchIndex) return;
  if (searchIndex.has(id)) {
    searchIndex.remove({ id } as SearchDocument);
  }
}

export function clearSearchIndex(): void {
  searchIndex = null;
}

export function getSearchIndex(): MiniSearch<SearchDocument> | null {
  return searchIndex;
}
