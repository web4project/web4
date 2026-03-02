import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Lock, Database, Search, Download } from 'lucide-react';

const STEPS = [
  {
    icon: Key,
    title: '1. Create a Vault',
    desc: 'You choose a passphrase. Web4Project generates a random 32-byte salt and uses it with Argon2id to derive a 256-bit encryption key. The salt and KDF parameters are stored in IndexedDB — but never the key or passphrase.',
    code: 'key = Argon2id(passphrase, salt, opsLimit, memLimit)',
  },
  {
    icon: Lock,
    title: '2. Encrypt Your Memories',
    desc: 'Every item you save is serialized to JSON, then encrypted with XSalsa20-Poly1305 using your derived key and a fresh random nonce. The ciphertext and nonce are stored in IndexedDB. Plaintext only exists in memory.',
    code: 'ciphertext = secretbox(plaintext_json, nonce, key)',
  },
  {
    icon: Database,
    title: '3. Local Storage via IndexedDB',
    desc: 'All data lives in your browser\'s IndexedDB via Dexie. There is no server, no network request for data. The vault is stored on your device and works fully offline after the first page load.',
    code: 'IndexedDB → VaultMeta + EncryptedItems',
  },
  {
    icon: Search,
    title: '4. Search Index (in-memory)',
    desc: 'When you unlock the vault, all items are decrypted into memory and a MiniSearch full-text index is built. The index lives in memory — it is cleared when you lock the vault.',
    code: 'miniSearch.addAll(decryptedItems) // in-memory only',
  },
  {
    icon: Download,
    title: '5. Export / Import',
    desc: 'Export produces a JSON file containing vault metadata and all encrypted items (ciphertext + nonce). This file is safe to store anywhere — without the passphrase it is meaningless.',
    code: '{ version, meta, items: [{ ciphertext, nonce }] }',
  },
];

export function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-text px-6 py-12 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-10">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-text mb-3">How Web4Project Works</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          A technical explanation of the encryption, storage, and search architecture.
        </p>
      </div>

      <div className="space-y-4">
        {STEPS.map(({ icon: Icon, title, desc, code }) => (
          <div key={title} className="rounded-xl border border-border bg-surface-2 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Icon size={15} className="text-accent" />
              </div>
              <h3 className="font-semibold text-text text-sm">{title}</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-3">{desc}</p>
            <code className="block rounded-lg border border-border bg-surface-3 px-3 py-2 text-[11px] font-mono text-accent/80">{code}</code>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-warning/20 bg-warning/5 p-5">
        <h3 className="text-sm font-semibold text-warning mb-2">Security Warning</h3>
        <p className="text-xs text-warning/80 leading-relaxed">
          Do NOT store seed phrases, private keys, or recovery phrases in Web4Project.
          While the encryption is strong, browser security depends on your device security.
          Use a hardware wallet for your most sensitive cryptographic secrets.
        </p>
      </div>
    </div>
  );
}
