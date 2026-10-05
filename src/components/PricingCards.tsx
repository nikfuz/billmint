import { usePro } from '../lib/pro';
import { startCheckout } from '../lib/billing';
import { FREE_MONTHLY_LIMIT, PRO_PRICE } from '../lib/types';
import { Check, Sparkle, X } from './Icons';

const FREE = [
  [`${FREE_MONTHLY_LIMIT} invoices or quotes / month`, true],
  ['Live preview & PDF download', true],
  ['Mint template', true],
  ['EUR, USD & GBP', true],
  ['BillMint watermark on PDFs', false],
  ['Custom logo & colours', false],
] as const;
const PRO = ['Unlimited invoices & quotes', 'No watermark — 100% your brand', 'Custom logo & brand colours', 'All 3 templates (Mint, Classic, Bold)', 'Client list with one-click fill', 'CSV export for your accountant'];

export function PricingCards() {
  const { isPro, openUpgrade } = usePro();
  const upgrade = async () => {
    const r = await startCheckout();
    if (r !== 'redirected') openUpgrade('generic');
  };
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="card p-8 flex flex-col">
        <h3 className="font-display text-2xl">Free</h3>
        <p className="text-ink-500 mt-1 text-[15px]">For trying BillMint on your next client.</p>
        <div className="mt-6 flex items-baseline gap-1"><span className="font-display text-6xl">$0</span><span className="text-ink-500">/ forever</span></div>
        <ul className="mt-7 space-y-3 flex-1">
          {FREE.map(([t, ok]) => (
            <li key={t} className={`flex gap-2.5 text-[15px] ${ok ? 'text-ink-700' : 'text-ink-300'}`}>
              {ok ? <Check className="w-5 h-5 text-mint-600 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}{t}
            </li>
          ))}
        </ul>
        <a href="#/app/new" className="btn-ghost justify-center mt-8 py-3">Start free</a>
      </div>
      <div className="relative rounded-3xl p-8 flex flex-col bg-ink text-paper shadow-paper overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-mint/25 blur-3xl" />
        <div className="flex items-center justify-between relative">
          <h3 className="font-display text-2xl">Pro</h3>
          <span className="chip bg-mint text-ink gap-1"><Sparkle className="w-3 h-3" /> Most popular</span>
        </div>
        <p className="text-paper/60 mt-1 text-[15px] relative">For freelancers & agencies who bill every week.</p>
        <div className="mt-6 flex items-baseline gap-1 relative"><span className="font-display text-6xl text-mint">${PRO_PRICE}</span><span className="text-paper/60">/ month</span></div>
        <ul className="mt-7 space-y-3 flex-1 relative">
          {PRO.map((t) => (
            <li key={t} className="flex gap-2.5 text-[15px]"><Check className="w-5 h-5 text-mint shrink-0" />{t}</li>
          ))}
        </ul>
        {isPro ? (
          <a href="#/app" className="btn-primary justify-center mt-8 py-3 relative">You're on Pro — open app</a>
        ) : (
          <button onClick={upgrade} className="btn-primary justify-center mt-8 py-3 relative">Upgrade to Pro</button>
        )}
        <p className="text-center text-[12px] text-paper/50 mt-3 relative">Cancel anytime · Secure checkout by Stripe</p>
      </div>
    </div>
  );
}
