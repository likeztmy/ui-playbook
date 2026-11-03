import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Select } from '../../ui/Select';
import { addressOf, pageTheme, params, placeParams, readPlace, usePopState, write, type Theme } from './address';
import { lookOptions, type GalleryLook } from './looks';
import { Panel } from './Panel';
import { HOME, type Place } from './ship/model';
import { NavContext, type Nav } from './ship/nav';
import { Ship } from './ship/Ship';
import s from './Gallery.module.scss';

/**
 * The gallery is a window. One toolbar picks the look and the theme; Ship fills the rest as the app it
 * is, and its own sidebar is how its pages are reached. Only Ship's panes scroll.
 */
export function Gallery({ looks, path }: { looks: GalleryLook[]; path: string }) {
  const [id, setId] = useState(looks[0].id);
  const [place, setPlace] = useState<Place>(HOME);
  const [theme, setTheme] = useState<Theme>('light');
  const [copied, setCopied] = useState(false);
  // The server can't see the address. Ship waits for it, so a link to one look and page doesn't
  // open on the first look's dashboard and fade across.
  const [ready, setReady] = useState(false);
  const look = looks.find((l) => l.id === id) ?? looks[0];

  const read = useCallback(
    (q: URLSearchParams) => {
      const asked = q.get('look');
      setId(asked && looks.some((l) => l.id === asked) ? asked : looks[0].id);
      setPlace(readPlace(q));
    },
    [looks],
  );
  // The address names the look and the place, so a look's own page can link straight to it.
  // It opens in the page's own theme.
  useEffect(() => {
    read(params());
    setTheme(pageTheme());
    setReady(true);
  }, [read]);
  usePopState(read);

  const at = (lookId: string, to: Place) => addressOf(path, { look: lookId === looks[0].id ? null : lookId, ...placeParams(to) });
  const nav: Nav = {
    current: place,
    href: (to) => at(id, to),
    go: (to) => {
      setPlace(to);
      write(at(id, to), true);
    },
  };
  const pick = (next: string | null) => {
    if (!next) return;
    setId(next);
    setCopied(false);
    write(at(next, place), false);
  };
  const copy = async () => {
    await navigator.clipboard.writeText(look.root);
    setCopied(true);
  };
  // "Copied" is true only for a moment: after that the clipboard may hold anything.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className={s.window}>
      <div className={s.toolbar}>
        <h1 className={s.title}>Looks</h1>
        <Select label="Look" className={s.bare} value={id} onValueChange={pick} options={lookOptions(looks)} />
        <SegmentedControl
          label="Theme"
          value={theme}
          onValueChange={setTheme}
          segments={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <span className={s.end}>
          <a className={s.link} href={look.href}>
            Values and sources
          </a>
          {/* Both labels share one cell, so the button keeps the wider one's width and nothing beside it moves. */}
          <Button onClick={copy}>
            <span className={s.swap}>
              <span data-hidden={copied ? '' : undefined}>
                <Copy size={16} aria-hidden /> Copy :root
              </span>
              <span data-hidden={copied ? undefined : ''}>
                <Check size={16} aria-hidden /> Copied
              </span>
            </span>
          </Button>
        </span>
      </div>
      <div className={s.stage}>
        {ready && (
          <Panel values={look.values} theme={theme}>
            <NavContext.Provider value={nav}>
              <Ship />
            </NavContext.Provider>
          </Panel>
        )}
      </div>
    </div>
  );
}
