import type { BillDoc, DocKind } from './types';
import { store } from './storage';
import { consumeNumber, nextNumber, branding, effective } from './docs';
import { todayISO, uid } from './format';
import { downloadPdf } from './pdf';
import { imageSize } from './image';

/** Duplicate (optionally converting kind). Returns new doc or null if over the free limit. */
export function duplicateDoc(src: BillDoc, isPro: boolean, kind: DocKind = src.kind): BillDoc | null {
  if (!store.canCreate(isPro)) return null;
  const s = store.settings();
  const now = new Date().toISOString();
  const d: BillDoc = {
    ...structuredClone(src),
    id: uid(),
    kind,
    number: nextNumber(s, kind),
    status: 'draft',
    issueDate: todayISO(),
    dueDate: todayISO(kind === 'invoice' ? s.paymentTermsDays : 30),
    items: src.items.map((i) => ({ ...i, id: uid() })),
    createdAt: now,
    updatedAt: now,
  };
  if (kind !== src.kind) d.notes = kind === 'invoice' ? s.defaultNotes : d.notes;
  store.saveDoc(d);
  store.recordUsage();
  consumeNumber(kind);
  return d;
}

export async function downloadDocPdf(doc: BillDoc, isPro: boolean) {
  const s = store.settings();
  const b = branding(s, isPro);
  const logo = b.logoSrc ? { src: b.logoSrc, ...(await imageSize(b.logoSrc)) } : null;
  downloadPdf(effective(doc, isPro), { brandColor: b.brandColor, logo, watermark: b.watermark });
}
