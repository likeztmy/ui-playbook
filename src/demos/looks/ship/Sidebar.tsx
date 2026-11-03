import { ChartColumn, Globe, Layers, LayoutGrid, Package, Settings, SquareDashed, type LucideIcon } from 'lucide-react';
import { useId } from 'react';
import { at, count, PLATFORMS, samePlace, type Place } from './model';
import { useNav } from './nav';
import { PlaceLink } from './PlaceLink';
import s from './Shell.module.scss';

type Row = { to: Place; label: string; Icon?: LucideIcon; count?: number };
type Group = { heading?: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    rows: [
      { to: at('dashboard'), label: 'Dashboard', Icon: ChartColumn },
      { to: at('releases'), label: 'Releases', Icon: Package, count: count('any') },
      { to: at('settings'), label: 'Settings', Icon: Settings },
    ],
  },
  { heading: 'Platforms', rows: PLATFORMS.map((p) => ({ to: at('releases', { platform: p }), label: p, count: count(p) })) },
  // Screens held still to show the rest of a look: every part at once, the floating layers, the
  // states a list goes through, and Ship's own website.
  {
    heading: 'Specimens',
    rows: [
      { to: at('components'), label: 'Components', Icon: LayoutGrid },
      { to: at('overlays'), label: 'Overlays', Icon: Layers },
      { to: at('states'), label: 'States', Icon: SquareDashed },
      { to: at('marketing'), label: 'Website', Icon: Globe },
    ],
  },
];

const key = (p: Place) => `${p.page}:${p.platform}`;

/** Ship's places. The open one is lit; an open release lights the list it came from. */
export function Sidebar() {
  const { current } = useNav();
  const id = useId();
  const mark = (to: Place) => {
    if (samePlace(to, current)) return 'page';
    if (current.page === 'release' && to.page === 'releases' && to.platform === 'any') return 'true';
    return undefined;
  };
  return (
    <nav className={s.sidebar} aria-label="Ship">
      <div className={s.scroll}>
        <span className={s.name}>Ship</span>
        {GROUPS.map((g, i) => (
          <div key={g.heading ?? i} className={s.group}>
            {g.heading && (
              <p className={s.heading} id={`${id}-${i}`}>
                {g.heading}
              </p>
            )}
            <ul className={s.list} aria-labelledby={g.heading ? `${id}-${i}` : undefined}>
              {g.rows.map(({ to, label, Icon, count: n }) => (
                <li key={key(to)}>
                  <PlaceLink className={s.item} to={to} aria-current={mark(to)}>
                    <span className={s.icon}>{Icon && <Icon size={16} aria-hidden />}</span>
                    <span className={s.label}>{label}</span>
                    {n !== undefined && <span className={s.count}>{n}</span>}
                  </PlaceLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={s.foot}>
        <span className={s.face} aria-hidden>
          MC
        </span>
        Mira Chen
      </div>
    </nav>
  );
}
