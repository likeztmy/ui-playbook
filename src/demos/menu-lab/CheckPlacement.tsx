import { Check, ChevronRight, Copy, CopyPlus, FolderInput, Grid3x3, Ruler, Trash2, type LucideIcon } from 'lucide-react';
import { Keys, menuClasses as ms } from '../../ui/Menu';
import { cx } from '../../ui/cx';
import { Frame } from '../shell';
import c from './check.module.scss';
import s from './lab.module.scss';

// Where a checkmark goes, on the same two menus: one with icons, one without.

type Row = { id: string; label: string; icon?: LucideIcon; keys?: string[]; checked?: boolean; submenu?: boolean; danger?: boolean };

const EDIT: Row[][] = [
  [
    { id: 'copy', label: 'Copy', icon: Copy, keys: ['⌘', 'C'] },
    { id: 'duplicate', label: 'Duplicate', icon: CopyPlus, keys: ['⌘', 'D'] },
    { id: 'move', label: 'Move to', icon: FolderInput, submenu: true },
  ],
  [
    { id: 'grid', label: 'Snap to grid', icon: Grid3x3, keys: ['⇧', 'G'], checked: true },
    { id: 'rulers', label: 'Show rulers', icon: Ruler, checked: false },
  ],
  [{ id: 'delete', label: 'Delete', icon: Trash2, keys: ['⌘', '⌫'], danger: true }],
];

const SORT: Row[][] = [
  [
    { id: 'name', label: 'Name', checked: false },
    { id: 'modified', label: 'Modified', checked: true },
    { id: 'size', label: 'Size', checked: false },
  ],
  [
    { id: 'newest', label: 'Newest first', checked: true },
    { id: 'oldest', label: 'Oldest first', checked: false },
  ],
];

type Placement = 'leading' | 'trailing' | 'replace' | 'afterLabel';

const tick = <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />;

function Item({ row, place }: { row: Row; place: Placement }) {
  const Icon = row.icon;
  const checkable = row.checked !== undefined;
  const slot = (
    <span className={cx(ms.check, c.slot)} data-off={row.checked ? undefined : ''}>
      {tick}
    </span>
  );
  const chevron = row.submenu && <ChevronRight className={ms.chevron} size={16} aria-hidden />;
  // B: a checked row shows the check where its icon would be.
  const showIcon = Icon && !(place === 'replace' && row.checked);
  return (
    <div className={cx(ms.item, row.danger && ms.danger)}>
      {place === 'leading' && (checkable ? slot : <span className={c.gutter} />)}
      {place === 'replace' && row.checked && <span className={ms.check}>{tick}</span>}
      {showIcon && <Icon className={ms.icon} size={16} aria-hidden />}
      <span className={ms.text}>{row.label}</span>
      {/* C, as live: the check right after the label's space, before the shortcut. */}
      {place === 'afterLabel' && row.checked && <span className={ms.check}>{tick}</span>}
      {place !== 'trailing' && chevron}
      {row.keys && <Keys keys={row.keys} />}
      {/* A: one end column shared by checks and submenu chevrons. */}
      {place === 'trailing' && (chevron || (checkable ? slot : <span className={c.gutter} />))}
    </div>
  );
}

function Still({ groups, place, width }: { groups: Row[][]; place: Placement; width: number }) {
  return (
    <div className={cx(ms.popup, c.noAutoGutter)} style={{ minWidth: width }} role="presentation">
      {groups.map((g, i) => (
        <div key={i}>
          {i > 0 && <div className={ms.separator} />}
          {g.map((r) => (
            <Item key={r.id} row={r} place={place} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Each option: the icon menu, then the plain menu, as it would be drawn. */
function Option({ label, edit, sort }: { label: string; edit: Placement; sort: Placement }) {
  return (
    <div className={s.row}>
      <Frame label={`${label} · with icons`} defaultTheme="light" height={330}>
        <Still groups={EDIT} place={edit} width={160} />
      </Frame>
      <Frame label={`${label} · without icons`} defaultTheme="light" height={330}>
        <Still groups={SORT} place={sort} width={160} />
      </Frame>
    </div>
  );
}

export const CheckNow = () => <Option label="Shipped" edit="leading" sort="leading" />;
export const CheckA = () => <Option label="A" edit="trailing" sort="leading" />;
export const CheckB = () => <Option label="B" edit="replace" sort="leading" />;
export const CheckC = () => <Option label="C" edit="afterLabel" sort="afterLabel" />;
