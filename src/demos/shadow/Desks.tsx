import { Frame } from '../shell';
import { Lifted } from './Lifted';
import s from './shadow.module.scss';

// The same card, lifted one step, four ways on a dark desk. The light-mode shadow, then twice as
// dark, then a lighter surface with a hairline, then a glow.
const WAYS: { name: string; verdict: 'bad' | 'good'; shadow: string; surface?: string }[] = [
  {
    name: 'Light mode’s shadow',
    verdict: 'bad',
    shadow: '0 0 0 1px oklch(0 0 0 / 0.08), 0 6px 12px oklch(0 0 0 / 0.08)',
    surface: 'oklch(0.2 0.005 260)',
  },
  { name: 'Twice as dark', verdict: 'bad', shadow: '0 0 0 1px oklch(0 0 0 / 0.3), 0 6px 12px oklch(0 0 0 / 0.6)', surface: 'oklch(0.2 0.005 260)' },
  {
    name: 'A lighter surface',
    verdict: 'good',
    shadow: '0 0 0 1px oklch(1 0 0 / 0.09), 0 6px 12px oklch(0 0 0 / 0.4)',
    surface: 'oklch(0.27 0.006 260)',
  },
  { name: 'A glow', verdict: 'bad', shadow: '0 0 24px oklch(1 0 0 / 0.18)', surface: 'oklch(0.2 0.005 260)' },
];

/** In the dark, depth is lightness: the same lift four ways, side by side on one dark desk. */
export function ShadowDesks() {
  return (
    <Frame label="One step up, in dark mode" height={0} defaultTheme="dark">
      <div className={s.desks}>
        {WAYS.map((w) => (
          <figure key={w.name} className={s.way}>
            <Lifted shadow={w.shadow} surface={w.surface} />
            <figcaption data-verdict={w.verdict}>{w.name}</figcaption>
          </figure>
        ))}
      </div>
    </Frame>
  );
}
