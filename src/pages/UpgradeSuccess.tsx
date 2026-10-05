import { Sparkle } from '../components/Icons';

export function UpgradeSuccess() {
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-ink text-mint flex items-center justify-center"><Sparkle className="w-8 h-8" /></div>
      <h1 className="font-display text-5xl mt-6">Welcome to <em className="text-mint-700">Pro</em>.</h1>
      <p className="text-ink-500 mt-4 text-lg">Unlimited invoices, no watermark, your logo and colours. Let's make something beautiful.</p>
      <div className="mt-8 flex justify-center gap-3">
        <a href="#/app/settings" className="btn-ghost">Add logo & colours</a>
        <a href="#/app/new" className="btn-dark">Create an invoice</a>
      </div>
    </div>
  );
}
