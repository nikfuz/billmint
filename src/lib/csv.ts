import type { BillDoc } from './types';
import { totals } from './format';

function esc(v: string | number) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function docsToCsv(docs: BillDoc[]): string {
  const head = ['Number', 'Type', 'Status', 'Client', 'Client email', 'Issue date', 'Due date', 'Currency', 'Subtotal', 'Tax %', 'Tax', 'Total'];
  const rows = docs.map((d) => {
    const t = totals(d);
    return [d.number, d.kind, d.status, d.client.name, d.client.email, d.issueDate, d.dueDate, d.currency, t.subtotal.toFixed(2), d.taxRate, t.tax.toFixed(2), t.total.toFixed(2)];
  });
  return [head, ...rows].map((r) => r.map(esc).join(',')).join('\n');
}

export function downloadText(filename: string, text: string, mime = 'text/csv') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
