import type { SVGProps } from 'react';
type P = SVGProps<SVGSVGElement>;
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' };

export const Check = (p: P) => <svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>;
export const X = (p: P) => <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
export const Plus = (p: P) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const Trash = (p: P) => <svg {...base} {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>;
export const Copy = (p: P) => <svg {...base} {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>;
export const Download = (p: P) => <svg {...base} {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>;
export const Lock = (p: P) => <svg {...base} {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
export const Sparkle = (p: P) => <svg {...base} {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>;
export const Edit = (p: P) => <svg {...base} {...p}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
export const Settings = (p: P) => <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
export const Users = (p: P) => <svg {...base} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>;
export const File = (p: P) => <svg {...base} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>;
export const Arrow = (p: P) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Back = (p: P) => <svg {...base} {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
export const Upload = (p: P) => <svg {...base} {...p}><path d="M12 21V9M7 14l5-5 5 5M5 3h14" /></svg>;
export const Eye = (p: P) => <svg {...base} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>;
export const Swap = (p: P) => <svg {...base} {...p}><path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" /></svg>;
export const Menu = (p: P) => <svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;

export function Leaf({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="16" fill="#0B231C" />
      <path d="M20 44c0-14 10-24 26-24-1 15-10 25-24 25" fill="#3BE0A6" />
      <path d="M20 46l12-12" stroke="#0B231C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
