import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Pin } from 'lucide-react';
import { searchItems } from '../../lib/search';
import { useVault } from '../../context/VaultContext';
import type { DecryptedItem } from '../../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  results?: DecryptedItem[];
}

interface AskVaultPanelProps {
  compact?: boolean;
}

export function AskVaultPanel({ compact = false }: AskVaultPanelProps) {
  const { items, editMemory, key } = useVault();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Ask me anything about your vault. I\'ll search your memories and surface what\'s relevant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: q }]);

    await new Promise((r) => setTimeout(r, 400));

    const searchResults = searchItems(q);
    const matched = searchResults
      .slice(0, 5)
      .map((r) => items.find((i) => i.id === r.id))
      .filter((i): i is DecryptedItem => !!i);

    let response = '';
    if (matched.length === 0) {
      response = `No memories found matching "${q}". Try different keywords or add a new memory.`;
    } else if (matched.length === 1) {
      response = `Found 1 memory matching your query:`;
    } else {
      response = `Found ${matched.length} memories matching "${q}":`;
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: response, results: matched }]);
    setLoading(false);
  };

  const pinItem = async (item: DecryptedItem) => {
    if (!key) return;
    await editMemory(item.id, { ...item, pinned: true }, item.createdAt);
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-80' : 'h-full min-h-96'}`}>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="h-7 w-7 shrink-0 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center mt-0.5">
                <Sparkles size={13} className="text-accent" />
              </div>
            )}
            <div className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-accent/10 text-text border border-accent/20' : 'bg-surface-3 text-text-muted border border-border'}`}>
              {msg.content}
              {msg.results && msg.results.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.results.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border-2 bg-surface-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-text truncate">{item.title}</p>
                        {!item.pinned && (
                          <button onClick={() => pinItem(item)} title="Pin as truth" className="shrink-0 text-text-dim hover:text-accent transition-colors">
                            <Pin size={11} />
                          </button>
                        )}
                      </div>
                      {item.body && (
                        <p className="mt-1 text-[11px] text-text-dim line-clamp-2 leading-relaxed">{item.body}</p>
                      )}
                      <span className="mt-1.5 inline-block text-[10px] text-accent/70 border border-accent/20 rounded px-1.5 py-0.5">{item.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 items-center">
            <div className="h-7 w-7 shrink-0 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Sparkles size={13} className="text-accent animate-pulse-soft" />
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleAsk} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your vault..."
          className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text placeholder:text-text-dim outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-black hover:bg-accent-dim hover:shadow-accent-glow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
