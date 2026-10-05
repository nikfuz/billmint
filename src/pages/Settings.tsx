import { useRef, useState } from 'react';
import type { Currency, Party, Settings, TemplateId } from '../lib/types';
import { CURRENCIES, DEFAULT_BRAND, TEMPLATES } from '../lib/types';
import { store, useStoreVersion } from '../lib/storage';
import { usePro } from '../lib/pro';
import { fileToPngDataUrl } from '../lib/image';
import { downloadText } from '../lib/csv';
import { hasRealCheckout } from '../lib/billing';
import { Field, NumInput, Section } from '../components/Form';
import { ProToggle } from '../components/Shell';
import { Check, Lock, Sparkle, Upload } from '../components/Icons';

const SWATCHES = ['#0E8A61', '#0B231C', '#3B3FD9', '#7A3E2B', '#D9480F', '#B5179E', '#1C7ED6', '#2F2F2F'];

export function SettingsPage() {
  useStoreVersion();
  const { isPro, requirePro, openUpgrade } = usePro();
  const [s, setS] = useState<Settings>(() => store.settings());
  const [ok, setOk] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const up = <K extends keyof Settings>(k: K, v: Settings[K]) => { setS((x) => ({ ...x, [k]: v })); setOk(false); };
  const upBiz = (k: keyof Party, v: string) => { setS((x) => ({ ...x, business: { ...x.business, [k]: v } })); setOk(false); };
  const save = () => {
    const cur = store.settings();
    // keep counters/logo in sync with anything changed elsewhere
    store.saveSettings({ ...s, logo: s.logo, nextInvoiceNo: Math.max(s.nextInvoiceNo, 1), nextQuoteNo: Math.max(s.nextQuoteNo, 1), brandColor: isPro ? s.brandColor : cur.brandColor });
    setOk(true);
    setTimeout(() => setOk(false), 2200);
  };
  const onLogo = async (f?: File) => {
    if (!f) return;
    const url = await fileToPngDataUrl(f);
    up('logo', url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Settings</h1>
          <p className="text-ink-500 mt-2">Defaults for every new invoice and quote.</p>
        </div>
        <button onClick={save} className="btn-dark">{ok ? <><Check className="w-4 h-4" />Saved</> : 'Save settings'}</button>
      </div>

      <div className="space-y-5 mt-8">
        <Section title={<>Plan {isPro ? <span className="chip bg-ink text-mint gap-1"><Sparkle className="w-3 h-3" />Pro</span> : <span className="chip bg-paper-200 text-ink-500">Free</span>}</>}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-[15px] text-ink-500">
              {isPro ? 'Unlimited documents, no watermark, custom branding, all templates, clients & CSV export.' : 'Free: 3 documents / month, watermark, Mint template.'}
              <p className="text-[13px] mt-1">Demo mode toggle sets <code className="font-mono">localStorage.billmint_pro</code>. {hasRealCheckout() ? 'Live checkout is configured.' : 'No checkout configured yet — see README.'}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <ProToggle />
              {!isPro && <button onClick={() => openUpgrade('generic')} className="btn-primary">Upgrade</button>}
            </div>
          </div>
        </Section>

        <Section title="Business profile">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business name"><input className="field" value={s.business.name} onChange={(e) => upBiz('name', e.target.value)} placeholder="Studio Name" /></Field>
            <Field label="Email"><input className="field" type="email" value={s.business.email} onChange={(e) => upBiz('email', e.target.value)} placeholder="you@studio.com" /></Field>
            <Field label="Phone"><input className="field" value={s.business.phone || ''} onChange={(e) => upBiz('phone', e.target.value)} /></Field>
            <Field label="Tax / VAT ID"><input className="field" value={s.business.taxId || ''} onChange={(e) => upBiz('taxId', e.target.value)} /></Field>
            <Field label="Address" className="sm:col-span-2"><textarea rows={2} className="field resize-none" value={s.business.address} onChange={(e) => upBiz('address', e.target.value)} /></Field>
          </div>
        </Section>

        <Section title={<>Branding {!isPro && <span className="pro-pill">Pro</span>}</>}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <span className="label">Logo</span>
              <div className="flex items-center gap-4">
                <button onClick={() => requirePro('logo') && fileRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-paper-300 bg-white flex items-center justify-center overflow-hidden hover:border-mint-600 transition">
                  {s.logo ? <img src={s.logo} alt="Logo" className="max-w-full max-h-full object-contain p-2" /> : isPro ? <Upload className="w-6 h-6 text-ink-300" /> : <Lock className="w-6 h-6 text-tang" />}
                </button>
                <div className="text-[13px] text-ink-500 space-y-1">
                  <button onClick={() => requirePro('logo') && fileRef.current?.click()} className="font-bold text-ink block">Upload logo</button>
                  {s.logo && <button onClick={() => up('logo', null)} className="font-bold text-tang block">Remove</button>}
                  <p>Square or wide PNG works best.</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ''; }} />
              </div>
            </div>
            <div>
              <span className="label">Brand colour</span>
              <div className="flex flex-wrap gap-2.5 items-center">
                {SWATCHES.map((c) => (
                  <button key={c} onClick={() => requirePro('colors') && up('brandColor', c)} className={`w-9 h-9 rounded-full ring-offset-2 ring-offset-paper-50 ${s.brandColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-ink' : ''}`} style={{ background: c }} aria-label={c} />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <input type="color" disabled={!isPro} value={s.brandColor} onChange={(e) => up('brandColor', e.target.value)} className="w-10 h-10 rounded-lg border border-paper-300 bg-white disabled:opacity-40" />
                <input className="field font-mono w-32 py-2" disabled={!isPro} value={s.brandColor} onChange={(e) => up('brandColor', e.target.value)} />
                {s.brandColor !== DEFAULT_BRAND && <button onClick={() => up('brandColor', DEFAULT_BRAND)} className="text-[13px] font-bold text-ink-500">Reset</button>}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Defaults">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Default tax %"><NumInput value={s.defaultTax} onChange={(n) => up('defaultTax', n)} min={0} /></Field>
            <Field label="Default currency">
              <select className="field" value={s.defaultCurrency} onChange={(e) => up('defaultCurrency', e.target.value as Currency)}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Payment terms (days)"><NumInput value={s.paymentTermsDays} onChange={(n) => up('paymentTermsDays', Math.max(0, Math.round(n)))} min={0} step="1" /></Field>
            <Field label="Default template">
              <select className="field" value={s.defaultTemplate} onChange={(e) => { const v = e.target.value as TemplateId; if (v !== 'mint' && !requirePro('templates')) return; up('defaultTemplate', v); }}>
                {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}{t.pro && !isPro ? ' (Pro)' : ''}</option>)}
              </select>
            </Field>
            <Field label="Invoice prefix"><input className="field font-mono" value={s.invoicePrefix} onChange={(e) => up('invoicePrefix', e.target.value)} /></Field>
            <Field label="Next invoice no."><NumInput value={s.nextInvoiceNo} onChange={(n) => up('nextInvoiceNo', Math.max(1, Math.round(n)))} min={1} step="1" /></Field>
            <Field label="Quote prefix"><input className="field font-mono" value={s.quotePrefix} onChange={(e) => up('quotePrefix', e.target.value)} /></Field>
            <Field label="Next quote no."><NumInput value={s.nextQuoteNo} onChange={(n) => up('nextQuoteNo', Math.max(1, Math.round(n)))} min={1} step="1" /></Field>
            <Field label="Default notes" className="col-span-2 sm:col-span-3"><textarea rows={3} className="field" value={s.defaultNotes} onChange={(e) => up('defaultNotes', e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Your data">
          <p className="text-[15px] text-ink-500">Everything is stored only in this browser. Back it up regularly.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => downloadText(`billmint-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(store.exportAll(), null, 2), 'application/json')} className="btn-ghost">Download backup (JSON)</button>
            {confirmReset ? (
              <span className="flex items-center gap-3 text-[14px]">Erase all BillMint data?
                <button onClick={() => { store.resetAll(); setS(store.settings()); setConfirmReset(false); }} className="font-bold text-tang">Yes, erase</button>
                <button onClick={() => setConfirmReset(false)} className="font-bold text-ink-500">Cancel</button>
              </span>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="btn-ghost text-tang border-tang/30">Reset all data</button>
            )}
          </div>
        </Section>
      </div>

      <div className="sticky bottom-20 sm:bottom-4 mt-6 flex justify-end">
        <button onClick={save} className="btn-dark shadow-paper">{ok ? <><Check className="w-4 h-4" />Saved</> : 'Save settings'}</button>
      </div>
    </div>
  );
}
