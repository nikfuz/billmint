import { useEffect, useState } from 'react';
import type { BillDoc, Client, Settings } from './types';
import { DEFAULT_BRAND, FREE_MONTHLY_LIMIT } from './types';

/** Demo billing (Pro toggle, 'Activate Pro (demo)') exists only in `vite dev`, never in production builds. */
export const DEMO_BILLING = import.meta.env.DEV;

const K = {
  docs: 'billmint_docs',
  settings: 'billmint_settings',
  clients: 'billmint_clients',
  usage: 'billmint_usage',
  pro: 'billmint_pro',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('billmint:change', { detail: key }));
}

export const defaultSettings: Settings = {
  business: { name: '', email: '', address: '', phone: '', taxId: '' },
  logo: null,
  brandColor: DEFAULT_BRAND,
  defaultTax: 0,
  defaultCurrency: 'EUR',
  defaultNotes: 'Thank you for your business! Payment is due within 14 days.',
  defaultTemplate: 'mint',
  paymentTermsDays: 14,
  invoicePrefix: 'INV-',
  quotePrefix: 'QUO-',
  nextInvoiceNo: 1,
  nextQuoteNo: 1,
};

export const store = {
  // Pro flag. Value 'paid' is written only by the post-checkout handler (src/lib/billing.ts).
  // 'demo' / legacy 'true' come from the demo toggle and are honoured ONLY in dev builds,
  // so stale demo unlocks from earlier builds do not grant Pro in production.
  isPro: () => {
    const v = localStorage.getItem(K.pro);
    return v === 'paid' || (DEMO_BILLING && (v === 'demo' || v === 'true'));
  },
  setPro: (v: boolean, source: 'paid' | 'demo' = 'demo') => {
    if (v) {
      if (source === 'demo' && !DEMO_BILLING) return; // demo unlock disabled in production
      localStorage.setItem(K.pro, source);
    } else localStorage.removeItem(K.pro);
    window.dispatchEvent(new CustomEvent('billmint:change', { detail: K.pro }));
  },

  // Documents
  docs: (): BillDoc[] => read<BillDoc[]>(K.docs, []),
  getDoc: (id: string) => read<BillDoc[]>(K.docs, []).find((d) => d.id === id),
  saveDoc: (doc: BillDoc) => {
    const all = read<BillDoc[]>(K.docs, []);
    const i = all.findIndex((d) => d.id === doc.id);
    if (i >= 0) all[i] = doc;
    else all.unshift(doc);
    write(K.docs, all);
  },
  deleteDoc: (id: string) => write(K.docs, read<BillDoc[]>(K.docs, []).filter((d) => d.id !== id)),

  // Settings
  settings: (): Settings => {
    const s = read<Partial<Settings>>(K.settings, {});
    return { ...defaultSettings, ...s, business: { ...defaultSettings.business, ...(s.business || {}) } };
  },
  saveSettings: (s: Settings) => write(K.settings, s),

  // Clients (Pro)
  clients: (): Client[] => read<Client[]>(K.clients, []),
  saveClients: (c: Client[]) => write(K.clients, c),

  // Usage log: one timestamp per created document. Deleting a doc does NOT refund quota.
  usage: (): string[] => read<string[]>(K.usage, []),
  recordUsage: () => write(K.usage, [...read<string[]>(K.usage, []), new Date().toISOString()]),
  usageThisMonth: (): number => {
    const now = new Date();
    return read<string[]>(K.usage, []).filter((t) => {
      const d = new Date(t);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  },
  canCreate: (pro: boolean) => pro || store.usageThisMonth() < FREE_MONTHLY_LIMIT,

  exportAll: () => ({
    docs: store.docs(),
    settings: store.settings(),
    clients: store.clients(),
    exportedAt: new Date().toISOString(),
  }),
  // Erases documents, settings and clients. Keeps the free-tier usage log (so "erase" isn't a
  // way around the monthly limit) and a paid Pro flag (so paying users don't lose Pro).
  resetAll: () => {
    [K.docs, K.settings, K.clients].forEach((k) => localStorage.removeItem(k));
    if (localStorage.getItem(K.pro) !== 'paid') localStorage.removeItem(K.pro);
    window.dispatchEvent(new CustomEvent('billmint:change', { detail: '*' }));
  },
};

/** Re-render on any BillMint storage change (same tab or other tabs). */
export function useStoreVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const f = () => setV((x) => x + 1);
    window.addEventListener('billmint:change', f);
    window.addEventListener('storage', f);
    return () => {
      window.removeEventListener('billmint:change', f);
      window.removeEventListener('storage', f);
    };
  }, []);
  return v;
}
