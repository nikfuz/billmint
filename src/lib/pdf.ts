import { jsPDF } from 'jspdf';
import type { BillDoc } from './types';
import { layoutDoc, type LayoutOpts } from './layout';

export function buildPdf(doc: BillDoc, opts: LayoutOpts): jsPDF {
  const pages = layoutDoc(doc, opts);
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  pdf.setProperties({
    title: `${doc.kind === 'invoice' ? 'Invoice' : 'Quote'} ${doc.number}`,
    subject: doc.client.name ? `For ${doc.client.name}` : '',
    author: doc.business.name || 'BillMint',
    creator: 'BillMint',
  });
  pages.forEach((ops, i) => {
    if (i > 0) pdf.addPage();
    for (const op of ops) {
      if (op.t === 'rect') {
        pdf.setFillColor(...op.fill);
        pdf.rect(op.x, op.y, op.w, op.h, 'F');
      } else if (op.t === 'line') {
        pdf.setDrawColor(...op.color);
        pdf.setLineWidth(op.width);
        pdf.line(op.x1, op.y1, op.x2, op.y2);
      } else if (op.t === 'image') {
        try { pdf.addImage(op.src, 'PNG', op.x, op.y, op.w, op.h, undefined, 'FAST'); } catch { /* skip bad image */ }
      } else {
        pdf.setFont(op.font, op.bold ? 'bold' : 'normal');
        pdf.setFontSize(op.size);
        pdf.setTextColor(...op.color);
        const options: Record<string, unknown> = {};
        if (op.align !== 'left') options.align = op.align;
        if (op.spacing) options.charSpace = op.spacing;
        if (op.angle) options.angle = op.angle;
        if (op.opacity !== undefined) {
          pdf.saveGraphicsState();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const GState = (pdf as any).GState;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (GState) (pdf as any).setGState(new GState({ opacity: op.opacity }));
          pdf.text(op.text, op.x, op.y, options);
          pdf.restoreGraphicsState();
        } else {
          pdf.text(op.text, op.x, op.y, options);
        }
      }
    }
  });
  return pdf;
}

export function pdfFilename(doc: BillDoc) {
  const client = (doc.client.name || 'client').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  return `${doc.kind === 'invoice' ? 'Invoice' : 'Quote'}-${doc.number}-${client}.pdf`;
}

export function downloadPdf(doc: BillDoc, opts: LayoutOpts) {
  buildPdf(doc, opts).save(pdfFilename(doc));
}
