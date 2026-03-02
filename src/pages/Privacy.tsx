import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const ITEMS = [
  { title: 'No tracking, ever', desc: 'Web4Project has zero analytics, telemetry, or tracking code. There are no third-party SDKs collecting usage data.' },
  { title: 'No server-side storage', desc: 'Your data is stored exclusively in IndexedDB in your browser. Nothing is ever sent to any server. There is no server.' },
  { title: 'All encryption happens locally', desc: 'Your passphrase is used locally to derive a cryptographic key via Argon2id. It is never transmitted or stored.' },
  { title: 'No cookies for tracking', desc: 'No cookies are used. The only local storage used is IndexedDB for your encrypted vault and localStorage for settings.' },
  { title: 'No accounts or registration', desc: 'Web4Project requires no email address, phone number, or any personal information to use.' },
  { title: 'Open source & auditable', desc: 'The complete source code is available for audit. You can verify every claim made on this page.' },
  { title: 'Export your data anytime', desc: 'You can export your encrypted vault at any time. You own your data completely and can delete it by clearing browser storage.' },
];

export function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-text px-6 py-12 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-10">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
            <Shield size={18} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text">Privacy Policy</h1>
        </div>
        <p className="text-text-muted text-sm leading-relaxed">
          Web4Project was built with privacy as the core principle, not an afterthought.
          This policy describes exactly what data we collect (none) and how your data is handled.
        </p>
      </div>

      <div className="space-y-4">
        {ITEMS.map(({ title, desc }) => (
          <div key={title} className="flex gap-4 rounded-xl border border-border bg-surface-2 p-5">
            <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-text text-sm mb-1">{title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border-2 bg-surface-3 p-6 text-center">
        <p className="text-sm text-text-muted">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Web4Project is open source. The entire codebase can be reviewed on GitHub.
        </p>
      </div>
    </div>
  );
}
