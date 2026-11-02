import { Ellipsis, GripVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
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
import s from './Compare.module.scss';

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Direction C: two looks on one Ship. The same screen is drawn twice in one place; a divider you drag
 * shows the left look on one side and the right look on the other. Both Ships go where either goes,
 * and their pages scroll together.
 */
export function Compare({ looks, path }: { looks: LabLook[]; path: string }) {
  const first = looks[0].id;
  const last = looks[looks.length - 1].id;
  const [left, setLeft] = useState(first);
  const [right, setRight] = useState(last);
  const [place, setPlace] = useState<Place>({ page: 'dashboard', platform: 'any' });
  const [theme, setTheme] = useState<Theme>('light');
  const [split, setSplit] = useState(50);
  const stage = useRef<HTMLDivElement>(null);
  const lookOf = (id: string) => looks.find((l) => l.id === id) ?? looks[0];

  const read = useCallback(
    (q: URLSearchParams) => {
      const has = (id: string | null) => !!id && looks.some((l) => l.id === id);
      setLeft(has(q.get('left')) ? q.get('left')! : first);
      setRight(has(q.get('right')) ? q.get('right')! : last);
      setPlace(readPlace(q));
    },
    [looks, first, last],
  );
  useEffect(() => {
    read(params());
    setTheme(pageTheme());
  }, [read]);
  usePopState(read);

  const at = (l: string, r: string, to: Place) => addressOf(path, { left: l === first ? null : l, right: r === last ? null : r, ...placeParams(to) });
  const nav: Nav = {
    current: place,
    href: (to) => at(left, right, to),
    go: (to) => {
      setPlace(to);
      write(at(left, right, to), true);
    },
  };

  // Scrolling either page scrolls the other to the same share of its length: the looks set rows and
  // text at different sizes, so the same pixel offset would show different rows.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let syncing = false;
    const onScroll = (e: Event) => {
      const from = e.target as HTMLElement;
      if (syncing || !(from instanceof HTMLElement) || !from.hasAttribute('data-pane')) return;
      const share = from.scrollTop / Math.max(1, from.scrollHeight - from.clientHeight);
      syncing = true;
      for (const to of el.querySelectorAll<HTMLElement>('[data-pane]')) {
        if (to !== from) to.scrollTop = share * (to.scrollHeight - to.clientHeight);
      }
      requestAnimationFrame(() => (syncing = false));
    };
    el.addEventListener('scroll', onScroll, true);
    return () => el.removeEventListener('scroll', onScroll, true);
  }, []);

  const drag = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const box = stage.current!.getBoundingClientRect();
    setSplit(clamp(((e.clientX - box.left) / box.width) * 100));
  };
  const keys = (e: KeyboardEvent) => {
    const step = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    setSplit((v) => clamp(v + step));
  };

  const theming = (
    <SegmentedControl
      label="Theme"
      value={theme}
      onValueChange={setTheme}
      segments={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
    />
  );

  return (
    <div className={s.window}>
      <h1 className={s.hidden}>Compare looks</h1>
      <div className={s.toolbar}>
        <Select
          label="Left look"
          className={s.picker}
          value={left}
          onValueChange={(v) => {
            if (!v) return;
            setLeft(v);
            write(at(v, right, place), false);
          }}
          options={lookOptions(looks)}
        />
        <span className={s.theme}>{theming}</span>
        <Select
          label="Right look"
          className={s.picker}
          value={right}
          onValueChange={(v) => {
            if (!v) return;
            setRight(v);
            write(at(left, v, place), false);
          }}
          options={lookOptions(looks)}
        />
        {/* Narrow: the theme folds into a menu, so the two looks keep the row. */}
        <Menu.Root>
          <Menu.Trigger render={<Button variant="ghost" icon label="More" className={s.more} />}>
            <Ellipsis size={16} aria-hidden />
          </Menu.Trigger>
          <Menu.Popup align="end">
            <Menu.Group>
              <Menu.Label>Theme</Menu.Label>
              <Menu.RadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
                <Menu.RadioItem value="light">Light</Menu.RadioItem>
                <Menu.RadioItem value="dark">Dark</Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Root>
      </div>
      <div ref={stage} className={s.stage}>
        <div className={s.layer}>
          <Panel values={lookOf(left).values} theme={theme}>
            <Ship nav={nav} fit="window" />
          </Panel>
        </div>
        <div className={s.layer} style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
          <Panel values={lookOf(right).values} theme={theme}>
            <Ship nav={nav} fit="window" />
          </Panel>
        </div>
        <div
          className={s.divider}
          style={{ left: `${split}%` }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Divide the looks"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          tabIndex={0}
          onKeyDown={keys}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag(e);
          }}
          onPointerMove={drag}
        >
          <span className={s.grip}>
            <GripVertical size={16} aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}
