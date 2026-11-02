import { ChevronRight, Ellipsis } from 'lucide-react';
import { Fragment, useRef, useState, type CSSProperties } from 'react';
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
 * not by the row it happens to cross.
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
          setHot(null);
          setOpen(false);
        }}
      >
        <div className={cx(ms.popup, s.aimMenu)} role="presentation">
          {ROWS.map((r) => (
            <Fragment key={r}>
              {/* Delete in a group of its own, last. */}
              {r === 'Delete' && <div className={ms.separator} />}
              <div
                className={cx(ms.item, r === 'Delete' && ms.danger)}
                data-highlighted={hot === r ? '' : undefined}
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
            role="presentation"
            onMouseEnter={() => {
              clearTimeout(timer.current);
              setHot('Move to');
            }}
          >
            {FOLDERS.map((f) => (
              <div
                key={f}
                className={ms.item}
                onClick={() => setMoved(f)}
                onMouseEnter={(e) => e.currentTarget.setAttribute('data-highlighted', '')}
                onMouseLeave={(e) => e.currentTarget.removeAttribute('data-highlighted')}
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
