import type { CSSProperties } from 'react';
import { person } from './people';
import s from './Avatar.module.scss';

// Hues for a person's initials: low chroma, so no avatar reads as a status colour (red for wrong, green
// for done). None near the accent's 256°: a blue face would melt into a selected row's blue tint.
const HUES = [20, 60, 100, 150, 200, 300, 340];

/** The same hue for the same person wherever they appear, from their address: a name can change. */
export const hue = (key: string) => HUES[[...key].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 4) % HUES.length];

const initials = (name: string, org?: boolean) =>
  (org
    ? name.replace(/^The /, '')[0]
    : name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
  ).toUpperCase();

/**
 * A person's initials on their colour; an organisation's first letter on a grey square. A hashed hue
 * would be the wrong colour for a company, which has a colour of its own.
 */
export function Avatar({ id, size = 'md', chroma }: { id: string; size?: 'sm' | 'md'; /** Another fill chroma, for demos. */ chroma?: number }) {
  const p = person(id);
  const vars = p.org ? undefined : ({ '--hue': hue(p.email), ...(chroma === undefined ? {} : { '--chroma': chroma }) } as CSSProperties);
  return (
    <span
      className={s.avatar}
      data-size={size}
      data-org={p.org ? '' : undefined}
      style={vars}
      aria-hidden
    >
      {initials(p.name, p.org)}
    </span>
  );
}
