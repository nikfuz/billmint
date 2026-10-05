export type Currency = 'EUR' | 'USD' | 'GBP';
export type DocKind = 'invoice' | 'quote';
export type TemplateId = 'mint' | 'classic' | 'bold';
export type DocStatus = 'draft' | 'sent' | 'paid';

export interface Party {
  name: string;
  email: string;
  address: string;
  phone?: string;
  taxId?: string;
}

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export interface BillDoc {
  id: string;
  kind: DocKind;
  number: string;
  status: DocStatus;
  issueDate: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd (valid-until for quotes)
  currency: Currency;
  business: Party;
  client: Party;
  items: LineItem[];
  taxRate: number;
  notes: string;
  template: TemplateId;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  business: Party;
  logo: string | null; // PNG data URL
  brandColor: string;
  defaultTax: number;
  defaultCurrency: Currency;
  defaultNotes: string;
  defaultTemplate: TemplateId;
  paymentTermsDays: number;
  invoicePrefix: string;
  quotePrefix: string;
  nextInvoiceNo: number;
  nextQuoteNo: number;
}

export interface Client extends Party {
  id: string;
  createdAt: string;
}

export const FREE_MONTHLY_LIMIT = 3;
export const DEFAULT_BRAND = '#0E8A61';
export const PRO_PRICE = 12;
export const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP'];
export const TEMPLATES: { id: TemplateId; name: string; blurb: string; pro: boolean }[] = [
  { id: 'mint', name: 'Mint', blurb: 'Clean, modern, airy', pro: false },
  { id: 'classic', name: 'Classic', blurb: 'Serif, timeless, formal', pro: true },
  { id: 'bold', name: 'Bold', blurb: 'Full-colour statement header', pro: true },
];
