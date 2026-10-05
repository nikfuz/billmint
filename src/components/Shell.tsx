import { useState, type ReactNode } from 'react';
import { usePro } from '../lib/pro';
import { DEMO_BILLING } from '../lib/storage';
import { File, Leaf, Menu, Settings, Sparkle, Users, X } from './Icons';

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#/" className="flex items-center gap-2.5 group" aria-label="BillMint home">
      <Leaf className="w-8 h-8 transition-transform group-hover:-rotate-6" />
      <span className={`font-display text-[22px] font-semibold tracking-tight ${dark ? 'text-paper' : 'text-ink'}`}>
        Bill<span className="italic text-mint-600">mint</span>
      </span>
    </a>
  );
}

/** Dev-only demo switch. Renders nothing in production builds. */
export function ProToggle({ compact = false }: { compact?: boolean }) {
  if (!DEMO_BILLING) return null;
  return <ProToggleInner compact={compact} />;
}

function ProToggleInner({ compact }: { compact: boolean }) {
  const { isPro, setPro } = usePro();
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${compact ? 'text-[12px]' : 'text-[13px]'} font-semibold text-ink-500`} title="Demo toggle — sets localStorage billmint_pro">
      <span className="hidden sm:inline">Demo Pro</span>
      <button
        type="button"
        role="switch"
        aria-checked={isPro}
        onClick={() => setPro(!isPro)}
        className={`relative w-10 h-6 rounded-full transition ${isPro ? 'bg-mint-600' : 'bg-paper-300'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isPro ? 'translate-x-4' : ''}`} />
      </button>
    </label>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur border-b border-paper-200">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Wordmark />
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-ink-500">
            <a href="#/" onClick={() => setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50)} className="hover:text-ink">Features</a>
            <a href="#/pricing" className="hover:text-ink">Pricing</a>
            <a href="#/app" className="hover:text-ink">My invoices</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="#/app/new" className="btn-dark text-[14px]">Create invoice — free</a>
          </div>
          <button className="md:hidden btn-icon" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
        {open && (
          <div className="md:hidden border-t border-paper-200 px-5 py-4 flex flex-col gap-3 font-semibold" onClick={() => setOpen(false)}>
            <a href="#/pricing">Pricing</a>
            <a href="#/app">My invoices</a>
            <a href="#/app/new" className="btn-dark justify-center">Create invoice — free</a>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-ink text-paper/70">
        <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-8 md:items-center justify-between">
          <div>
            <Wordmark dark />
            <p className="mt-3 text-[14px] max-w-xs">Beautiful invoices & quotes in 60 seconds. Made for freelancers who care how they look.</p>
          </div>
          <div className="flex gap-8 text-[14px] font-semibold">
            <a href="#/app/new" className="hover:text-mint">Create invoice</a>
            <a href="#/pricing" className="hover:text-mint">Pricing</a>
            <a href="#/app/settings" className="hover:text-mint">Settings</a>
          </div>
          <p className="text-[12px]">© {new Date().getFullYear()} BillMint. Your data stays in your browser.</p>
        </div>
      </footer>
    </div>
  );
}

const NAV = [
  { id: 'docs', label: 'Documents', href: '#/app', icon: File },
  { id: 'clients', label: 'Clients', href: '#/app/clients', icon: Users, pro: true },
  { id: 'settings', label: 'Settings', href: '#/app/settings', icon: Settings },
] as const;

export function AppShell({ children, active, wide = false }: { children: ReactNode; active: string; wide?: boolean }) {
  const { isPro, openUpgrade } = usePro();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-paper-200">
        <div className={`${wide ? 'max-w-[1400px]' : 'max-w-6xl'} mx-auto px-4 sm:px-5 h-16 flex items-center gap-4`}>
          <Wordmark />
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {NAV.map((n) => (
              <a key={n.id} href={n.href} className={`px-3.5 py-2 rounded-full text-[14px] font-semibold flex items-center gap-1.5 transition ${active === n.id ? 'bg-ink text-paper' : 'text-ink-500 hover:text-ink hover:bg-paper-200'}`}>
                {n.label}
                {'pro' in n && n.pro && !isPro && <span className="w-1.5 h-1.5 rounded-full bg-tang" />}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <ProToggle />
            {isPro ? (
              <span className="chip bg-ink text-mint gap-1"><Sparkle className="w-3 h-3" /> Pro</span>
            ) : (
              <button onClick={() => openUpgrade('generic')} className="btn-primary text-[13px] px-4 py-2">Go Pro</button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 pb-24 sm:pb-10">{children}</main>
      {/* mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-paper-50/95 backdrop-blur border-t border-paper-200 grid grid-cols-3">
        {NAV.map((n) => {
          const I = n.icon;
          return (
            <a key={n.id} href={n.href} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold ${active === n.id ? 'text-ink' : 'text-ink-300'}`}>
              <I className="w-5 h-5" />{n.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
