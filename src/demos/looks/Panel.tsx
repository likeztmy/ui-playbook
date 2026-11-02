import type { CSSProperties, ReactNode } from 'react';
import type { Name, Value } from '../../looks';
import s from './Panel.module.scss';

export type Values = [Name, Value][];

/** A look's variables in one theme, set on a box so everything inside draws from them. */
export function Panel({ values, theme, children }: { values: Values; theme: 'light' | 'dark'; children: ReactNode }) {
  const vars = Object.fromEntries(values.map(([n, v]) => [`--${n}`, v[theme]])) as CSSProperties;
  return (
    <div className={s.panel} style={{ ...vars, colorScheme: theme }} data-theme={theme}>
      {children}
    </div>
  );
}
