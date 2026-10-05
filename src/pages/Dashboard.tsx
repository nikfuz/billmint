import { useMemo, useState } from 'react';
import { store, useStoreVersion } from '../lib/storage';
import { usePro } from '../lib/pro';
import { fmtDate, money, totals } from '../lib/format';
import { docsToCsv, downloadText } from '../lib/csv';
import { duplicateDoc, downloadDocPdf } from '../lib/actions';
import { go } from '../lib/router';
import type { BillDoc, DocStatus } from '../lib/types';
import { FREE_MONTHLY_LIMIT } from '../lib/types';
import { Copy, Download, Edit, File, Lock, Plus, Swap, Trash } from '../components/Icons';

const STATUS_STYLE: Record<DocStatus, string> = {
  draft: 'bg-paper-200 text-ink-500',
  sent: 'bg-[#E3E8FF] text-[#3B3FD9]',
  paid: 'bg-mint-100 text-mint-700',
};

export function Dashboard() {
  useStoreVersion();
  const { isPro, requirePro, openUpgrade } = usePro();
  const docs = store.docs();
  const used = store.usageThisMonth();
  const [filter, setFilter] = useState<'all' | 'invoice' | 'quote'>('all');
  const [q, setQ] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const shown = useMemo(
    () => docs.filter((d) => (filter === 'all' || d.kind === filter) && (!q || `${d.number} ${d.client.name} ${d.client.email}`.toLowerCase().includes(q.toLowerCase()))),
    [docs, filter, q],
  );

  const paidByCur = docs.filter((d) => d.kind === 'invoice' && d.status === 'paid').reduce<Record<string, number>>((a, d) => ({ ...a, [d.currency]: (a[d.currency] || 0) + totals(d).total }), {});
  const outByCur = docs.filter((d) => d.kind === 'invoice' && d.status === 'sent').reduce<Record<string, number>>((a, d) => ({ ...a, [d.currency]: (a[d.currency] || 0) + totals(d).total }), {});
  const sumLabel = (m: Record<string, number>) => Object.entries(m).map(([c, v]) => money(v, c as BillDoc['currency'])).join(' · ') || '—';

  const create = (kind: 'invoice' | 'quote') => {
    if (!store.canCreate(isPro)) return openUpgrade('limit');
    go(`/app/new?kind=${kind}`);
  };
  const dup = (d: BillDoc, kind = d.kind) => {
    const n = duplicateDoc(d, isPro, kind);
    if (!n) return openUpgrade('limit');
    go(`/app/edit/${n.id}`);
  };
  const exportCsv = () => {
    if (!requirePro('csv')) return;
    downloadText(`billmint-export-${new Date().toISOString().slice(0, 10)}.csv`, docsToCsv(docs));
  };
  const setStatus = (d: BillDoc, status: DocStatus) => store.saveDoc({ ...d, status, updatedAt: new Date().toISOString() });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Your documents</h1>
          <p className="text-ink-500 mt-2">Drafts save automatically in this browser.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={exportCsv} className="btn-ghost">{!isPro && <Lock className="w-4 h-4 text-tang" />}Export CSV</button>
          <button onClick={() => create('quote')} className="btn-ghost"><Plus className="w-4 h-4" />New quote</button>
          <button onClick={() => create('invoice')} className="btn-dark"><Plus className="w-4 h-4" />New invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
        <div className="card p-5 col-span-2 lg:col-span-1">
          <p className="label">This month</p>
          {isPro ? (
            <><p className="font-display text-3xl">{used}<span className="text-ink-300 text-xl"> created</span></p><p className="text-[13px] text-mint-700 font-semibold mt-1">Unlimited on Pro</p></>
          ) : (
            <>
              <p className="font-display text-3xl">{Math.min(used, FREE_MONTHLY_LIMIT)}<span className="text-ink-300 text-xl"> / {FREE_MONTHLY_LIMIT} free</span></p>
              <div className="mt-3 h-2 rounded-full bg-paper-200 overflow-hidden"><div className={`h-full rounded-full ${used >= FREE_MONTHLY_LIMIT ? 'bg-tang' : 'bg-mint-600'}`} style={{ width: `${Math.min(100, (used / FREE_MONTHLY_LIMIT) * 100)}%` }} /></div>
              <button onClick={() => openUpgrade('limit')} className="text-[13px] font-bold text-tang mt-2 hover:underline">Get unlimited →</button>
            </>
          )}
        </div>
        <div className="card p-5"><p className="label">Documents</p><p className="font-display text-3xl">{docs.length}</p></div>
        <div className="card p-5"><p className="label">Outstanding</p><p className="font-mono text-[15px] mt-2 font-medium">{sumLabel(outByCur)}</p></div>
        <div className="card p-5 col-span-2 lg:col-span-1"><p className="label">Paid</p><p className="font-mono text-[15px] mt-2 font-medium text-mint-700">{sumLabel(paidByCur)}</p></div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="inline-flex p-1 rounded-full bg-paper-200 self-start">
          {(['all', 'invoice', 'quote'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[13px] font-bold capitalize transition ${filter === f ? 'bg-white text-ink shadow-sm' : 'text-ink-500'}`}>{f === 'all' ? 'All' : f + 's'}</button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search number or client…" className="field sm:max-w-xs py-2" />
      </div>

      {docs.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-mint-100 text-mint-700 flex items-center justify-center"><File className="w-7 h-7" /></div>
          <h2 className="font-display text-3xl mt-5">Nothing here yet</h2>
          <p className="text-ink-500 mt-2">Your first beautiful invoice is about 60 seconds away.</p>
          <button onClick={() => create('invoice')} className="btn-dark mt-6"><Plus className="w-4 h-4" />Create invoice</button>
        </div>
      ) : (
        <div className="mt-5 card overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.1fr_1.6fr_1fr_1fr_0.9fr_auto] gap-4 px-6 py-3 border-b border-paper-200 label mb-0">
            <span>Number</span><span>Client</span><span>Issued</span><span className="text-right">Total</span><span>Status</span><span className="w-[168px]" />
          </div>
          {shown.length === 0 && <p className="p-8 text-center text-ink-500">No matches.</p>}
          {shown.map((d) => {
            const t = totals(d);
            return (
              <div key={d.id} className="grid grid-cols-[1fr_auto] md:grid-cols-[1.1fr_1.6fr_1fr_1fr_0.9fr_auto] gap-x-4 gap-y-1 px-5 md:px-6 py-4 border-b border-paper-200 last:border-0 items-center hover:bg-white/70 transition">
                <a href={`#/app/edit/${d.id}`} className="flex items-center gap-2 min-w-0">
                  <span className={`chip ${d.kind === 'invoice' ? 'bg-ink text-paper' : 'bg-tang-100 text-tang'}`}>{d.kind === 'invoice' ? 'INV' : 'QUO'}</span>
                  <span className="font-mono text-[14px] font-medium truncate">{d.number}</span>
                </a>
                <span className="md:hidden text-right font-mono text-[14px] font-semibold">{money(t.total, d.currency)}</span>
                <a href={`#/app/edit/${d.id}`} className="min-w-0">
                  <p className="font-semibold truncate">{d.client.name || <span className="text-ink-300">No client</span>}</p>
                  <p className="text-[13px] text-ink-500 truncate hidden md:block">{d.client.email}</p>
                </a>
                <span className="text-[14px] text-ink-500 hidden md:block">{fmtDate(d.issueDate)}</span>
                <span className="text-right font-mono text-[14px] font-semibold hidden md:block">{money(t.total, d.currency)}</span>
                <select value={d.status} onChange={(e) => setStatus(d, e.target.value as DocStatus)} className={`chip cursor-pointer border-0 outline-none appearance-none pr-3 w-fit ${STATUS_STYLE[d.status]}`} aria-label="Status">
                  <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option>
                </select>
                <div className="flex items-center justify-end gap-0.5 col-span-2 md:col-span-1 -mr-2">
                  {confirmId === d.id ? (
                    <span className="flex items-center gap-2 text-[13px]">
                      Delete?
                      <button onClick={() => { store.deleteDoc(d.id); setConfirmId(null); }} className="font-bold text-tang">Yes</button>
                      <button onClick={() => setConfirmId(null)} className="font-bold text-ink-500">No</button>
                    </span>
                  ) : (
                    <>
                      <a href={`#/app/edit/${d.id}`} className="btn-icon" title="Edit"><Edit className="w-4 h-4" /></a>
                      <button onClick={() => downloadDocPdf(d, isPro)} className="btn-icon" title="Download PDF"><Download className="w-4 h-4" /></button>
                      <button onClick={() => dup(d)} className="btn-icon" title="Duplicate"><Copy className="w-4 h-4" /></button>
                      {d.kind === 'quote' && <button onClick={() => dup(d, 'invoice')} className="btn-icon" title="Convert to invoice"><Swap className="w-4 h-4" /></button>}
                      <button onClick={() => setConfirmId(d.id)} className="btn-icon hover:text-tang" title="Delete"><Trash className="w-4 h-4" /></button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
