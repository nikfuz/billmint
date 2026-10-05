import { useEffect, useState } from 'react';
import type { Logo } from './layout';
import { imageSize } from './image';

export function useLogo(src: string | null | undefined): Logo | null {
  const [logo, setLogo] = useState<Logo | null>(null);
  useEffect(() => {
    let alive = true;
    if (!src) { setLogo(null); return; }
    imageSize(src).then(({ w, h }) => alive && setLogo({ src, w, h }));
    return () => { alive = false; };
  }, [src]);
  return logo;
}
