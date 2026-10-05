// One layout engine, two renderers: the live preview (SVG) and the PDF (jsPDF) draw the
// exact same primitives, so what you see is what your client gets.
import { jsPDF } from 'jspdf';
import type { BillDoc, Party } from './types';
import { fmtDate, fmtQty, lineTotal, money, totals } from './format';

export type RGB = [number, number, number];
export type FontId = 'helvetica' | 'times';
export interface Logo { src: string; w: number; h: number }
export interface LayoutOpts { brandColor: string; logo: Logo | null; watermark: boolean }

export type Op =
  | { t: 'rect'; x: number; y: number; w: number; h: number; fill: RGB }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; color: RGB; width: number }
  | { t: 'image'; x: number; y: number; w: number; h: number; src: string }
  | {
      t: 'text'; x: number; y: number; text: string; size: number; font: FontId; bold: boolean;
      color: RGB; align: 'left' | 'right' | 'center'; spacing?: number; angle?: number; opacity?: number;
    };

export const PAGE = { W: 595.28, H: 841.89 };

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
  const n = parseInt(full.slice(0, 6), 16);
  if (isNaN(n)) return [14, 138, 97];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const mix = (c: RGB, white: number): RGB => c.map((v) => Math.round(v + (255 - v) * white)) as RGB;

let _m: jsPDF | null = null;
function measurer() {
  if (!_m) _m = new jsPDF({ unit: 'pt', format: 'a4' });
  return _m;
}
export function textWidth(s: string, size: number, font: FontId, bold: boolean) {
  const m = measurer();
  m.setFont(font, bold ? 'bold' : 'normal');
  m.setFontSize(size);
  return m.getTextWidth(s);
}
function wrap(s: string, size: number, width: number, font: FontId, bold = false): string[] {
  const m = measurer();
  m.setFont(font, bold ? 'bold' : 'normal');
  m.setFontSize(size);
  const out: string[] = [];
  for (const para of (s || '').split(/\r?\n/)) {
    if (!para.trim()) { out.push(''); continue; }
    out.push(...(m.splitTextToSize(para, width) as string[]));
  }
  return out;
}

export function layoutDoc(doc: BillDoc, o: LayoutOpts): Op[][] {
  const { W, H } = PAGE;
  const M = 48;
  const tpl = doc.template;
  const F: FontId = tpl === 'classic' ? 'times' : 'helvetica';
  const brand = hexToRgb(o.brandColor);
  const soft = mix(brand, 0.9);
  const INK: RGB = [22, 30, 28];
  const MUTED: RGB = [110, 118, 116];
  const RULE: RGB = [226, 229, 227];
  const WHITE: RGB = [255, 255, 255];
  const BOTTOM = H - 80;

  const pages: Op[][] = [[]];
  let ops = pages[0];
  const newPage = () => { ops = []; pages.push(ops); };

  type TOpt = { bold?: boolean; color?: RGB; align?: 'left' | 'right' | 'center'; spacing?: number; font?: FontId };
  const text = (x: number, y: number, s: string, size: number, opt: TOpt = {}) => {
    const font = opt.font || F;
    const bold = !!opt.bold;
    let align = opt.align || 'left';
    if (opt.spacing && align !== 'left') {
      const w = textWidth(s, size, font, bold) + opt.spacing * Math.max(0, s.length - 1);
      x = align === 'right' ? x - w : x - w / 2;
      align = 'left';
    }
    ops.push({ t: 'text', x, y, text: s, size, font, bold, color: opt.color || INK, align, spacing: opt.spacing });
  };
  const rect = (x: number, y: number, w: number, h: number, fill: RGB) => ops.push({ t: 'rect', x, y, w, h, fill });
  const line = (x1: number, y1: number, x2: number, y2: number, color: RGB = RULE, width = 0.6) =>
    ops.push({ t: 'line', x1, y1, x2, y2, color, width });
  const fit = (maxW: number, maxH: number) => {
    if (!o.logo) return { w: 0, h: 0 };
    const s = Math.min(maxW / o.logo.w, maxH / o.logo.h);
    return { w: o.logo.w * s, h: o.logo.h * s };
  };
  const image = (x: number, y: number, w: number, h: number) => o.logo && ops.push({ t: 'image', x, y, w, h, src: o.logo.src });

  const isInv = doc.kind === 'invoice';
  const title = isInv ? 'INVOICE' : 'QUOTE';
  const bizName = doc.business.name || 'Your Business';
  const t = totals(doc);
  const cur = doc.currency;
  const label = (x: number, y: number, s: string, color: RGB = MUTED) => text(x, y, s.toUpperCase(), 7.5, { bold: true, color, spacing: 1 });

  const partyLines = (p: Party, width: number) => {
    const ls: string[] = [];
    if (p.email) ls.push(p.email);
    if (p.phone) ls.push(p.phone);
    if (p.address) ls.push(...wrap(p.address, 9, width, F));
    if (p.taxId) ls.push(`Tax ID: ${p.taxId}`);
    return ls;
  };
  const partyCol = (x: number, y0: number, lbl: string, p: Party, fallback: string, width: number) => {
    label(x, y0, lbl);
    text(x, y0 + 17, wrap(p.name || fallback, 10.5, width, F, true)[0] || fallback, 10.5, { bold: true });
    let yy = y0 + 31;
    for (const l of partyLines(p, width)) { text(x, yy, l, 9, { color: MUTED }); yy += 13; }
    return yy;
  };
  const detailsCol = (x: number, y0: number) => {
    label(x, y0, isInv ? 'Invoice details' : 'Quote details');
    const rows: [string, string, boolean][] = [
      ['Number', doc.number, false],
      ['Issue date', fmtDate(doc.issueDate), false],
      [isInv ? 'Due date' : 'Valid until', fmtDate(doc.dueDate), false],
      [isInv ? 'Amount due' : 'Total', money(t.total, cur), true],
    ];
    let yy = y0 + 17;
    for (const [k, v, b] of rows) {
      text(x, yy, k, 9, { color: MUTED });
      text(W - M, yy, v, 9, { align: 'right', bold: b, color: b ? brand : INK });
      yy += 14;
    }
    return yy;
  };

  let y = M;
  // ---------- HEADER ----------
  if (tpl === 'bold') {
    rect(0, 0, W, 156, brand);
    if (o.logo) {
      const s = fit(150, 52);
      rect(M - 8, 36, s.w + 16, s.h + 16, WHITE);
      image(M, 44, s.w, s.h);
      text(M, 44 + s.h + 36, bizName, 11, { bold: true, color: WHITE });
    } else {
      text(M, 74, bizName, 20, { bold: true, color: WHITE });
      if (doc.business.email) text(M, 94, doc.business.email, 9.5, { color: mix(brand, 0.75) });
    }
    text(W - M, 78, title, 34, { bold: true, color: WHITE, align: 'right' });
    text(W - M, 100, `No. ${doc.number}`, 10, { color: mix(brand, 0.75), align: 'right' });
    text(W - M, 116, `Issued ${fmtDate(doc.issueDate)}`, 10, { color: mix(brand, 0.75), align: 'right' });
    y = 190;
  } else if (tpl === 'classic') {
    if (o.logo) {
      const s = fit(170, 50);
      image((W - s.w) / 2, y, s.w, s.h);
      y += s.h + 14;
    }
    text(W / 2, y + 18, bizName, 22, { bold: true, align: 'center' });
    y += 34;
    const sub = [doc.business.email, doc.business.phone, doc.business.taxId ? `Tax ID ${doc.business.taxId}` : ''].filter(Boolean).join('   ·   ');
    if (sub) { text(W / 2, y, sub, 9, { color: MUTED, align: 'center' }); y += 13; }
    if (doc.business.address) {
      for (const l of wrap(doc.business.address.replace(/\r?\n/g, ', '), 9, 420, F)) { text(W / 2, y, l, 9, { color: MUTED, align: 'center' }); y += 13; }
    }
    y += 10;
    line(M, y, W - M, y, INK, 1.2);
    line(M, y + 3, W - M, y + 3, INK, 0.4);
    y += 34;
    text(W / 2, y, title, 15, { bold: true, color: brand, align: 'center', spacing: 5 });
    text(W / 2, y + 17, `No. ${doc.number}`, 10, { color: MUTED, align: 'center' });
    y += 50;
  } else {
    rect(0, 0, W, 6, brand);
    if (o.logo) {
      const s = fit(160, 56);
      image(M, 40, s.w, s.h);
    } else {
      text(M, 70, bizName, 20, { bold: true });
    }
    text(W - M, 66, title, 28, { bold: true, color: brand, align: 'right' });
    text(W - M, 84, `No. ${doc.number}`, 10, { color: MUTED, align: 'right' });
    y = 128;
  }

  // ---------- PARTIES ----------
  if (tpl === 'classic') {
    const a = partyCol(M, y, 'Billed to', doc.client, 'Client name', 250);
    const b = detailsCol(W - M - 180, y);
    y = Math.max(a, b) + 22;
  } else {
    const a = partyCol(M, y, 'From', doc.business, bizName, 160);
    const b = partyCol(M + 180, y, isInv ? 'Bill to' : 'Prepared for', doc.client, 'Client name', 150);
    const c = detailsCol(W - M - 160, y);
    y = Math.max(a, b, c) + 22;
  }

  // ---------- ITEMS TABLE ----------
  const xQty = W - M - 185;
  const xRate = W - M - 95;
  const xAmt = W - M - 10;
  const xDesc = M + 10;
  const descW = xQty - 50 - xDesc;
  const tableHeader = () => {
    const hh = 26;
    let col = brand;
    if (tpl === 'bold') { rect(M, y, W - 2 * M, hh, brand); col = WHITE; }
    else if (tpl === 'classic') { line(M, y, W - M, y, INK, 0.8); line(M, y + hh, W - M, y + hh, INK, 0.8); col = INK; }
    else rect(M, y, W - 2 * M, hh, soft);
    const by = y + 16.5;
    text(xDesc, by, 'DESCRIPTION', 7.5, { bold: true, color: col, spacing: 1 });
    text(xQty, by, 'QTY', 7.5, { bold: true, color: col, align: 'right', spacing: 1 });
    text(xRate, by, 'RATE', 7.5, { bold: true, color: col, align: 'right', spacing: 1 });
    text(xAmt, by, 'AMOUNT', 7.5, { bold: true, color: col, align: 'right', spacing: 1 });
    y += hh;
  };
  tableHeader();
  const items = doc.items.length ? doc.items : [];
  if (!items.length) {
    text(xDesc, y + 22, 'No line items yet', 9.5, { color: MUTED });
    y += 34;
    line(M, y, W - M, y);
  }
  for (const it of items) {
    const ls = wrap(it.description || '—', 9.5, descW, F);
    const rowH = 26 + (ls.length - 1) * 13;
    if (y + rowH > BOTTOM) { newPage(); y = M; tableHeader(); }
    const by = y + 17;
    ls.forEach((l, i) => text(xDesc, by + i * 13, l, 9.5));
    text(xQty, by, fmtQty(it.qty), 9.5, { align: 'right', color: MUTED });
    text(xRate, by, money(Number(it.rate) || 0, cur), 9.5, { align: 'right', color: MUTED });
    text(xAmt, by, money(lineTotal(it.qty, it.rate), cur), 9.5, { align: 'right', bold: true });
    y += rowH;
    line(M, y, W - M, y);
  }

  // ---------- TOTALS ----------
  if (y + 110 > BOTTOM) { newPage(); y = M; }
  const tx = W - M - 230;
  y += 22;
  text(tx + 10, y, 'Subtotal', 9.5, { color: MUTED });
  text(xAmt, y, money(t.subtotal, cur), 9.5, { align: 'right' });
  y += 18;
  text(tx + 10, y, `Tax (${Number(doc.taxRate) || 0}%)`, 9.5, { color: MUTED });
  text(xAmt, y, money(t.tax, cur), 9.5, { align: 'right' });
  y += 12;
  const boxH = 36;
  let tc: RGB = brand;
  if (tpl === 'bold') { rect(tx, y, W - M - tx, boxH, brand); tc = WHITE; }
  else if (tpl === 'classic') { line(tx, y + 2, W - M, y + 2, INK, 1.2); line(tx, y + boxH, W - M, y + boxH, INK, 0.4); tc = INK; }
  else rect(tx, y, W - M - tx, boxH, soft);
  text(tx + 10, y + 22.5, isInv ? 'Total due' : 'Quote total', 10.5, { bold: true, color: tc });
  text(xAmt, y + 23.5, money(t.total, cur), 15, { bold: true, color: tc, align: 'right' });
  y += boxH + 34;

  // ---------- NOTES ----------
  if (doc.notes.trim()) {
    const ls = wrap(doc.notes.trim(), 9.5, W - 2 * M, F);
    if (y + 30 > BOTTOM) { newPage(); y = M; }
    label(M, y, 'Notes');
    y += 16;
    for (const l of ls) {
      if (y > BOTTOM + 10) { newPage(); y = M; }
      text(M, y, l, 9.5, { color: [70, 78, 76] });
      y += 13.5;
    }
  }

  // ---------- FOOTER + WATERMARK ----------
  const n = pages.length;
  pages.forEach((p, i) => {
    ops = p;
    line(M, H - 52, W - M, H - 52);
    const left = [bizName, doc.business.email].filter(Boolean).join('  ·  ');
    text(M, H - 36, left, 8, { color: MUTED });
    text(W - M, H - 36, `${doc.number}  ·  Page ${i + 1} of ${n}`, 8, { color: MUTED, align: 'right' });
    if (o.watermark) {
      text(W / 2, H - 20, 'Created with BillMint — free plan · billmint.app', 7.5, { color: [14, 138, 97], align: 'center', bold: true });
      const wm = 'BillMint · FREE';
      const size = 66;
      const angle = 32;
      const w = textWidth(wm, size, 'helvetica', true);
      const a = (angle * Math.PI) / 180;
      // start point so the rotated text is centred on the page (y axis points down)
      const sx = W / 2 - (w / 2) * Math.cos(a) + size * 0.35 * Math.sin(a);
      const sy = H / 2 + (w / 2) * Math.sin(a) + size * 0.35 * Math.cos(a);
      p.push({ t: 'text', x: sx, y: sy, text: wm, size, font: 'helvetica', bold: true, color: [120, 130, 128], align: 'left', angle, opacity: 0.1 });
    }
  });
  return pages;
}
