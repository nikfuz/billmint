import { useState } from 'react';
import type { Client } from '../lib/types';
import { store, useStoreVersion } from '../lib/storage';
import { usePro } from '../lib/pro';
import { uid } from '../lib/format';
import { Field } from '../components/Form';
import { Lock, Plus, Trash, Users, Edit } from '../components/Icons';

const blank = (): Client => ({ id: uid(), name: '', email: '', address: '', phone: '', taxId: '', createdAt: new Date().toISOString() });

export function ClientsPage() {
  useStoreVersion();
  const { isPro, openUpgrade } = usePro();
  const clients = store.clients();
  const [edit, setEdit] = useState<Client | null>(null);

  if (!isPro) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-tang-100 text-tang flex items-center justify-center"><Lock className="w-8 h-8" /></div>
        <h1 className="font-display text-4xl sm:text-5xl mt-6">Your client list lives on Pro</h1>
        <p className="text-ink-500 mt-4 text-lg">Save clients once, fill invoices in one click. Plus unlimited documents, no watermark and your own branding.</p>
        <button onClick={() => openUpgrade('clients')} className="btn-primary mt-8">Unlock clients — $12/mo</button>
      </div>
    );
  }

  const save = () => {
    if (!edit || !edit.name.trim()) return;
    const list = store.clients();
    const i = list.findIndex((c) => c.id === edit.id);
    if (i >= 0) list[i] = edit; else list.unshift(edit);
    store.saveClients(list);
    setEdit(null);
  };
  const del = (id: string) => store.saveClients(store.clients().filter((c) => c.id !== id));
  const upd = (k: keyof Client, v: string) => setEdit((e) => (e ? { ...e, [k]: v } : e));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Clients</h1>
          <p className="text-ink-500 mt-2">Pick them from any invoice or quote.</p>
        </div>
        <button onClick={() => setEdit(blank())} className="btn-dark"><Plus className="w-4 h-4" />Add client</button>
      </div>

      {edit && (
        <div className="card p-6 mt-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><input autoFocus className="field" value={edit.name} onChange={(e) => upd('name', e.target.value)} /></Field>
            <Field label="Email"><input className="field" value={edit.email} onChange={(e) => upd('email', e.target.value)} /></Field>
            <Field label="Phone"><input className="field" value={edit.phone || ''} onChange={(e) => upd('phone', e.target.value)} /></Field>
            <Field label="Tax / VAT ID"><input className="field" value={edit.taxId || ''} onChange={(e) => upd('taxId', e.target.value)} /></Field>
            <Field label="Address" className="sm:col-span-2"><textarea rows={2} className="field resize-none" value={edit.address} onChange={(e) => upd('address', e.target.value)} /></Field>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setEdit(null)} className="btn-ghost">Cancel</button>
            <button onClick={save} disabled={!edit.name.trim()} className="btn-dark">Save client</button>
          </div>
        </div>
      )}

      {clients.length === 0 && !edit ? (
        <div className="card mt-8 p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-mint-100 text-mint-700 flex items-center justify-center"><Users className="w-7 h-7" /></div>
          <h2 className="font-display text-3xl mt-5">No clients yet</h2>
          <p className="text-ink-500 mt-2">Add one here, or hit “Save client” inside any invoice.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {clients.map((c) => (
            <div key={c.id} className="card p-5 group">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-ink text-mint font-display text-lg flex items-center justify-center">{c.name.slice(0, 1).toUpperCase()}</div>
                <div className="flex opacity-60 group-hover:opacity-100 transition">
                  <button onClick={() => setEdit(c)} className="btn-icon" aria-label="Edit"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => del(c.id)} className="btn-icon hover:text-tang" aria-label="Delete"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="font-bold text-[16px] mt-3">{c.name}</p>
              <p className="text-[14px] text-ink-500">{c.email}</p>
              {c.address && <p className="text-[13px] text-ink-300 mt-2 whitespace-pre-line">{c.address}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
