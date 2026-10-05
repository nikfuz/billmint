import { hasRealCheckout } from '../lib/billing';

export function UpgradeUnverified() {
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <h1 className="font-display text-4xl sm:text-5xl">We couldn't confirm your upgrade here.</h1>
      <p className="text-ink-500 mt-4 text-lg">
        {hasRealCheckout()
          ? 'Pro is activated in the browser you used to check out. If you paid, open BillMint in that same browser, or reply to your payment receipt email and we\u2019ll sort it out.'
          : 'Pro checkout isn\u2019t open yet. The free plan is fully usable in the meantime.'}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <a href="#/pricing" className="btn-ghost">See pricing</a>
        <a href="#/app" className="btn-dark">Open BillMint</a>
      </div>
    </div>
  );
}
