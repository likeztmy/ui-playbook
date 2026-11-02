import { BookOpen, Check, Copy, Ellipsis } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../../ui/Button';
import { Menu } from '../../../ui/Menu';
import { SegmentedControl } from '../../../ui/SegmentedControl';
import { Select } from '../../../ui/Select';
import { Panel } from '../../looks/Panel';
import { addressOf, pageTheme, params, placeParams, readPlace, usePopState, write, type Theme } from '../address';
import { lookOptions, type LabLook } from '../looks';
import { Ship } from '../ship/Ship';
import type { Nav } from '../ship/Shell';
import type { Place } from '../ship/model';
import s from './Workbench.module.scss';

/**
 * Direction A: the gallery is a window. One toolbar picks the look and the theme; Ship fills the rest as
 * the app it is, and its own sidebar is how its pages are reached. Only Ship's panes scroll.
 */
export function Workbench({ looks, path }: { looks: LabLook[]; path: string }) {
  const [id, setId] = useState(looks[0].id);
  const [place, setPlace] = useState<Place>({ page: 'dashboard', platform: 'any' });
  const [theme, setTheme] = useState<Theme>('light');
  const [copied, setCopied] = useState(false);
  const look = looks.find((l) => l.id === id) ?? looks[0];

  const read = useCallback(
    (q: URLSearchParams) => {
      const asked = q.get('look');
      if (asked && looks.some((l) => l.id === asked)) setId(asked);
      setPlace(readPlace(q));
    },
    [looks],
  );
  useEffect(() => {
    read(params());
    setTheme(pageTheme());
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
          <Button size="sm" onClick={copy}>
            {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            {copied ? 'Copied' : 'Copy :root'}
          </Button>
        </span>
        {/* Narrow: the tool's own chrome folds into one menu (decision C33). */}
        <Menu.Root>
          <Menu.Trigger render={<Button variant="ghost" icon label="More" className={s.more} />}>
            <Ellipsis size={16} aria-hidden />
          </Menu.Trigger>
          <Menu.Popup align="end">
            <Menu.Item icon={BookOpen} render={<a href={look.href} />}>
              Values and sources
            </Menu.Item>
            <Menu.Item icon={copied ? Check : Copy} onClick={copy}>
              {copied ? 'Copied' : 'Copy :root'}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      </div>
      <div className={s.stage}>
        <Panel values={look.values} theme={theme}>
          <Ship nav={nav} fit="window" />
        </Panel>
      </div>
    </div>
  );
}
