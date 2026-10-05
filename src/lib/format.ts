import type { BillDoc, Currency } from './types';

export const SYMBOL: Record<Currency, string> = { EUR: '€', USD: '$', GBP: '£' };

export function money(n: number, cur: Currency): string {
  const v = Number.isFinite(n) ? n : 0;
  const s = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (v < 0 ? '-' : '') + SYMBOL[cur] + s;
}

export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function lineTotal(qty: number, rate: number) {
  return round2((Number(qty) || 0) * (Number(rate) || 0));
}

export function totals(doc: Pick<BillDoc, 'items' | 'taxRate'>) {
  const subtotal = round2(doc.items.reduce((s, i) => s + lineTotal(i.qty, i.rate), 0));
  const tax = round2((subtotal * (Number(doc.taxRate) || 0)) / 100);
  return { subtotal, tax, total: round2(subtotal + tax) };
}

export function fmtDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function fmtQty(n: number): string {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : v.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
