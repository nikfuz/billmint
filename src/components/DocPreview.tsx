import { useMemo } from 'react';
import type { BillDoc } from '../lib/types';
import { layoutDoc, PAGE, type Logo, type Op } from '../lib/layout';

const FONT = {
  helvetica: 'Helvetica, Arial, "Liberation Sans", sans-serif',
  times: '"Times New Roman", Times, "Liberation Serif", serif',
};
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

function renderOp(op: Op, i: number) {
  switch (op.t) {
    case 'rect':
      return <rect key={i} x={op.x} y={op.y} width={op.w} height={op.h} fill={rgb(op.fill)} />;
    case 'line':
      return <line key={i} x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2} stroke={rgb(op.color)} strokeWidth={op.width} />;
    case 'image':
      return <image key={i} href={op.src} x={op.x} y={op.y} width={op.w} height={op.h} preserveAspectRatio="none" />;
    case 'text':
      return (
        <text
          key={i}
          x={op.x}
          y={op.y}
          fontFamily={FONT[op.font]}
          fontSize={op.size}
          fontWeight={op.bold ? 700 : 400}
          fill={rgb(op.color)}
          textAnchor={op.align === 'right' ? 'end' : op.align === 'center' ? 'middle' : 'start'}
          letterSpacing={op.spacing || undefined}
          opacity={op.opacity}
          transform={op.angle ? `rotate(${-op.angle} ${op.x} ${op.y})` : undefined}
          style={{ whiteSpace: 'pre' }}
        >
          {op.text}
        </text>
      );
  }
}

export function DocPreview({
  doc, brandColor, logo, watermark, className = '', onlyFirstPage = false,
}: { doc: BillDoc; brandColor: string; logo: Logo | null; watermark: boolean; className?: string; onlyFirstPage?: boolean }) {
  const pages = useMemo(() => layoutDoc(doc, { brandColor, logo, watermark }), [doc, brandColor, logo, watermark]);
  const shown = onlyFirstPage ? pages.slice(0, 1) : pages;
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {shown.map((ops, p) => (
        <svg
          key={p}
          viewBox={`0 0 ${PAGE.W} ${PAGE.H}`}
          className="w-full h-auto bg-white rounded-[3px] shadow-paper select-none"
          role="img"
          aria-label={`Page ${p + 1} preview`}
        >
          <rect x={0} y={0} width={PAGE.W} height={PAGE.H} fill="#fff" />
          {ops.map(renderOp)}
        </svg>
      ))}
    </div>
  );
}
