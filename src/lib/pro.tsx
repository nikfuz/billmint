import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { store } from './storage';
import { UpgradeModal } from '../components/UpgradeModal';

export type ProFeature =
  | 'limit' | 'watermark' | 'logo' | 'colors' | 'templates' | 'clients' | 'csv' | 'generic';

interface ProCtx {
  isPro: boolean;
  setPro: (v: boolean) => void;
  openUpgrade: (f?: ProFeature) => void;
  /** Returns true if allowed; otherwise opens the upgrade modal and returns false. */
  requirePro: (f: ProFeature) => boolean;
}

const Ctx = createContext<ProCtx | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(store.isPro());
  const [modal, setModal] = useState<ProFeature | null>(null);

  useEffect(() => {
    const f = () => setIsPro(store.isPro());
    window.addEventListener('billmint:change', f);
    window.addEventListener('storage', f);
    return () => {
      window.removeEventListener('billmint:change', f);
      window.removeEventListener('storage', f);
    };
  }, []);

  const setPro = useCallback((v: boolean) => store.setPro(v), []);
  const openUpgrade = useCallback((f: ProFeature = 'generic') => setModal(f), []);
  const requirePro = useCallback(
    (f: ProFeature) => {
      if (store.isPro()) return true;
      setModal(f);
      return false;
    },
    [],
  );

  return (
    <Ctx.Provider value={{ isPro, setPro, openUpgrade, requirePro }}>
      {children}
      {modal && <UpgradeModal feature={modal} onClose={() => setModal(null)} />}
    </Ctx.Provider>
  );
}

export function usePro() {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePro outside ProProvider');
  return c;
}
