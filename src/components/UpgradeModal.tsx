import { useEffect, useState } from 'react';
import type { ProFeature } from '../lib/pro';
import { store, DEMO_BILLING } from '../lib/storage';
import { startCheckout, hasRealCheckout, billing } from '../lib/billing';
import { FREE_MONTHLY_LIMIT, PRO_PRICE } from '../lib/types';
import { Check, Sparkle, X } from './Icons';

const COPY: Record<ProFeature, { title: string; body: string }> = {
  limit: { title: `You've used your ${FREE_MONTHLY_LIMIT} free documents this month`, body: 'Go Pro for unlimited invoices and quotes — keep billing without waiting for next month.' },
  watermark: { title: 'Remove the BillMint watermark', body: 'Pro PDFs are 100% your brand. No watermark, no footer badge.' },
  logo: { title: 'Add your logo', body: 'Upload your logo once and it appears on every invoice and quote.' },
  colors: { title: 'Use your brand colours', body: 'Match invoices to your brand with any colour you like.' },
  templates: { title: 'Unlock all 3 templates', body: 'Classic and Bold templates are available on Pro.' },
  clients: { title: 'Save your clients', body: 'Keep a client list and fill client details with one click.' },
  csv: { title: 'Export to CSV', body: 'Send your accountant a clean CSV of every invoice in one click.' },
  generic: { title: 'Upgrade to BillMint Pro', body: 'Everything you need to look premium and get paid faster.' },
};

const PERKS = ['Unlimited invoices & quotes', 'No watermark on PDFs', 'Custom logo & brand colours', 'All 3 templates', 'Client list', 'CSV export'];

export function UpgradeModal({ feature, onClose }: { feature: ProFeature; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [demoMsg, setDemoMsg] = useState('');
  const c = COPY[feature];

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onClose]);

  const upgrade = async () => {
    setBusy(true);
    const r = await startCheckout();
    setBusy(false);
    if (r === 'unavailable')
      setDemoMsg(DEMO_BILLING
        ? 'Dev build: no checkout configured (VITE_STRIPE_PAYMENT_LINK is empty). Use the demo button below.'
        : 'Pro checkout opens very soon. The free plan stays fully usable in the meantime.');
    if (r === 'error') setDemoMsg('Checkout failed to start. Please try again.');
  };
  const activateDemo = () => {
    store.setPro(true, 'demo'); // no-op in production builds
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-paper-50 rounded-t-3xl sm:rounded-3xl shadow-paper overflow-hidden animate-pop">
        <div className="relative bg-ink text-paper px-7 pt-7 pb-8 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-mint/20 blur-2xl" />
          <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10" aria-label="Close"><X className="w-5 h-5" /></button>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-mint"><Sparkle className="w-3.5 h-3.5" /> BillMint Pro</span>
          <h2 className="font-display text-[28px] leading-[1.1] mt-3 pr-6">{c.title}</h2>
          <p className="text-paper/70 mt-2 text-[15px]">{c.body}</p>
        </div>
        <div className="px-7 py-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14px] text-ink-700"><Check className="w-4 h-4 mt-0.5 text-mint-600 shrink-0" />{p}</li>
            ))}
          </ul>
          <div className="mt-6 flex items-baseline gap-1.5">
            <span className="font-display text-4xl text-ink">${PRO_PRICE}</span><span className="text-ink-500">/ month</span>
            <span className="ml-auto text-xs text-ink-500">Cancel anytime</span>
          </div>
          <button onClick={upgrade} disabled={busy} className="btn-primary w-full mt-4 justify-center text-[15px] py-3.5">
            {busy ? 'Opening checkout…' : `Upgrade to Pro — $${PRO_PRICE}/mo`}
          </button>
          {demoMsg && <p className="mt-3 text-[13px] text-tang bg-tang-100/60 rounded-xl px-3 py-2">{demoMsg}</p>}
          {DEMO_BILLING && (
          <div className="mt-5 pt-4 border-t border-paper-300 flex items-center justify-between gap-3">
            <div className="text-[12px] text-ink-500 leading-snug">
              <b className="text-ink-700">Dev-only demo</b> — sets <code className="font-mono text-[11px]">billmint_pro=true</code>
              {!hasRealCheckout() && <span className="block">Price ID: <code className="font-mono text-[11px]">{billing.priceId}</code></span>}
            </div>
            <button onClick={activateDemo} className="btn-ghost text-[13px] whitespace-nowrap">Activate Pro (demo)</button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
