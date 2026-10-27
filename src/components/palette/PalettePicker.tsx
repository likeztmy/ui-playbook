import { useEffect, useState, type CSSProperties } from 'react';
import { PALETTES, type PaletteId } from '../../tokens/palettes';
import { Button } from '../../ui/Button';
import { Menu } from '../../ui/Menu';
import { Tip } from '../../ui/Tooltip';
import s from './PalettePicker.module.scss';

// The tokens' own colours, drawn with no attribute.
const BASE = PALETTES[0].id;
// What a visitor sees until they pick one; Base.astro's boot script applies the same.
const SITE: PaletteId = 'blue';

function current(): PaletteId {
  const p = document.documentElement.dataset.palette;
  return PALETTES.some((x) => x.id === p) ? (p as PaletteId) : BASE;
}

/** Sets the page's colour system and remembers any choice but the site's own. */
function apply(id: PaletteId) {
  const html = document.documentElement;
  if (id === BASE) delete html.dataset.palette;
  else html.dataset.palette = id;
  try {
    if (id === SITE) localStorage.removeItem('palette');
    else localStorage.setItem('palette', id);
  } catch {}
}

/** A swatch in a palette's accent, in whichever theme the page shows. */
function Swatch({ light, dark }: { light: string | null; dark: string | null }) {
  return <span className={s.swatch} style={{ '--light': light, '--dark': dark } as CSSProperties} aria-hidden />;
}

/** Picks the colour system, from a choice menu by the theme toggle. Its button wears the current accent. */
export function PalettePicker({ lang = 'en' }: { lang?: 'en' | 'zh' }) {
  const [palette, setPalette] = useState<PaletteId>(SITE);
  useEffect(() => setPalette(current()), []);
  const label = lang === 'zh' ? '配色' : 'Palette';

  return (
    <Menu.Root>
      <Tip label={label} side="bottom">
        <Menu.Trigger
          render={
            <Button variant="ghost" icon aria-label={label}>
              <span className={s.current} aria-hidden />
            </Button>
          }
        />
      </Tip>
      <Menu.Popup align="end">
        <Menu.RadioGroup
          value={palette}
          onValueChange={(v) => {
            apply(v as PaletteId);
            setPalette(v as PaletteId);
          }}
        >
          {PALETTES.map((p) => (
            <Menu.RadioItem key={p.id} value={p.id} detail={<Swatch {...p.swatch} />}>
              {p.name}
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Popup>
    </Menu.Root>
  );
}
