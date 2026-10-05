import type { BillDoc, DocKind, Settings } from './types';
import { DEFAULT_BRAND } from './types';
import { store } from './storage';
import { todayISO, uid } from './format';

export function nextNumber(s: Settings, kind: DocKind) {
  return kind === 'invoice'
    ? `${s.invoicePrefix}${String(s.nextInvoiceNo).padStart(4, '0')}`
    : `${s.quotePrefix}${String(s.nextQuoteNo).padStart(4, '0')}`;
}

export function newDoc(kind: DocKind, s: Settings = store.settings()): BillDoc {
  const now = new Date().toISOString();
  return {
    id: uid(),
    kind,
    number: nextNumber(s, kind),
    status: 'draft',
    issueDate: todayISO(),
    dueDate: todayISO(kind === 'invoice' ? s.paymentTermsDays : 30),
    currency: s.defaultCurrency,
    business: { ...s.business },
    client: { name: '', email: '', address: '', phone: '', taxId: '' },
    items: [{ id: uid(), description: '', qty: 1, rate: 0 }],
    taxRate: s.defaultTax,
    notes: kind === 'invoice' ? s.defaultNotes : 'This quote is valid for 30 days. Happy to adjust scope — just reply.',
    template: s.defaultTemplate,
    createdAt: now,
    updatedAt: now,
  };
}

/** Bumps the invoice/quote counter after a doc is first saved. */
export function consumeNumber(kind: DocKind) {
  const s = store.settings();
  if (kind === 'invoice') s.nextInvoiceNo += 1;
  else s.nextQuoteNo += 1;
  store.saveSettings(s);
}

export function branding(s: Settings, isPro: boolean) {
  return {
    brandColor: isPro ? s.brandColor : DEFAULT_BRAND,
    logoSrc: isPro ? s.logo : null,
    watermark: !isPro,
  };
}

export function effective(doc: BillDoc, isPro: boolean): BillDoc {
  return isPro || doc.template === 'mint' ? doc : { ...doc, template: 'mint' };
}

export const SAMPLE: BillDoc = {
  id: 'sample',
  kind: 'invoice',
  number: 'INV-0042',
  status: 'sent',
  issueDate: todayISO(),
  dueDate: todayISO(14),
  currency: 'EUR',
  business: { name: 'Studio Fuzio', email: 'hello@studiofuzio.it', address: 'Via Roma 12\n00184 Roma, Italy', phone: '', taxId: 'IT01234567890' },
  client: { name: 'Northwind Coffee Co.', email: 'ap@northwind.co', address: '221 Harbour St\nBristol BS1 5TT, UK', phone: '' },
  items: [
    { id: 'a', description: 'Brand identity — logo, palette & type system', qty: 1, rate: 2400 },
    { id: 'b', description: 'Website design (5 pages, responsive)', qty: 5, rate: 380 },
    { id: 'c', description: 'Art direction call', qty: 3, rate: 90 },
  ],
  taxRate: 22,
  notes: 'Thank you for your business! Bank transfer to IBAN IT60 X054 2811 1010 0000 0123 456.',
  template: 'mint',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
