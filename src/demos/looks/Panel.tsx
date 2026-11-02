import { useState, type CSSProperties, type ReactNode } from 'react';
import type { Name, Value } from '../../looks';
import { PortalContainer } from '../../ui/portal';
import s from './Panel.module.scss';

export type Values = [Name, Value][];

/** A look's variables in one theme, set on a box so everything inside, its popups too, draws from them. */
export function Panel({ values, theme, children }: { values: Values; theme: 'light' | 'dark'; children: ReactNode }) {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const vars = Object.fromEntries(values.map(([n, v]) => [`--${n}`, v[theme]])) as CSSProperties;
  return (
    <div ref={setBox} className={s.panel} style={{ ...vars, colorScheme: theme }} data-theme={theme}>
      <PortalContainer.Provider value={box}>{children}</PortalContainer.Provider>
    </div>
  );
}
