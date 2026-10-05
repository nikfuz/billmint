import { useEffect, useState } from 'react';

export function useRoute(): string {
  const get = () => (window.location.hash || '#/').slice(1) || '/';
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const f = () => {
      setRoute(get());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return route;
}

export function go(path: string) {
  window.location.hash = path;
}
