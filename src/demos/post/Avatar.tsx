import type { CSSProperties } from 'react';
import { person } from './people';
import s from './Avatar.module.scss';

// Hues for initials: low chroma, so no avatar reads as a status colour (red for wrong, green for done).
const HUES = [20, 60, 100, 150, 200, 250, 290, 330];

/** The same hue for the same person wherever they appear. */
const hue = (id: string) => HUES[[...id].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7) % HUES.length];

const initials = (name: string, org?: boolean) =>
  (org ? name.replace(/^The /, '')[0] : name.split(' ').map((w) => w[0]).slice(0, 2).join('')).toUpperCase();

/** A person's initials on their colour. */
export function Avatar({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' }) {
  const p = person(id);
  return (
    <span className={s.avatar} data-size={size} style={{ '--hue': hue(id) } as CSSProperties} aria-hidden>
      {initials(p.name, p.org)}
    </span>
  );
}
