import type { CSSProperties } from 'react';
import { LABEL_HUE, ROWS } from './data';
import s from './grey.module.scss';

/**
 * Twelve issues with their due dates, labels in a column of their own so they share one left edge. `filled` gives every label a fill in its own hue, as the
 * eval's tracker did; otherwise labels are grey and their colour is a dot.
 */
export function Issues({ filled }: { filled?: boolean }) {
  return (
    <div className={s.issuesBox}>
      <ul className={s.issues} aria-label="Issues due">
        {ROWS.map((r) => (
          <li key={r.n} className={s.issue}>
            <span className={s.id}>SHOP-{r.n}</span>
            <span className={s.title}>{r.title}</span>
            <span className={s.labels}>
              {r.labels.map((l) => (
                <span key={l} className={s.label} data-filled={filled ? '' : undefined} style={{ '--hue': LABEL_HUE[l] } as CSSProperties}>
                  {!filled && <span className={s.dot} aria-hidden />}
                  {l}
                </span>
              ))}
            </span>
            <span className={s.due} data-overdue={r.overdue ? '' : undefined}>
              {r.overdue ? `Overdue · ${r.due}` : r.due}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
