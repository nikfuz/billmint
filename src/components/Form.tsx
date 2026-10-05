import { useEffect, useState, type ReactNode } from 'react';

export function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

/** Number input that lets users type freely ("1.", "") but always reports a number. */
export function NumInput({ value, onChange, className = '', step = 'any', min, ...rest }: {
  value: number; onChange: (n: number) => void; className?: string; step?: string; min?: number; placeholder?: string; 'aria-label'?: string;
}) {
  const [s, setS] = useState(String(value ?? ''));
  useEffect(() => {
    if ((parseFloat(s) || 0) !== value) setS(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      value={s}
      onChange={(e) => { setS(e.target.value); onChange(parseFloat(e.target.value) || 0); }}
      onBlur={() => setS(String(parseFloat(s) || 0))}
      className={`field font-mono ${className}`}
      {...rest}
    />
  );
}

export function Section({ title, right, children }: { title: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="section-title">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
