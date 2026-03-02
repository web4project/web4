import { useNavigate } from 'react-router-dom';
import { Lock, Wifi, Server, FileDown, ArrowRight, ChevronRight, Zap, Eye, Database } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { useVault } from '../context/VaultContext';

const FEATURES = [
  { icon: Lock, title: 'End-to-End Encrypted', desc: 'Every memory is encrypted with Argon2id + XSalsa20-Poly1305 before it ever touches storage. Your passphrase never leaves your device.' },
  { icon: Wifi, title: 'Offline First', desc: 'Works fully offline after the first load. No CDN dependencies for your data. Your vault lives in IndexedDB on your device.' },
  { icon: Server, title: 'Zero Server', desc: 'No backend. No database server. No API keys. No accounts. It\'s a static site that runs entirely in your browser.' },
  { icon: FileDown, title: 'Export / Import', desc: 'Your vault is fully portable. Export an encrypted backup file anytime and import it on any device.' },
];

const TYPES = [
  { emoji: '📝', label: 'Notes' },
  { emoji: '🔗', label: 'Links' },
  { emoji: '✅', label: 'Checklists' },
  { emoji: '💻', label: 'Code' },
  { emoji: '🔑', label: 'Addresses' },
];

export function Landing() {
  const navigate = useNavigate();
  const { status } = useVault();

  return (
    <div className="min-h-screen bg-black text-text relative">
      <AnimatedBackground />
      <div className="noise-overlay" />
      <div className="dot-grid" />
      <div className="relative z-10">
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(158,251,79,0.04)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/3 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
              <Zap size={11} />
              Web4 — User-Owned • Encrypted • Offline
            </div>

            <h1 className="mb-6 text-5xl sm:text-7xl font-bold tracking-tight text-text leading-none">
              Your private<br />
              <span className="text-accent">memory vault</span>
            </h1>
            <p className="mb-10 max-w-xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed">
              Web4Project is a personal knowledge base that runs entirely in your browser.
              No accounts. No servers. Everything encrypted on your device.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {status === 'unlocked' ? (
                <PrimaryButton onClick={() => navigate('/vault')} size="lg">
                  Open Vault <ArrowRight size={16} />
                </PrimaryButton>
              ) : (
                <>
                  <PrimaryButton onClick={() => navigate('/unlock')} size="lg">
                    Create Vault <ArrowRight size={16} />
                  </PrimaryButton>
                  {status === 'locked' && (
                    <SecondaryButton onClick={() => navigate('/unlock')} size="lg">
                      Unlock Vault
                    </SecondaryButton>
                  )}
                </>
              )}
              <button onClick={() => navigate('/how')} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors">
                How it works <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {TYPES.map(({ emoji, label }) => (
                <span key={label} className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-muted">
                  {emoji} {label}
                </span>
              ))}
            </div>

            <button
              onClick={() => { navigator.clipboard.writeText('8EkY5VPYkkzoHUCNMkXYmyxbvLnYb7chiqmUnRqtWEB4'); }}
              title="Click to copy"
              className="mt-6 inline-block rounded-lg border border-border bg-surface-2/60 px-4 py-2 font-mono text-[11px] sm:text-xs text-text-dim hover:text-text-muted hover:border-border-2 transition-all cursor-pointer select-all break-all max-w-md"
            >
              8EkY5VPYkkzoHUCNMkXYmyxbvLnYb7chiqmUnRqtWEB4
            </button>
          </div>
        </section>

        <section className="px-6 py-20 max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text mb-3">Built different</h2>
            <p className="text-text-muted text-sm">No compromises on privacy or ownership</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-surface-2 p-6 hover:border-border-2 transition-all">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/5">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-text">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border-2 bg-surface-2 p-8 sm:p-12 text-center">
            <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-accent/10 border border-accent/30">
              <Database size={24} className="text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">Your brain. Your data.</h2>
            <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto mb-8">
              Web4Project is a static HTML/JS app. You can self-host it, fork it, or run it from a USB drive.
              The vault file is yours — portable and encrypted forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <PrimaryButton onClick={() => navigate('/unlock')} size="lg">
                Get Started Free <ArrowRight size={16} />
              </PrimaryButton>
              <SecondaryButton onClick={() => navigate('/privacy')} size="lg">
                <Eye size={15} /> Privacy Policy
              </SecondaryButton>
            </div>
          </div>
        </section>

        <footer className="border-t border-border px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain" />
            <span className="font-semibold text-sm text-text">Web4<span className="text-accent">Project</span></span>
          </div>
          <p className="text-xs text-text-dim">No tracking. No analytics. No cookies. No servers. Your data never leaves your device.</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-dim">
            <button onClick={() => navigate('/privacy')} className="hover:text-text-muted transition-colors">Privacy</button>
            <button onClick={() => navigate('/how')} className="hover:text-text-muted transition-colors">How it Works</button>
            <a href="https://x.com/web4_infinity" target="_blank" rel="noopener noreferrer" className="hover:text-text-muted transition-colors">𝕏</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
