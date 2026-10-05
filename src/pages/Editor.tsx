import { useEffect, useMemo, useRef, useState } from 'react';
import type { BillDoc, Client, DocKind, LineItem, Party, TemplateId } from '../lib/types';
import { CURRENCIES, TEMPLATES, FREE_MONTHLY_LIMIT } from '../lib/types';
import { store, useStoreVersion } from '../lib/storage';
import { usePro } from '../lib/pro';
import { branding, consumeNumber, effective, newDoc, nextNumber } from '../lib/docs';
import { lineTotal, money, totals, uid, SYMBOL } from '../lib/format';
import { fileToPngDataUrl } from '../lib/image';
import { useLogo } from '../lib/useLogo';
import { downloadPdf } from '../lib/pdf';
import { DocPreview } from '../components/DocPreview';
import { Field, NumInput, Section } from '../components/Form';
import { Back, Check, Download, Eye, Edit, Lock, Plus, Trash, Upload, X } from '../components/Icons';

const SWATCHES = ['#0E8A61', '#0B231C', '#3B3FD9', '#7A3E2B', '#D9480F', '#B5179E', '#1C7ED6', '#2F2F2F'];

export function Editor({ id, kind = 'invoice' }: { id?: string; kind?: DocKind }) {
  useStoreVersion();
  const { isPro, requirePro, openUpgrade } = usePro();
  const settings = store.settings();
  const existing = id ? store.getDoc(id) : undefined;
  const [doc, setDoc] = useState<BillDoc>(() => existing ?? newDoc(kind, settings));
  const [saved, setSaved] = useState<boolean>(!!existing);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [blocked] = useState(() => !existing && !id && !store.canCreate(store.isPro()));
  const [logoErr, setLogoErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const b = branding(settings, isPro);
  const logo = useLogo(b.logoSrc);
  const view = useMemo(() => effective(doc, isPro), [doc, isPro]);
  const t = totals(doc);
  const clients = store.clients();

  // Autosave once the document exists in storage
  useEffect(() => {
    if (!saved) return;
    const h = setTimeout(() => {
      store.saveDoc({ ...doc, updatedAt: new Date().toISOString() });
      setSavedAt(Date.now());
    }, 450);
    return () => clearTimeout(h);
  }, [doc, saved]);

  const set = <K extends keyof BillDoc>(k: K, v: BillDoc[K]) => setDoc((d) => ({ ...d, [k]: v }));
  const setParty = (who: 'business' | 'client', k: keyof Party, v: string) => setDoc((d) => ({ ...d, [who]: { ...d[who], [k]: v } }));
  const setItem = (iid: string, patch: Partial<LineItem>) => setDoc((d) => ({ ...d, items: d.items.map((i) => (i.id === iid ? { ...i, ...patch } : i)) }));
  const addItem = () => setDoc((d) => ({ ...d, items: [...d.items, { id: uid(), description: '', qty: 1, rate: 0 }] }));
  const delItem = (iid: string) => setDoc((d) => ({ ...d, items: d.items.filter((i) => i.id !== iid) }));

  const setKind = (k: DocKind) => {
    if (k === doc.kind) return;
    setDoc((d) => ({ ...d, kind: k, number: saved ? d.number : nextNumber(store.settings(), k) }));
  };

  const saveFirst = (): BillDoc => {
    const d = { ...doc, updatedAt: new Date().toISOString() };
    if (!saved) {
      if (!store.canCreate(store.isPro())) { openUpgrade('limit'); throw new Error('limit'); }
      store.saveDoc(d);
      store.recordUsage();
      consumeNumber(d.kind);
      const s = store.settings();
      if (!s.business.name && d.business.name) store.saveSettings({ ...s, business: { ...d.business }, nextInvoiceNo: s.nextInvoiceNo, nextQuoteNo: s.nextQuoteNo });
      setSaved(true);
      window.history.replaceState(null, '', `#/app/edit/${d.id}`);
    } else {
      store.saveDoc(d);
    }
    setSavedAt(Date.now());
    return d;
  };

  const onSave = () => { try { saveFirst(); } catch { /* limit modal shown */ } };
  const onDownload = () => {
    let d: BillDoc;
    try { d = saveFirst(); } catch { return; }
    downloadPdf(effective(d, isPro), { brandColor: b.brandColor, logo, watermark: b.watermark });
  };

  const pickTemplate = (tid: TemplateId) => {
    const tp = TEMPLATES.find((x) => x.id === tid)!;
    if (tp.pro && !requirePro('templates')) return;
    set('template', tid);
  };
  const setBrand = (c: string) => {
    if (!requirePro('colors')) return;
    store.saveSettings({ ...store.settings(), brandColor: c });
  };
  const onLogo = async (f?: File) => {
    if (!f) return;
    setLogoErr('');
    try {
      const url = await fileToPngDataUrl(f);
      store.saveSettings({ ...store.settings(), logo: url });
    } catch (e) {
      setLogoErr((e as Error).message);
    }
  };
  const clickLogo = () => { if (requirePro('logo')) fileRef.current?.click(); };
  const saveBusinessDefault = () => {
    const s = store.settings();
    store.saveSettings({ ...s, business: { ...doc.business } });
    setSavedAt(Date.now());
  };
  const pickClient = (cid: string) => {
    const c = clients.find((x) => x.id === cid);
    if (c) setDoc((d) => ({ ...d, client: { name: c.name, email: c.email, address: c.address, phone: c.phone || '', taxId: c.taxId || '' } }));
  };
  const saveClient = () => {
    if (!requirePro('clients')) return;
    if (!doc.client.name.trim()) return;
    const list = store.clients();
    const i = list.findIndex((c) => c.name.toLowerCase() === doc.client.name.toLowerCase());
    const c: Client = { ...doc.client, id: i >= 0 ? list[i].id : uid(), createdAt: i >= 0 ? list[i].createdAt : new Date().toISOString() };
    if (i >= 0) list[i] = c; else list.unshift(c);
    store.saveClients(list);
    setSavedAt(Date.now());
  };

  if (id && !existing) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-6">
        <h1 className="font-display text-4xl">Document not found</h1>
        <p className="text-ink-500 mt-3">It may have been deleted, or it was created in another browser.</p>
        <a href="#/app" className="btn-dark mt-8">Back to documents</a>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="max-w-xl mx-auto py-20 sm:py-28 text-center px-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-tang-100 text-tang flex items-center justify-center"><Lock className="w-8 h-8" /></div>
        <h1 className="font-display text-4xl sm:text-5xl mt-6">You've hit this month's free limit</h1>
        <p className="text-ink-500 mt-4 text-lg">The Free plan includes {FREE_MONTHLY_LIMIT} invoices or quotes per month. Go Pro for unlimited documents, no watermark and your own branding.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#/app" className="btn-ghost"><Back className="w-4 h-4" />Back</a>
          <button onClick={() => openUpgrade('limit')} className="btn-primary">Upgrade to Pro — $12/mo</button>
        </div>
      </div>
    );
  }

  const isInv = doc.kind === 'invoice';

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-5 pb-10">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-3 sm:-mx-5 px-3 sm:px-5 py-3 bg-paper/90 backdrop-blur border-b border-paper-200 flex items-center gap-2 sm:gap-3">
        <a href="#/app" className="btn-icon" aria-label="Back"><Back className="w-5 h-5" /></a>
        <div className="inline-flex p-1 rounded-full bg-paper-200">
          {(['invoice', 'quote'] as const).map((k) => (
            <button key={k} onClick={() => setKind(k)} className={`px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-bold capitalize transition ${doc.kind === k ? 'bg-ink text-paper' : 'text-ink-500'}`}>{k}</button>
          ))}
        </div>
        <span className="hidden md:inline font-mono text-[13px] text-ink-500">{doc.number}</span>
        <span className="hidden lg:inline text-[12px] text-ink-300">
          {saved ? (savedAt ? <span className="inline-flex items-center gap-1 text-mint-700"><Check className="w-3.5 h-3.5" />Saved</span> : 'Autosave on') : 'Not saved yet'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onSave} className="btn-ghost hidden sm:inline-flex">{saved ? 'Save' : 'Save draft'}</button>
          <button onClick={onDownload} className="btn-dark"><Download className="w-4 h-4" /><span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">PDF</span></button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden flex justify-center mt-4">
        <div className="inline-flex p-1 rounded-full bg-paper-200">
          <button onClick={() => setTab('edit')} className={`px-5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 ${tab === 'edit' ? 'bg-white shadow-sm' : 'text-ink-500'}`}><Edit className="w-3.5 h-3.5" />Edit</button>
          <button onClick={() => setTab('preview')} className={`px-5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 ${tab === 'preview' ? 'bg-white shadow-sm' : 'text-ink-500'}`}><Eye className="w-3.5 h-3.5" />Preview</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-6 mt-5">
        {/* FORM */}
        <div className={`space-y-5 ${tab === 'preview' ? 'hidden lg:block' : ''}`}>
          <Section title={isInv ? 'Invoice details' : 'Quote details'}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label={isInv ? 'Invoice no.' : 'Quote no.'}><input className="field font-mono" value={doc.number} onChange={(e) => set('number', e.target.value)} /></Field>
              <Field label="Currency">
                <select className="field" value={doc.currency} onChange={(e) => set('currency', e.target.value as BillDoc['currency'])}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{SYMBOL[c]} {c}</option>)}
                </select>
              </Field>
              <Field label="Tax %"><NumInput value={doc.taxRate} onChange={(n) => set('taxRate', n)} min={0} /></Field>
              <Field label="Issue date"><input type="date" className="field" value={doc.issueDate} onChange={(e) => set('issueDate', e.target.value)} /></Field>
              <Field label={isInv ? 'Due date' : 'Valid until'}><input type="date" className="field" value={doc.dueDate} onChange={(e) => set('dueDate', e.target.value)} /></Field>
              <Field label="Status">
                <select className="field" value={doc.status} onChange={(e) => set('status', e.target.value as BillDoc['status'])}>
                  <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Your business" right={<button onClick={saveBusinessDefault} className="text-[13px] font-bold text-mint-700 hover:underline">Save as default</button>}>
            <div className="flex items-center gap-4 mb-5">
              <button onClick={clickLogo} className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-paper-300 bg-white flex items-center justify-center overflow-hidden hover:border-mint-600 transition shrink-0" aria-label="Upload logo">
                {b.logoSrc ? <img src={b.logoSrc} alt="Logo" className="max-w-full max-h-full object-contain p-1.5" /> : <Upload className="w-6 h-6 text-ink-300" />}
                {!isPro && <span className="absolute top-1 right-1 pro-pill px-1.5">Pro</span>}
              </button>
              <div className="text-[13px] text-ink-500">
                <p className="font-semibold text-ink">Logo</p>
                <p>PNG, JPG or SVG. Shows on every document.</p>
                {isPro && settings.logo && <button onClick={() => store.saveSettings({ ...store.settings(), logo: null })} className="text-tang font-bold mt-1">Remove</button>}
                {logoErr && <p className="text-tang">{logoErr}</p>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ''; }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business name"><input className="field" placeholder="Studio Name" value={doc.business.name} onChange={(e) => setParty('business', 'name', e.target.value)} /></Field>
              <Field label="Email"><input type="email" className="field" placeholder="you@studio.com" value={doc.business.email} onChange={(e) => setParty('business', 'email', e.target.value)} /></Field>
              <Field label="Phone"><input className="field" placeholder="Optional" value={doc.business.phone || ''} onChange={(e) => setParty('business', 'phone', e.target.value)} /></Field>
              <Field label="Tax / VAT ID"><input className="field" placeholder="Optional" value={doc.business.taxId || ''} onChange={(e) => setParty('business', 'taxId', e.target.value)} /></Field>
              <Field label="Address" className="sm:col-span-2"><textarea rows={2} className="field resize-none" placeholder={'Street\nCity, Country'} value={doc.business.address} onChange={(e) => setParty('business', 'address', e.target.value)} /></Field>
            </div>
          </Section>

          <Section
            title={isInv ? 'Bill to' : 'Prepared for'}
            right={
              <div className="flex items-center gap-3">
                {isPro && clients.length > 0 ? (
                  <select className="field py-1.5 text-[13px] w-40" value="" onChange={(e) => pickClient(e.target.value)}>
                    <option value="">Pick a client…</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  !isPro && <button onClick={() => openUpgrade('clients')} className="text-[13px] font-bold text-ink-500 flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-tang" />Client list</button>
                )}
                <button onClick={saveClient} className="text-[13px] font-bold text-mint-700 hover:underline whitespace-nowrap">Save client</button>
              </div>
            }
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Client name"><input className="field" placeholder="Acme Inc." value={doc.client.name} onChange={(e) => setParty('client', 'name', e.target.value)} /></Field>
              <Field label="Email"><input type="email" className="field" placeholder="billing@acme.com" value={doc.client.email} onChange={(e) => setParty('client', 'email', e.target.value)} /></Field>
              <Field label="Phone"><input className="field" placeholder="Optional" value={doc.client.phone || ''} onChange={(e) => setParty('client', 'phone', e.target.value)} /></Field>
              <Field label="Tax / VAT ID"><input className="field" placeholder="Optional" value={doc.client.taxId || ''} onChange={(e) => setParty('client', 'taxId', e.target.value)} /></Field>
              <Field label="Address" className="sm:col-span-2"><textarea rows={2} className="field resize-none" placeholder={'Street\nCity, Country'} value={doc.client.address} onChange={(e) => setParty('client', 'address', e.target.value)} /></Field>
            </div>
          </Section>

          <Section title="Line items" right={<span className="font-mono text-[13px] text-ink-500">{doc.items.length} item{doc.items.length === 1 ? '' : 's'}</span>}>
            <div className="hidden sm:grid grid-cols-[1fr_80px_110px_100px_36px] gap-2 label mb-2">
              <span>Description</span><span>Qty</span><span>Rate</span><span className="text-right">Amount</span><span />
            </div>
            <div className="space-y-3">
              {doc.items.map((it, idx) => (
                <div key={it.id} className="grid grid-cols-[1fr_1fr_auto] sm:grid-cols-[1fr_80px_110px_100px_36px] gap-2 items-center p-3 sm:p-0 rounded-2xl bg-white sm:bg-transparent border border-paper-200 sm:border-0">
                  <input className="field col-span-3 sm:col-span-1" placeholder={`Item ${idx + 1} — e.g. Logo design`} value={it.description} onChange={(e) => setItem(it.id, { description: e.target.value })} aria-label="Description" />
                  <NumInput value={it.qty} onChange={(n) => setItem(it.id, { qty: n })} min={0} aria-label="Quantity" placeholder="Qty" />
                  <NumInput value={it.rate} onChange={(n) => setItem(it.id, { rate: n })} min={0} aria-label="Rate" placeholder="Rate" />
                  <span className="hidden sm:block text-right font-mono text-[14px] font-semibold">{money(lineTotal(it.qty, it.rate), doc.currency)}</span>
                  <button onClick={() => delItem(it.id)} className="btn-icon hover:text-tang justify-self-end" aria-label="Remove item"><Trash className="w-4 h-4" /></button>
                  <span className="sm:hidden col-span-3 text-right font-mono text-[13px] text-ink-500">= {money(lineTotal(it.qty, it.rate), doc.currency)}</span>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="btn-ghost mt-4 w-full justify-center border-dashed"><Plus className="w-4 h-4" />Add line item</button>
            <div className="mt-6 ml-auto max-w-xs space-y-2 text-[15px]">
              <div className="flex justify-between text-ink-500"><span>Subtotal</span><span className="font-mono">{money(t.subtotal, doc.currency)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Tax ({doc.taxRate || 0}%)</span><span className="font-mono">{money(t.tax, doc.currency)}</span></div>
              <div className="flex justify-between items-baseline pt-3 border-t border-paper-300"><span className="font-bold">Total</span><span className="font-mono text-2xl font-semibold text-mint-700">{money(t.total, doc.currency)}</span></div>
            </div>
          </Section>

          <Section title="Notes">
            <textarea rows={3} className="field resize-y" placeholder="Payment details, thank-you note, terms…" value={doc.notes} onChange={(e) => set('notes', e.target.value)} />
          </Section>

          <Section title="Look & feel">
            <span className="label">Template</span>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map((tp) => {
                const locked = tp.pro && !isPro;
                const on = view.template === tp.id;
                return (
                  <button key={tp.id} onClick={() => pickTemplate(tp.id)} className={`relative text-left rounded-2xl border-2 p-3 transition ${on ? 'border-ink bg-white' : 'border-paper-200 hover:border-paper-300 bg-white/50'}`}>
                    <TemplateThumb id={tp.id} color={b.brandColor} />
                    <p className="font-bold text-[14px] mt-2 flex items-center gap-1.5">{tp.name}{locked && <Lock className="w-3.5 h-3.5 text-tang" />}</p>
                    <p className="text-[12px] text-ink-500 leading-tight">{tp.blurb}</p>
                    {tp.pro && <span className="absolute top-2 right-2 pro-pill px-1.5">Pro</span>}
                  </button>
                );
              })}
            </div>
            <span className="label mt-5">Brand colour {!isPro && <span className="pro-pill ml-1">Pro</span>}</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {SWATCHES.map((c) => (
                <button key={c} onClick={() => setBrand(c)} className={`w-8 h-8 rounded-full ring-offset-2 ring-offset-paper-50 transition ${b.brandColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-ink' : 'hover:scale-110'}`} style={{ background: c }} aria-label={`Brand colour ${c}`} />
              ))}
              <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-paper-300 flex items-center justify-center cursor-pointer overflow-hidden" onClick={(e) => { if (!isPro) { e.preventDefault(); openUpgrade('colors'); } }} title="Custom colour">
                <Plus className="w-4 h-4 text-ink-300" />
                <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={b.brandColor} onChange={(e) => setBrand(e.target.value)} />
              </label>
            </div>
          </Section>
        </div>

        {/* PREVIEW */}
        <div className={`${tab === 'edit' ? 'hidden lg:block' : ''}`}>
          <div className="lg:sticky lg:top-[136px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="label mb-0">Live preview</p>
              {!isPro && (
                <button onClick={() => openUpgrade('watermark')} className="text-[12px] font-bold text-tang flex items-center gap-1 hover:underline">
                  <X className="w-3.5 h-3.5" />Remove watermark
                </button>
              )}
            </div>
            <div className="lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto rounded-2xl bg-paper-200/70 p-3 sm:p-5">
              <DocPreview doc={view} brandColor={b.brandColor} logo={logo} watermark={b.watermark} />
            </div>
            <button onClick={onDownload} className="btn-primary w-full justify-center mt-4 py-3 lg:hidden"><Download className="w-4 h-4" />Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateThumb({ id, color }: { id: TemplateId; color: string }) {
  return (
    <div className="aspect-[3/4] rounded-lg bg-white border border-paper-200 overflow-hidden p-2 flex flex-col gap-1">
      {id === 'bold' && <div className="h-[30%] -m-2 mb-1 rounded-t" style={{ background: color }} />}
      {id === 'mint' && <div className="h-1 -mx-2 -mt-2 mb-1" style={{ background: color }} />}
      {id === 'classic' && <><div className="h-1.5 w-1/2 mx-auto rounded bg-ink/70" /><div className="h-px bg-ink/60 mt-1" /></>}
      <div className={`h-1.5 w-1/3 rounded ${id === 'classic' ? 'mx-auto' : 'ml-auto'}`} style={{ background: id === 'bold' ? '#ddd' : color }} />
      <div className="flex gap-1 mt-1"><div className="h-1 flex-1 rounded bg-paper-300" /><div className="h-1 flex-1 rounded bg-paper-300" /></div>
      <div className="h-1.5 rounded mt-1" style={{ background: id === 'classic' ? '#ccc' : id === 'bold' ? color : `${color}33` }} />
      <div className="h-1 rounded bg-paper-200" /><div className="h-1 rounded bg-paper-200" /><div className="h-1 rounded bg-paper-200" />
      <div className="h-2 w-1/2 ml-auto rounded mt-auto" style={{ background: id === 'classic' ? '#ccc' : `${color}55` }} />
    </div>
  );
}
