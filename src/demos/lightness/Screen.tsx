import type { CSSProperties } from 'react';
import s from './lightness.module.scss';

/** The roles a small screen is painted with, as CSS colours. */
export type Palette = {
  ground: string;
  surface: string;
  line: string;
  ink: string;
  muted: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
};

const ROWS = [
  { from: 'Priya Raman', subject: 'Venue shortlist for March', unread: true },
  { from: 'Daniel Okafor', subject: 'Re: Q4 roadmap review', current: true },
  { from: 'Lea Novak', subject: 'Photos from Saturday' },
];

/** A mail list on its desk: enough surfaces, text and one accent to judge a palette by. */
export function Screen({ palette, compact }: { palette: Palette; compact?: boolean }) {
  const vars = {
    '--p-ground': palette.ground,
    '--p-surface': palette.surface,
    '--p-line': palette.line,
    '--p-ink': palette.ink,
    '--p-muted': palette.muted,
    '--p-accent': palette.accent,
    '--p-on-accent': palette.onAccent,
    '--p-accent-soft': palette.accentSoft,
  } as CSSProperties;
  return (
    <div className={s.ground} style={vars} data-compact={compact ? '' : undefined}>
      <div className={s.sheet}>
        <div className={s.sheetBar}>
          <span className={s.sheetTitle}>Inbox</span>
          <span className={s.sheetButton}>New message</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.from} className={s.sheetRow} data-current={r.current ? '' : undefined} data-unread={r.unread ? '' : undefined}>
            <span className={s.sheetDot} />
            <span className={s.sheetFace}>{r.from[0]}</span>
            <span className={s.sheetText}>
              <span className={s.sheetFrom}>{r.from}</span>
              <span className={s.sheetSubject}>{r.subject}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
