import { Drawer } from '@base-ui/react/drawer';
import { createContext, useContext, useEffect, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cx } from './cx';
import s from './Sheet.module.scss';

type SnapPoint = number | string;

/**
 * - `standard`: what's behind stays in use while the sheet leaves it in sight. Once the sheet is at
 *   its tallest and covers it, it blocks like a modal one: dimmed and inert behind.
 * - `modal`: blocks at every height; a press outside closes it.
 */
type Kind = 'standard' | 'modal';

type Ctx = {
  kind: Kind;
  covering: boolean;
  container: HTMLElement | null;
  setContainer: (el: HTMLElement | null) => void;
  /** A press on the dim: a standard sheet goes back down a height, a modal one closes. */
  pressDim: () => void;
  /** Scrolling the content raises the sheet first, if `scrollGrows`. */
  raise?: () => void;
  /** The grabber's press: up a height, or from the top back to the lowest. */
  cycle: () => void;
  /** A press on the header of a sheet below its top, e.g. one lowered to a bar: up a height. */
  expand?: () => void;
  /** Open from the start: it's simply there, with no rise. */
  instant: boolean;
};

const SheetContext = createContext<Ctx | null>(null);
const useSheet = () => useContext(SheetContext)!;

type RootProps = {
  open: boolean;
  onOpenChange: (open: boolean, reason: string) => void;
  kind?: Kind;
  /** Heights, shortest first: fractions of the area, or `px`. 1 is full height, which covers the area. */
  snapPoints: SnapPoint[];
  snapPoint?: SnapPoint | null;
  onSnapPointChange?: (p: SnapPoint | null) => void;
  /**
   * Scrolling the content raises the sheet a height before it scrolls, as Apple's sheets do by
   * default. Off by default: in a standard sheet it covers what the person is using, and Apple
   * advises turning it off there (`prefersScrollingExpandsWhenScrolledToEdge`).
   */
  scrollGrows?: boolean;
  children: ReactNode;
};

/**
 * A sheet over an area of the screen, from its bottom edge. It blocks exactly when it covers: Apple
 * dims a sheet only from a chosen height up (`largestUndimmedDetentIdentifier`), and Material's
 * standard sheet coexists with the screen behind it. Built on Base UI's Drawer, with modality kept
 * inside the area rather than the document, so a sheet in a demo never locks the page.
 */
function Root({ open, onOpenChange, kind = 'standard', snapPoints, snapPoint, onSnapPointChange, scrollGrows, children }: RootProps) {
  const [own, setOwn] = useState<SnapPoint | null>(snapPoints[0]);
  const point = snapPoint === undefined ? own : snapPoint;
  const setPoint = (p: SnapPoint | null) => (onSnapPointChange ? onSnapPointChange(p) : setOwn(p));
  const [container, setContainer] = useState<HTMLElement | null>(null);
  // A sheet open when the screen arrives is part of it, not something that just happened.
  const [instant, setInstant] = useState(open);
  useEffect(() => {
    if (!instant || !container) return;
    const t = setTimeout(() => setInstant(false), 100);
    return () => clearTimeout(t);
  }, [instant, container]);
  // Full height is 1: a standard sheet that stops short of it never covers what's behind.
  const covering = open && (kind === 'modal' || point === 1);
  const at = snapPoints.indexOf(point ?? snapPoints[0]);
  const below = snapPoints[Math.max(0, at - 1)];
  const above = at < snapPoints.length - 1 ? snapPoints[at + 1] : null;

  return (
    <SheetContext.Provider
      value={{
        kind,
        covering,
        container,
        setContainer,
        pressDim: () => (kind === 'standard' ? setPoint(below) : onOpenChange(false, 'outside-press')),
        raise: scrollGrows && above !== null ? () => setPoint(above) : undefined,
        cycle: () => setPoint(above ?? snapPoints[0]),
        expand: above !== null ? () => setPoint(above) : undefined,
        instant,
      }}
    >
      <Drawer.Root
        open={open}
        onOpenChange={(o, details) => {
          // Escape is the area's when focus is in it: Base UI hears it anywhere on the page.
          const area = container?.parentElement;
          if (details.reason === 'escape-key' && !area?.contains(document.activeElement)) return;
          onOpenChange(o, details.reason);
        }}
        // Never Base UI's modal, which makes the whole document inert and pulls it to the sheet: the
        // area's own dim and `inert` block what the sheet covers, and nothing else.
        modal={false}
        // Presses outside are the area's to judge, on its dim: Base UI's would count a press anywhere on
        // the page, and close a sheet in one demo for a press in another.
        disablePointerDismissal
        snapPoints={snapPoints}
        snapPoint={point}
        onSnapPointChange={setPoint}
      >
        {children}
      </Drawer.Root>
    </SheetContext.Provider>
  );
}

/** The part of the screen a sheet rises over. What's in it is what the sheet blocks when it covers it. */
function Area({ children, className }: { children: ReactNode; className?: string }) {
  const { covering, setContainer, pressDim } = useSheet();
  return (
    <div className={cx(s.area, className)}>
      <div className={s.behind} inert={covering}>
        {children}
      </div>
      <div className={s.dim} data-on={covering ? '' : undefined} onClick={pressDim} aria-hidden />
      <div ref={setContainer} className={s.layer} />
    </div>
  );
}

type PopupProps = Pick<ComponentProps<typeof Drawer.Popup>, 'initialFocus' | 'finalFocus'> & {
  title: ReactNode;
  /** Shown beside the title, e.g. a Close button. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** The content fills the sheet edge to edge and scrolls itself, e.g. a composer with its own footer. */
  fill?: boolean;
};

function Popup({ title, actions, children, className, fill, ...focus }: PopupProps) {
  const { kind, container, covering, raise, cycle, expand, instant } = useSheet();
  const header = useRef<HTMLDivElement>(null);
  const grabber = useRef<HTMLDivElement>(null);
  // Base UI captures the pointer for a drag, so a press on the grabber or the header arrives at the
  // popup: judged by where it landed. Buttons in the header keep their own presses.
  const onClick = (e: MouseEvent) => {
    const inside = (el: HTMLElement | null) => {
      const r = el?.getBoundingClientRect();
      return !!r && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    if ((e.target as Element).closest('button, a, input')) return;
    if (inside(grabber.current)) cycle();
    else if (inside(header.current)) expand?.();
  };
  // Until the area is in, there's nowhere to put it: Base UI would fall back to <body>.
  if (!container) return null;
  return (
    <Drawer.Portal container={container}>
      <Drawer.Viewport className={s.viewport}>
        <Drawer.Popup {...focus} className={cx(s.popup, className)} data-covering={covering ? '' : undefined} data-instant={instant ? '' : undefined} onClick={onClick}>
          {/* Pressing it cycles the heights, Apple's and Material's single-pointer way to resize. */}
          {/* Not a <button>: Base UI starts no drag on one, and the grabber is where a drag starts. */}
          <div
            ref={grabber}
            role="button"
            tabIndex={0}
            className={s.handle}
            aria-label="Change height"
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              cycle();
            }}
          />
          <div ref={header} className={s.header}>
            <Drawer.Title className={s.title}>{title}</Drawer.Title>
            {actions}
          </div>
          <Drawer.Content
            className={cx(s.content, fill && s.fill)}
            // In a standard sheet a drag on the content scrolls it; the grabber and header move the sheet.
            data-base-ui-swipe-ignore={kind === 'standard' && !raise ? '' : undefined}
            onWheel={(e) => e.deltaY > 0 && raise?.()}
          >
            {children}
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
}

export const Sheet = { Root, Area, Popup, Close: Drawer.Close };
