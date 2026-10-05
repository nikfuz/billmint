import { PricingCards } from '../components/PricingCards';
import { ProToggle } from '../components/Shell';
import { DEMO_BILLING } from '../lib/storage';

const FAQ = [
  ['What counts toward the free limit?', 'Every new invoice or quote you create (including duplicates). The counter resets on the 1st of each month. Deleting a document doesn\u2019t refund it.'],
  ['Where is my data stored?', 'In your browser (localStorage). Nothing is uploaded to a server, so your client data stays private. Export a backup from Settings anytime.'],
  ['Can I cancel?', 'Yes — Pro is month-to-month. Cancel in one click from the Stripe customer portal link in your receipt.'],
  ['Do you support VAT / sales tax?', 'Yes. Set a default tax % in Settings and override it per invoice.'],
];

export function PricingPage() {
  return (
    <div className="grain">
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
        <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-mint-700">Pricing</p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 leading-[1.05]">One invoice paid on time<br /><em className="text-mint-700">pays for a year.</em></h1>
        <p className="text-ink-500 mt-5 text-lg max-w-xl mx-auto">Start free. Upgrade when you're ready to look like the premium studio you are.</p>
        {DEMO_BILLING && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/70 border border-paper-200 px-4 py-2 text-[13px] text-ink-500">
            Dev build: flip the demo switch → <ProToggle compact />
          </div>
        )}
      </section>
      <section className="px-5 pb-20"><PricingCards /></section>
      <section className="max-w-3xl mx-auto px-5 pb-24">
        <h2 className="font-display text-3xl mb-6">Questions</h2>
        <div className="divide-y divide-paper-300 border-y border-paper-300">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="cursor-pointer list-none flex justify-between items-center font-semibold text-[16px]">
                {q}<span className="text-mint-700 text-2xl leading-none transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink-500 text-[15px] leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
