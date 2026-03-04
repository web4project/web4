import { useState, useCallback } from 'react';
import type { VaultTemplate } from '../types';

const BUILT_IN_TEMPLATES: VaultTemplate[] = [
  {
    id: 'tpl-note',
    name: 'Quick Note',
    description: 'A simple note with title and body',
    type: 'note',
    titleTemplate: '',
    bodyTemplate: '',
    tags: [],
    isBuiltIn: true,
  },
  {
    id: 'tpl-meeting',
    name: 'Meeting Notes',
    description: 'Structured meeting notes template',
    type: 'note',
    titleTemplate: 'Meeting: ',
    bodyTemplate: '## Attendees\n\n## Agenda\n\n## Notes\n\n## Action Items\n',
    tags: ['meeting'],
    isBuiltIn: true,
  },
  {
    id: 'tpl-link',
    name: 'Save a Link',
    description: 'Save a URL with notes',
    type: 'link',
    titleTemplate: '',
    bodyTemplate: 'URL: \n\nNotes: ',
    tags: [],
    isBuiltIn: true,
  },
  {
    id: 'tpl-checklist',
    name: 'Checklist',
    description: 'A task list or checklist',
    type: 'checklist',
    titleTemplate: '',
    bodyTemplate: '',
    tags: [],
    isBuiltIn: true,
  },
  {
    id: 'tpl-wallet',
    name: 'Wallet Address',
    description: 'Store a wallet or public address',
    type: 'wallet',
    titleTemplate: '',
    bodyTemplate: '',
    tags: ['crypto'],
    isBuiltIn: true,
  },
  {
    id: 'tpl-code',
    name: 'Code Snippet',
    description: 'Save a code snippet with syntax info',
    type: 'code',
    titleTemplate: '',
    bodyTemplate: '',
    tags: ['code'],
    isBuiltIn: true,
  },
];

const STORAGE_KEY = 'web4project:templates';

function loadCustomTemplates(): VaultTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveCustomTemplates(templates: VaultTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function useTemplates() {
  const [custom, setCustom] = useState<VaultTemplate[]>(loadCustomTemplates);

  const allTemplates = [...BUILT_IN_TEMPLATES, ...custom];

  const addTemplate = useCallback((tpl: Omit<VaultTemplate, 'id' | 'isBuiltIn'>) => {
    const newTpl: VaultTemplate = {
      ...tpl,
      id: `tpl-custom-${Date.now()}`,
      isBuiltIn: false,
    };
    setCustom((prev) => {
      const next = [...prev, newTpl];
      saveCustomTemplates(next);
      return next;
    });
    return newTpl;
  }, []);

  const removeTemplate = useCallback((id: string) => {
    setCustom((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveCustomTemplates(next);
      return next;
    });
  }, []);

  return { allTemplates, builtIn: BUILT_IN_TEMPLATES, custom, addTemplate, removeTemplate };
}
