import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Checkbox } from './Checkbox';
import { cx } from './cx';
import s from './Table.module.scss';

export { s as tableClasses };

export type Column<R> = {
  key: string;
  header: string;
  /** Right-aligned in tabular figures: sizes, counts, money. */
  numeric?: boolean;
  /** Secondary information, in ink-muted: owners, dates. */
  muted?: boolean;
  /** The value to sort by; makes the header a sort button. */
  sortBy?: (row: R) => string | number;
  render: (row: R) => ReactNode;
  width?: number;
};

export type Sort = { key: string; dir: 'asc' | 'desc' };

type TableProps<R> = {
  /** Names the table for assistive tech. */
  label: string;
  columns: Column<R>[];
  rows: R[];
  rowKey: (row: R) => string;
  /** Selected row keys; adds a checkbox column. */
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  sort?: Sort;
  onSortChange?: (sort: Sort) => void;
  /** Pin the first column (and the checkbox) while the rest scroll sideways. */
  stickyFirst?: boolean;
  /** Scrolls the rows under a sticky header past this height. */
  maxHeight?: number;
  /** Holds a row state still for display: key → "hover". */
  pin?: Record<string, string>;
  className?: string;
};

/** Rows to compare and act on in bulk. */
export function Table<R>({
  label,
  columns,
  rows,
  rowKey,
  selected,
  onSelectedChange,
  sort,
  onSortChange,
  stickyFirst,
  maxHeight,
  pin,
  className,
}: TableProps<R>) {
  const selectable = selected !== undefined;
  const keys = rows.map(rowKey);
  const all = selectable && keys.length > 0 && keys.every((k) => selected.includes(k));
  const some = selectable && !all && keys.some((k) => selected.includes(k));

  const sorted = (() => {
    const col = sort && columns.find((c) => c.key === sort.key);
    if (!col?.sortBy) return rows;
    const by = col.sortBy;
    const out = [...rows].sort((a, b) => {
      const [x, y] = [by(a), by(b)];
      return typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
    });
    return sort?.dir === 'desc' ? out.reverse() : out;
  })();

  const wrap = useRef<HTMLDivElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setScrolls(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const toggle = (k: string, on: boolean) => onSelectedChange?.(on ? [...selected!, k] : selected!.filter((x) => x !== k));

  return (
    <div
      ref={wrap}
      className={cx(s.wrap, className)}
      style={maxHeight ? ({ maxHeight } as CSSProperties) : undefined}
      // While it scrolls, the keyboard can scroll it too: a Tab stop, named as the table is.
      tabIndex={scrolls ? 0 : undefined}
      role={scrolls ? 'region' : undefined}
      aria-label={scrolls ? label : undefined}
    >
      <table aria-label={label} className={cx(s.table, stickyFirst && s.stickyFirst, stickyFirst && selectable && s.hasCheck)}>
        <thead>
          <tr>
            {selectable && (
              <th className={s.check}>
                <Checkbox
                  aria-label="Select all rows"
                  checked={all}
                  indeterminate={some}
                  // Mixed turns everything on, as on the Checkbox page; all on turns it off.
                  onCheckedChange={() => onSelectedChange?.(all ? [] : keys)}
                />
              </th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : c.sortBy ? 'none' : undefined;
              const Arrow = active && sort.dir === 'desc' ? ArrowDown : ArrowUp;
              return (
                <th key={c.key} scope="col" aria-sort={ariaSort} className={cx(c.numeric && s.num)} style={c.width ? { width: c.width } : undefined}>
                  {c.sortBy ? (
                    <button
                      type="button"
                      className={s.sort}
                      data-sorted={active || undefined}
                      onClick={() => onSortChange?.({ key: c.key, dir: active && sort.dir === 'asc' ? 'desc' : 'asc' })}
                    >
                      {c.header}
                      <Arrow size={12} strokeWidth={1.75} nonScalingStroke aria-hidden />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const k = rowKey(r);
            const on = selectable && selected.includes(k);
            return (
              <tr key={k} aria-selected={selectable ? on : undefined} data-pin={pin?.[k]}>
                {selectable && (
                  <td className={s.check}>
                    <Checkbox aria-label={`Select ${k}`} checked={on} onCheckedChange={(v) => toggle(k, v)} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={cx(c.numeric && s.num, c.muted && s.muted)}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
