import { ChevronRight, Ellipsis } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { Menu, menuClasses as ms } from '../ui/Menu';
import { Switch } from '../ui/Switch';
import { Tip } from '../ui/Tooltip';
import { Compare } from './shell';
import s from './demos.module.scss';

// ── Submenus: the safe triangle ──────────────────────────

const ROWS = ['Open', 'Move to', 'Share…', 'Copy link', 'Duplicate', 'Delete'];
const FOLDERS = ['Inbox', 'Projects', 'Clients', 'Archive'];

type Pt = { x: number; y: number };

/** Is p inside the triangle abc? Signs of the three cross products agree. */
function inTriangle(p: Pt, a: Pt, b: Pt, c: Pt) {
  const cross = (o: Pt, u: Pt, v: Pt) => (u.x - o.x) * (v.y - o.y) - (u.y - o.y) * (v.x - o.x);
  const d1 = cross(p, a, b);
  const d2 = cross(p, b, c);
  const d3 = cross(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

/**
 * A menu whose "Move to" row opens a submenu on hover. With `aim`, leaving
 * the row toward the submenu keeps it open: the pointer is judged by where
 * it's heading (the triangle from where it left to the submenu's near edge),
 * not by the row it happens to cross. The keys follow a menu's: arrows move,
 * Right or Enter opens the submenu, Left or Escape comes back.
 */
function SubmenuDemo({ aim }: { aim?: boolean }) {
  const [hot, setHot] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [moved, setMoved] = useState<string | null>(null);
  const [showArea, setShowArea] = useState(false);
  const [apex, setApex] = useState<Pt | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const sub = useRef<HTMLDivElement>(null);
  const lastInMove = useRef<Pt | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [subHot, setSubHot] = useState<string | null>(null);
  // Set when a key opened the submenu, so its first row takes focus once it's there.
  const [subFocus, setSubFocus] = useState(false);

  const rowEl = (r: string) => root.current?.querySelector<HTMLElement>(`[data-row="${r}"]`);
  const subEl = (f: string) => sub.current?.querySelector<HTMLElement>(`[data-folder="${f}"]`);

  const local = (e: React.MouseEvent): Pt => {
    const r = root.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const edge = () => {
    const r = root.current!.getBoundingClientRect();
    const b = sub.current!.getBoundingClientRect();
    return [
      { x: b.left - r.left, y: b.top - r.top },
      { x: b.left - r.left, y: b.bottom - r.top },
    ] as const;
  };
  const heading = (p: Pt) => {
    if (!aim || !open || !lastInMove.current || !sub.current) return false;
    const [top, bottom] = edge();
    return inTriangle(p, lastInMove.current, top, bottom);
  };
  const go = (row: string) => {
    clearTimeout(timer.current);
    // Focus in a submenu that's closing goes to the row the pointer is on.
    if (row !== 'Move to' && sub.current?.contains(document.activeElement)) rowEl(row)?.focus();
    setHot(row);
    setOpen(row === 'Move to');
  };

  const onRowMove = (row: string, e: React.MouseEvent) => {
    const p = local(e);
    if (row === 'Move to') {
      lastInMove.current = p;
      setApex(p);
      go(row);
      return;
    }
    if (heading(p)) {
      // On its way to the submenu: hold, and give it a moment to arrive.
      clearTimeout(timer.current);
      timer.current = setTimeout(() => go(row), 300);
      return;
    }
    if (hot !== row) go(row);
  };

  useEffect(() => {
    if (open && subFocus) {
      subEl(FOLDERS[0])?.focus();
      setSubFocus(false);
    }
  }, [open, subFocus]);

  const step = <T,>(list: T[], at: T | null, by: number) => list[(list.indexOf(at as T) + by + list.length) % list.length];

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const r = step(ROWS, hot, e.key === 'ArrowDown' ? 1 : -1);
      setHot(r);
      setOpen(false);
      rowEl(r)?.focus();
    } else if (hot === 'Move to' && (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      setSubHot(FOLDERS[0]);
      setSubFocus(true);
    }
  };

  const onSubKey = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const f = step(FOLDERS, subHot, e.key === 'ArrowDown' ? 1 : -1);
      setSubHot(f);
      subEl(f)?.focus();
    } else if ((e.key === 'Enter' || e.key === ' ') && subHot) {
      e.preventDefault();
      setMoved(subHot);
    } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      rowEl('Move to')?.focus();
    }
  };

  const [top, bottom] = open && aim && showArea && sub.current && root.current ? edge() : [null, null];
  const area =
    apex && top && bottom
      ? ({ clipPath: `polygon(${apex.x}px ${apex.y}px, ${top.x}px ${top.y}px, ${bottom.x}px ${bottom.y}px)` } as CSSProperties)
      : undefined;

  return (
    <div className={s.aimDemo}>
      <div
        ref={root}
        className={s.aimStage}
        onMouseLeave={() => {
          clearTimeout(timer.current);
          // While the keyboard is in the menu, the pointer leaving changes nothing.
          if (root.current?.contains(document.activeElement)) return;
          setHot(null);
          setOpen(false);
        }}
      >
        <div className={cx(ms.popup, s.aimMenu)} role="menu" aria-label="File" onKeyDown={onMenuKey}>
          {ROWS.map((r, i) => (
            <Fragment key={r}>
              {/* Delete in a group of its own, last. */}
              {r === 'Delete' && <div className={ms.separator} role="separator" />}
              <div
                className={cx(ms.item, r === 'Delete' && ms.danger)}
                role="menuitem"
                data-row={r}
                tabIndex={hot === r || (!hot && i === 0) ? 0 : -1}
                aria-haspopup={r === 'Move to' ? 'menu' : undefined}
                aria-expanded={r === 'Move to' ? open : undefined}
                data-highlighted={hot === r ? '' : undefined}
                onFocus={() => setHot(r)}
                onMouseMove={(e) => onRowMove(r, e)}
              >
                <span className={ms.text}>{r}</span>
                {r === 'Move to' && <ChevronRight className={ms.chevron} size={16} aria-hidden />}
              </div>
            </Fragment>
          ))}
        </div>
        {open && (
          <div
            ref={sub}
            className={cx(ms.popup, ms.subPopup, s.aimSub)}
            role="menu"
            aria-label="Move to"
            onKeyDown={onSubKey}
            onMouseEnter={() => {
              clearTimeout(timer.current);
              setHot('Move to');
            }}
          >
            {FOLDERS.map((f) => (
              <div
                key={f}
                className={ms.item}
                role="menuitem"
                data-folder={f}
                tabIndex={-1}
                data-highlighted={subHot === f ? '' : undefined}
                onClick={() => setMoved(f)}
                onFocus={() => setSubHot(f)}
                onMouseEnter={() => setSubHot(f)}
                onMouseLeave={() => setSubHot(null)}
              >
                <span className={ms.text}>{f}</span>
              </div>
            ))}
          </div>
        )}
        {area && <div className={s.aimArea} style={area} aria-hidden />}
      </div>
      <div className={s.aimFoot}>
        <span className={s.aimStatus} aria-live="polite">
          {moved ? `Moved to ${moved}` : ' '}
        </span>
        {aim && <Switch label="Show the safe area" checked={showArea} onCheckedChange={setShowArea} />}
      </div>
    </div>
  );
}

export function HoverSubmenu() {
  return (
    <Compare
      stacked
      beforeLabel="Closes on any row crossed"
      afterLabel="Holds while heading to it"
      height={0}
      before={<SubmenuDemo />}
      after={<SubmenuDemo aim />}
      beforeNote="A straight line from Move to toward Archive crosses Share… and Copy link, and the submenu closes on the first of them. The only way through is a tunnel: right, then down."
      afterNote={
        <>
          While the pointer stays inside the triangle from where it left the row to the submenu’s near edge, the submenu holds. Ben Kamens made it
          famous in <a href="https://github.com/kamens/jQuery-menu-aim">jQuery-menu-aim</a>, after Amazon; menus built on Floating UI get it as{' '}
          <a href="https://floating-ui.com/docs/useHover">safePolygon</a>.
        </>
      }
    />
  );
}

// ── Actions that appear on hover ─────────────────────────

// What each file's first page says, for its thumbnail.
const PAGES: Record<string, string[]> = {
  'Q4 roadmap': ['Ship the new checkout', 'Search across the catalogue', 'Offline cart on iOS', 'Retire the old payments flow'],
  'Brand guide': ['Logo and clear space', 'Colour', 'Type', 'Photography'],
};

/** A file card whose More button appears on hover. `owner` is what owns the hover. */
function FileTile({ name, owner }: { name: string; owner: 'content' | 'card' }) {
  const [hover, setHover] = useState(false);
  const [menu, setMenu] = useState(false);
  const shown = hover || menu;
  const watch = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
  const label = `More actions for ${name}`;
  return (
    <div className={s.tile} {...(owner === 'card' ? watch : {})}>
      <div className={s.tileContent} {...(owner === 'content' ? watch : {})}>
        {/* The file's first page, scaled down: a picture of it, not text to read. */}
        <span className={s.tileThumb} aria-hidden>
          <span className={s.tilePage}>
            <span className={s.tilePageTitle}>{name}</span>
            {PAGES[name].map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        </span>
        <span className={s.tileName}>{name}</span>
      </div>
      <Menu.Root onOpenChange={setMenu}>
        <Tip label={label}>
          <Menu.Trigger
            render={
              <Button
                variant="ghost"
                size="sm"
                icon
                aria-label={label}
                className={s.tileMore}
                data-shown={shown ? '' : undefined}
                data-quiet={owner === 'card' ? '' : undefined}
              >
                <Ellipsis size={16} aria-hidden />
              </Button>
            }
          />
        </Tip>
        <Menu.Popup align="end">
          <Menu.Item>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item danger>Delete</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </div>
  );
}

function Tiles({ owner }: { owner: 'content' | 'card' }) {
  return (
    <div className={s.tiles}>
      <FileTile name="Q4 roadmap" owner={owner} />
      <FileTile name="Brand guide" owner={owner} />
    </div>
  );
}

export function HoverReveal() {
  return (
    <Compare
      stacked
      beforeLabel="Content owns the hover"
      afterLabel="Whole card owns the hover"
      height={0}
      before={<Tiles owner="content" />}
      after={<Tiles owner="card" />}
      beforeNote="The hover belongs to the thumbnail and name, but the button sits in the card’s corner, outside them. On the way to it the pointer leaves the content, and the button goes."
      afterNote="The whole card owns the hover, button included, so the path to it never leaves; it stays while its menu is open or it has focus. At rest it’s quiet, not gone, so people know it’s there."
    />
  );
}

/** The menu, its submenu and the safe area, held still. */
export function HoverPreview() {
  return (
    <div className={s.aimStage} aria-hidden>
      <div className={cx(ms.popup, s.aimMenu)}>
        {ROWS.slice(0, 4).map((r) => (
          <div key={r} className={ms.item} data-highlighted={r === 'Move to' ? '' : undefined}>
            <span className={ms.text}>{r}</span>
            {r === 'Move to' && <ChevronRight className={ms.chevron} size={16} />}
          </div>
        ))}
      </div>
      <div className={cx(ms.popup, ms.subPopup, s.aimSub)}>
        {FOLDERS.map((f) => (
          <div key={f} className={ms.item}>
            <span className={ms.text}>{f}</span>
          </div>
        ))}
      </div>
      <div className={s.aimArea} style={{ clipPath: 'polygon(110px 52px, 156px 32px, 156px 168px)' }} />
    </div>
  );
}
