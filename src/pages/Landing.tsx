import { DocPreview } from '../components/DocPreview';
import { PricingCards } from '../components/PricingCards';
import { Arrow, Check } from '../components/Icons';
import { SAMPLE } from '../lib/docs';
import { money, totals } from '../lib/format';
import { DEFAULT_BRAND } from '../lib/types';

const FEATURES = [
  { n: '01', t: 'Live preview, pixel-perfect PDF', d: 'What you see is literally what your client gets — the preview and the PDF share one layout engine.' },
  { n: '02', t: 'Invoices and quotes', d: 'Send a quote, win the job, duplicate it into an invoice. Numbering handled for you.' },
  { n: '03', t: 'Your brand, front and centre', d: 'Upload your logo and pick your colour. Three templates that look designed, because they were.' },
  { n: '04', t: 'Tax & multi-currency', d: 'EUR, USD, GBP. Set a default tax rate once, override per invoice. Totals update as you type.' },
  { n: '05', t: 'Private by default', d: 'No account, no server. Everything lives in your browser — your client list never leaves your laptop.' },
  { n: '06', t: 'Accountant-friendly', d: 'Export every invoice to CSV in one click when tax season shows up uninvited.' },
];

export function Landing() {
  const t = totals(SAMPLE);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="max-w-6xl mx-auto px-5 pt-14 md:pt-20 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-paper-200 pl-1.5 pr-3.5 py-1 text-[13px] font-semibold text-ink-500">
              <span className="chip bg-mint text-ink">New</span> Quotes → invoices in one click
            </span>
            <h1 className="font-display text-[44px] sm:text-[62px] lg:text-[72px] leading-[0.98] tracking-[-0.02em] mt-6">
              Invoices so good,<br />clients <em className="text-mint-700 font-medium">pay faster.</em>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-ink-500 max-w-lg leading-relaxed">
              Beautiful invoices & quotes in 60 seconds. BillMint is for freelancers and small agencies who are done sending ugly PDFs.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#/app/new" className="btn-dark text-[16px] px-6 py-3.5">Create your first invoice <Arrow className="w-4 h-4" /></a>
              <a href="#/pricing" className="btn-ghost text-[16px] px-6 py-3.5">See pricing</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-500 font-medium">
              {['No signup', 'Free forever plan', 'PDF in one click'].map((x) => (
                <li key={x} className="flex items-center gap-1.5"><Check className="w-4 h-4 text-mint-600" />{x}</li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -inset-8 bg-mint/30 rounded-[40%] blur-3xl" />
            <div className="relative animate-floaty">
              <DocPreview doc={SAMPLE} brandColor={DEFAULT_BRAND} logo={null} watermark={false} onlyFirstPage />
            </div>
            <div className="absolute -left-4 sm:-left-10 bottom-16 bg-ink text-paper rounded-2xl px-4 py-3 shadow-paper rotate-[-4deg]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mint font-bold">Paid ✓</p>
              <p className="font-mono text-lg">{money(t.total, 'EUR')}</p>
            </div>
            <div className="absolute -right-2 sm:-right-6 top-10 bg-white rounded-2xl px-4 py-2.5 shadow-card rotate-[5deg] text-[13px] font-semibold">⏱ Made in 58s</div>
          </div>
        </div>
      </section>

      {/* LOGO STRIP / SOCIAL PROOF */}
      <section className="border-y border-paper-200 bg-paper-50">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap justify-center gap-x-10 gap-y-2 text-ink-300 font-display italic text-xl">
          <span>designers</span><span>·</span><span>developers</span><span>·</span><span>copywriters</span><span>·</span><span>photographers</span><span>·</span><span>studios</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-24">
        <div className="max-w-2xl">
          <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-mint-700">Why BillMint</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">Your work is premium.<br />Your invoice should be too.</h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-paper-300 rounded-3xl overflow-hidden border border-paper-300">
          {FEATURES.map((f) => (
            <div key={f.n} className="bg-paper-50 p-8 hover:bg-white transition">
              <span className="font-mono text-[13px] text-mint-700">{f.n}</span>
              <h3 className="font-display text-[22px] mt-3 leading-tight">{f.t}</h3>
              <p className="text-ink-500 mt-2.5 text-[15px] leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="bg-ink text-paper py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-mint">Templates</p>
              <h2 className="font-display text-4xl md:text-5xl mt-3">Three looks. Zero design work.</h2>
            </div>
            <a href="#/app/new" className="btn-primary self-start md:self-auto">Try them now <Arrow className="w-4 h-4" /></a>
          </div>
          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {([['mint', 'Mint', DEFAULT_BRAND], ['classic', 'Classic', '#7A3E2B'], ['bold', 'Bold', '#3B3FD9']] as const).map(([id, name, color], i) => (
              <div key={id} className={`${i === 1 ? 'sm:translate-y-8' : ''}`}>
                <DocPreview doc={{ ...SAMPLE, template: id }} brandColor={color} logo={null} watermark={false} onlyFirstPage />
                <p className="mt-4 font-display text-xl">{name} {id !== 'mint' && <span className="pro-pill ml-1 align-middle">Pro</span>}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="max-w-6xl mx-auto px-5 py-24 grid md:grid-cols-3 gap-10">
        {[
          ['Fill in the basics', 'Your details are saved once. Add the client and a few line items.'],
          ['Watch it come alive', 'The live preview updates as you type — totals, tax, everything.'],
          ['Download & send', 'Hit Download PDF. Attach it to an email. Get paid.'],
        ].map(([t, d], i) => (
          <div key={t}>
            <div className="w-12 h-12 rounded-2xl bg-mint text-ink font-display text-2xl flex items-center justify-center shadow-hard">{i + 1}</div>
            <h3 className="font-display text-2xl mt-5">{t}</h3>
            <p className="text-ink-500 mt-2 text-[15px] leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-paper-200/60 py-24 px-5">
        <div className="text-center mb-12">
          <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-mint-700">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Simple. Like it should be.</h2>
        </div>
        <PricingCards />
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="rounded-[36px] bg-mint px-8 py-16 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-60" />
          <h2 className="relative font-display text-4xl md:text-6xl leading-[1.02]">Your next invoice<br />could look <em>this good.</em></h2>
          <p className="relative mt-5 text-ink-700 text-lg">Free. No account. Ready in a minute.</p>
          <a href="#/app/new" className="relative btn-dark mt-9 text-[16px] px-7 py-4">Create an invoice now <Arrow className="w-4 h-4" /></a>
        </div>
      </section>
    </>
  );
}
