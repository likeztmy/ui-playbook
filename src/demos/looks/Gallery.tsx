import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Panel, type Values } from './Panel';
import { Wall } from './wall/Wall';
import s from './Gallery.module.scss';

export type GalleryLook = { id: string; name: string; href: string; values: Values; root: string };

type Theme = 'light' | 'dark';

const value = (l: GalleryLook, name: string, theme: Theme) => l.values.find(([n]) => n === name)![1][theme];

/** Every look on one page: pick one on the left, and the same wall of cards redraws in its values. */
export function LookGallery({ looks }: { looks: GalleryLook[] }) {
  const [id, setId] = useState(looks[0].id);
  const [theme, setTheme] = useState<Theme>('light');
  const [copied, setCopied] = useState(false);
  const look = looks.find((l) => l.id === id) ?? looks[0];

  // The address names the look, so a look's own page can link straight to it.
  // It opens in the page's own theme.
  useEffect(() => {
    const asked = new URLSearchParams(location.search).get('look');
    if (asked && looks.some((l) => l.id === asked)) setId(asked);
    const set = document.documentElement.dataset.theme;
    if (set === 'dark' || (set !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)) setTheme('dark');
  }, [looks]);
  const pick = (next: string) => {
    setId(next);
    setCopied(false);
    history.replaceState(null, '', `?look=${next}`);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(look.root);
    setCopied(true);
  };

  return (
    <div className={s.gallery}>
      <div className={s.rail}>
        <ul className={s.looks} aria-label="Looks">
          {looks.map((l) => (
            <li key={l.id}>
              <button type="button" className={s.look} aria-pressed={l.id === look.id} onClick={() => pick(l.id)}>
                <span className={s.name} style={{ fontFamily: value(l, 'font-sans', theme) }}>
                  {l.name}
                </span>
                <span className={s.swatches} aria-hidden>
                  {['bg', 'surface', 'accent'].map((n) => (
                    <span key={n} style={{ background: value(l, n, theme) }} />
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.stage}>
        <div className={s.bar}>
          <SegmentedControl
            label="Theme"
            value={theme}
            onValueChange={(v) => setTheme(v as Theme)}
            segments={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
          <span className={s.end}>
            <a href={look.href}>Values</a>
            <Button size="sm" onClick={copy}>
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Copied' : 'Copy :root'}
            </Button>
          </span>
        </div>
        <Panel values={look.values} theme={theme}>
          <Wall />
        </Panel>
      </div>
    </div>
  );
}
