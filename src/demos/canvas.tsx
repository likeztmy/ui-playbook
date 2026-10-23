import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut, type LucideIcon } from 'lucide-react';
import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Toolbar } from '../ui/Toolbar';
import { cx } from '../ui/cx';
import { EllipseIcon, PenIcon, PointerIcon, RectIcon, TextIcon } from '../ui/icons';
import { Frame } from './shell';
import s from './demos.module.scss';

export const TOOLS = [
  ['select', 'Select', <PointerIcon />, 'V'],
  ['rect', 'Rectangle', <RectIcon />, 'R'],
  ['ellipse', 'Ellipse', <EllipseIcon />, 'O'],
  ['text', 'Text', <TextIcon />, 'T'],
  ['pen', 'Pen', <PenIcon />, 'P'],
] as const;

type Tool = (typeof TOOLS)[number][0];
type Shape = { id: number; kind: Exclude<Tool, 'select'>; x: number; y: number };

const START: Shape[] = [
  { id: 1, kind: 'rect', x: 56, y: 56 },
  { id: 2, kind: 'ellipse', x: 196, y: 92 },
  { id: 3, kind: 'text', x: 64, y: 156 },
];

const VIEW: [string, LucideIcon, string[]][] = [
  ['Undo', Undo2, ['⌘', 'Z']],
  ['Redo', Redo2, ['⇧', '⌘', 'Z']],
  ['Zoom out', ZoomOut, ['⌘', '−']],
  ['Zoom in', ZoomIn, ['⌘', '+']],
  ['Fit to screen', Maximize, ['⇧', '1']],
];

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/**
 * A small canvas editor: draw with the tools, select and delete, undo,
 * zoom. Shared by the Toolbar and Tooltip pages.
 */
export function CanvasScene({ label = 'Canvas' }: { label?: string }) {
  const [tool, setTool] = useState<Tool>('select');
  const [past, setPast] = useState<Shape[][]>([]);
  const [future, setFuture] = useState<Shape[][]>([]);
  const [shapes, setShapes] = useState<Shape[]>(START);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const commit = (next: Shape[]) => {
    setPast((p) => [...p, shapes]);
    setFuture([]);
    setShapes(next);
  };
  const undo = () => {
    if (!past.length) return;
    setFuture((f) => [shapes, ...f]);
    setShapes(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
    setSelected(null);
  };
  const redo = () => {
    if (!future.length) return;
    setPast((p) => [...p, shapes]);
    setShapes(future[0]);
    setFuture((f) => f.slice(1));
  };
  const zoomBy = (d: number) => setZoom((z) => Math.min(2, Math.max(0.5, Math.round((z + d) * 4) / 4)));
  const run: Record<string, () => void> = {
    Undo: undo,
    Redo: redo,
    'Zoom out': () => zoomBy(-0.25),
    'Zoom in': () => zoomBy(0.25),
    'Fit to screen': () => setZoom(1),
  };

  const place = (e: MouseEvent<HTMLDivElement>) => {
    if (tool === 'select') return setSelected(null);
    const r = e.currentTarget.getBoundingClientRect();
    const shape = { id: Date.now(), kind: tool, x: (e.clientX - r.left) / zoom - 32, y: (e.clientY - r.top) / zoom - 20 };
    commit([...shapes, shape]);
    setSelected(shape.id);
    // As in Figma: one shape, then back to Select.
    setTool('select');
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const hit = TOOLS.find(([, , , key]) => key.toLowerCase() === e.key.toLowerCase());
    if (hit && !e.metaKey && !e.ctrlKey) return setTool(hit[0]);
    if ((e.key === 'Backspace' || e.key === 'Delete') && selected !== null) {
      commit(shapes.filter((sh) => sh.id !== selected));
      setSelected(null);
    }
  };

  return (
    <Frame label={label} height={0}>
      <div className={s.sketch}>
        <div
          className={s.sketchBoard}
          data-tool={tool}
          tabIndex={0}
          role="application"
          aria-label="Canvas"
          onClick={place}
          onKeyDown={onKey}
        >
          <div className={s.sketchLayer} style={{ scale: String(zoom) }}>
            {shapes.map((sh) => (
              <button
                key={sh.id}
                type="button"
                tabIndex={-1}
                aria-label={sh.kind}
                className={cx(s.sketchShape, s[`sketch_${sh.kind}`])}
                data-selected={sh.id === selected ? '' : undefined}
                style={{ left: sh.x, top: sh.y }}
                onClick={(e) => {
                  if (tool !== 'select') return;
                  e.stopPropagation();
                  setSelected(sh.id);
                }}
              >
                {sh.kind === 'text' && 'Heading'}
                {sh.kind === 'pen' && (
                  <svg viewBox="0 0 64 32" aria-hidden>
                    <path d="M4 24 C 16 4, 28 4, 32 16 S 52 30, 60 8" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
        <Toolbar.Root aria-label="View" className={s.sketchView}>
          {VIEW.slice(0, 2).map(([name, Icon, keys]) => (
            <Toolbar.Action key={name} label={name} keys={keys} onClick={run[name]} disabled={name === 'Undo' ? !past.length : !future.length}>
              <Icon {...ic} />
            </Toolbar.Action>
          ))}
          <Toolbar.Separator />
          {VIEW.slice(2).map(([name, Icon, keys]) => (
            <Toolbar.Action key={name} label={name} keys={keys} onClick={run[name]}>
              <Icon {...ic} />
            </Toolbar.Action>
          ))}
          <span className={s.sketchZoom}>{Math.round(zoom * 100)}%</span>
        </Toolbar.Root>
        <Toolbar.Root aria-label="Drawing" className={s.sketchTools}>
          <Toolbar.Tools value={[tool]} onValueChange={(v: string[]) => v.length && setTool(v[0] as Tool)} aria-label="Tools">
            {TOOLS.map(([value, name, icon, key]) => (
              <Toolbar.Tool key={value} value={value} label={name} keys={[key]}>
                {icon}
              </Toolbar.Tool>
            ))}
          </Toolbar.Tools>
          <Toolbar.Separator />
          <Toolbar.Action primary>Share</Toolbar.Action>
        </Toolbar.Root>
      </div>
    </Frame>
  );
}
