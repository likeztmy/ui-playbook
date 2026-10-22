import {
  ArrowBigUp,
  ChevronUp,
  Command,
  Copy,
  CopyPlus,
  CornerDownLeft,
  Delete,
  FolderInput,
  Grid3x3,
  Option,
  Paintbrush,
  Redo2,
  TextCursorInput,
  Trash2,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { RowContent, menuClasses as ms } from '../../ui/Menu';
import { cx } from '../../ui/cx';
import { Frame } from '../shell';
import k from './shortcuts.module.scss';
import s from './lab.module.scss';

// The same Edit menu for every direction, with shortcuts of one, two and
// three keys, so alignment has something to prove.

type Row = { id: string; label: string; icon: LucideIcon; keys?: string[]; disabled?: boolean; danger?: boolean; checked?: boolean; submenu?: boolean };

const GROUPS: Row[][] = [
  [
    { id: 'undo', label: 'Undo', icon: Undo2, keys: ['⌘', 'Z'], disabled: true },
    { id: 'redo', label: 'Redo', icon: Redo2, keys: ['⇧', '⌘', 'Z'] },
  ],
  [
    { id: 'copy', label: 'Copy', icon: Copy, keys: ['⌘', 'C'] },
    { id: 'style', label: 'Copy style', icon: Paintbrush, keys: ['⌥', '⌘', 'C'] },
    { id: 'duplicate', label: 'Duplicate', icon: CopyPlus, keys: ['⌘', 'D'] },
    { id: 'rename', label: 'Rename', icon: TextCursorInput, keys: ['↵'] },
  ],
  [
    { id: 'move', label: 'Move to', icon: FolderInput, submenu: true },
    { id: 'grid', label: 'Snap to grid', icon: Grid3x3, keys: ['⌃', '⇧', 'G'], checked: true },
  ],
  [{ id: 'delete', label: 'Delete', icon: Trash2, keys: ['⌘', '⌫'], danger: true }],
];

// Apple's symbols, drawn by Lucide so every glyph shares one stroke.
const GLYPH: Record<string, LucideIcon> = {
  '⌘': Command,
  '⇧': ArrowBigUp,
  '⌥': Option,
  '⌃': ChevronUp,
  '⌫': Delete,
  '↵': CornerDownLeft,
};

function Glyph({ k: key, size, stroke }: { k: string; size: number; stroke: number }) {
  const Icon = GLYPH[key];
  return Icon ? <Icon size={size} strokeWidth={stroke} nonScalingStroke aria-label={key} /> : <>{key}</>;
}

type Style = 'column' | 'text' | 'chip';

/** A: modifiers right-aligned against a fixed key cell, so the keys form a column. */
function ColumnKeys({ keys }: { keys: string[] }) {
  const mods = keys.slice(0, -1);
  const key = keys[keys.length - 1];
  return (
    <kbd className={k.column}>
      <span className={k.mods}>
        {mods.map((m) => (
          <Glyph key={m} k={m} size={12} stroke={1.25} />
        ))}
      </span>
      <span className={k.keyCell}>
        <Glyph k={key} size={12} stroke={1.25} />
      </span>
    </kbd>
  );
}

/** B and C: the keys as one run of glyphs. */
function RunKeys({ keys, chip }: { keys: string[]; chip?: boolean }) {
  return (
    <kbd className={cx(k.run, chip && k.chip)}>
      {keys.map((key) => (
        <Glyph key={key} k={key} size={11} stroke={1.25} />
      ))}
    </kbd>
  );
}

function Shortcut({ style, keys }: { style: Style; keys: string[] }) {
  if (style === 'column') return <ColumnKeys keys={keys} />;
  return <RunKeys keys={keys} chip={style === 'chip'} />;
}

function Still({ style, initial }: { style: Style; initial: string }) {
  const [hot, setHot] = useState(initial);
  return (
    <div className={cx(ms.popup, k.popup)} role="presentation" onMouseLeave={() => setHot(initial)}>
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          {gi > 0 && <div className={ms.separator} />}
          {g.map((r) => (
            <div
              key={r.id}
              className={cx(ms.item, r.danger && ms.danger)}
              data-highlighted={hot === r.id ? '' : undefined}
              data-disabled={r.disabled ? '' : undefined}
              onMouseEnter={() => !r.disabled && setHot(r.id)}
            >
              <RowContent icon={r.icon} checked={r.checked} submenu={r.submenu}>
                {r.label}
              </RowContent>
              {r.keys && <Shortcut style={style} keys={r.keys} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Direction({ style }: { style: Style }) {
  return (
    <div className={s.row}>
      <Frame label="Light · Copy style highlighted" defaultTheme="light" height={420}>
        <Still style={style} initial="style" />
      </Frame>
      <Frame label="Dark · Delete highlighted" defaultTheme="dark" height={420}>
        <Still style={style} initial="delete" />
      </Frame>
    </div>
  );
}

export const ColumnDirection = () => <Direction style="column" />;
export const TextDirection = () => <Direction style="text" />;
export const ChipDirection = () => <Direction style="chip" />;
