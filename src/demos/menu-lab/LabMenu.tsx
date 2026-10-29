import { Menu } from '@base-ui/react/menu';
import { ArrowBigUp, Check, ChevronDown, ChevronRight, Command, Delete, Search, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { usePortalContainer } from '../../ui/portal';
import { GROUPS, type Keys, type Row } from './content';

/** What distinguishes one direction from another, beyond its stylesheet. */
export type Look = {
  s: Record<string, string>;
  icons: boolean;
  labels: boolean;
  /** native: system symbols, modifiers then a fixed key slot. caps: one keycap per key. plain: icon glyphs, no caps. */
  keys: 'native' | 'caps' | 'plain';
  check: 'left' | 'right';
  filter: boolean;
};

const MOD_ICON: Record<string, LucideIcon> = { '⌘': Command, '⇧': ArrowBigUp, '⌫': Delete };

function KeyHint({ keys, look }: { keys: Keys; look: Look }) {
  const { s } = look;
  if (look.keys === 'native') {
    const key = keys[keys.length - 1];
    return (
      <kbd className={s.keys}>
        <span className={s.mods}>{keys.slice(0, -1).join('')}</span>
        <span className={s.key}>{key}</span>
      </kbd>
    );
  }
  return (
    <kbd className={s.keys}>
      {keys.map((k, i) => {
        const Icon = MOD_ICON[k];
        return (
          <span key={i} className={s.key}>
            {Icon ? <Icon size={12} aria-label={k} /> : k}
          </span>
        );
      })}
    </kbd>
  );
}

/** The inside of a row, shared by the still and the live menu. */
function RowBody({ row, look, checked }: { row: Row; look: Look; checked?: boolean }) {
  const { s } = look;
  const Icon = row.icon;
  const checkSlot = (indicator: ReactNode) => <span className={s.check}>{indicator}</span>;
  const tick = <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />;
  const isCheck = row.kind === 'check';
  return (
    <>
      {look.check === 'left' && checkSlot(isCheck && checked ? tick : null)}
      {look.icons && Icon && <Icon className={s.icon} size={16} aria-hidden />}
      <span className={s.text}>{row.label}</span>
      {look.check === 'right' && isCheck && checkSlot(checked ? tick : null)}
      {row.kind === 'submenu' && (
        <ChevronRight className={s.chevron} size={16} aria-hidden />
      )}
      {'keys' in row && row.keys && <KeyHint keys={row.keys} look={look} />}
    </>
  );
}

function FilterRow({ look, live }: { look: Look; live: boolean }) {
  const { s } = look;
  return (
    <div className={s.inputRow}>
      <Search className={s.inputIcon} size={16} aria-hidden />
      {live ? (
        <Menu.Input className={s.input} aria-label="Filter actions" placeholder="Search actions" />
      ) : (
        <span className={s.placeholder}>Search actions</span>
      )}
    </div>
  );
}

/**
 * The open menu as a still: same markup and classes as the live one, with a
 * highlight that follows the pointer.
 */
export function StillMenu({ look, initial }: { look: Look; initial?: string }) {
  const { s } = look;
  const [hot, setHot] = useState(initial);
  return (
    <div className={s.popup} role="presentation" onMouseLeave={() => setHot(initial)}>
      {look.filter && <FilterRow look={look} live={false} />}
      <div className={s.list}>
        {GROUPS.map((g, gi) => (
          <div key={g.id} className={s.group}>
            {gi > 0 && <div className={s.separator} />}
            {look.labels && g.label && <div className={s.label}>{g.label}</div>}
            {g.rows.map((row) => (
              <div
                key={row.id}
                className={cx(s.item, row.kind === 'item' && row.danger && s.danger)}
                data-highlighted={hot === row.id ? '' : undefined}
                data-disabled={row.kind === 'item' && row.disabled ? '' : undefined}
                data-checked={row.kind === 'check' && row.checked ? '' : undefined}
                onMouseEnter={() => !(row.kind === 'item' && row.disabled) && setHot(row.id)}
              >
                <RowBody row={row} look={look} checked={row.kind === 'check' && row.checked} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Positioned({ look, children, sub }: { look: Look; children: ReactNode; sub?: boolean }) {
  const container = usePortalContainer();
  return (
    <Menu.Portal container={container}>
      <Menu.Positioner
        className={look.s.positioner}
        sideOffset={sub ? 0 : 6}
        alignOffset={sub ? -4 : 0}
        align="start"
      >
        <Menu.Popup className={cx(look.s.popup, sub && look.s.subPopup)}>{children}</Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function LiveRow({ row, look }: { row: Row; look: Look }) {
  const { s } = look;
  if (row.kind === 'check') {
    return <LiveCheck row={row} look={look} />;
  }
  if (row.kind === 'submenu') {
    return (
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger className={s.item}>
          <RowBody row={row} look={look} />
        </Menu.SubmenuTrigger>
        <Positioned look={look} sub>
          {row.items.map((name) => (
            <Menu.Item key={name} className={s.item}>
              {look.check === 'left' && <span className={s.check} />}
              <span className={s.text}>{name}</span>
            </Menu.Item>
          ))}
        </Positioned>
      </Menu.SubmenuRoot>
    );
  }
  return (
    <Menu.Item className={cx(s.item, row.danger && s.danger)} disabled={row.disabled} label={row.label}>
      <RowBody row={row} look={look} />
    </Menu.Item>
  );
}

function LiveCheck({ row, look }: { row: Extract<Row, { kind: 'check' }>; look: Look }) {
  const [checked, setChecked] = useState(row.checked);
  return (
    <Menu.CheckboxItem
      className={look.s.item}
      checked={checked}
      onCheckedChange={setChecked}
      closeOnClick={false}
      label={row.label}
    >
      <RowBody row={row} look={look} checked={checked} />
    </Menu.CheckboxItem>
  );
}

/** The same menu, live: Base UI parts carrying the direction's classes. */
export function LiveMenu({ look }: { look: Look }) {
  const { s } = look;
  const body = (
    <Menu.Root>
      <Menu.Trigger render={<Button />}>
        Edit <ChevronDown size={16} aria-hidden />
      </Menu.Trigger>
      <Positioned look={look}>
        {look.filter && <FilterRow look={look} live />}
        {look.filter && <Menu.Empty className={s.empty}>No matching actions.</Menu.Empty>}
        <Menu.List className={s.list}>
          {GROUPS.map((g, gi) => (
            <Menu.Group key={g.id} className={s.group}>
              {gi > 0 && <Menu.Separator className={s.separator} />}
              {look.labels && g.label && <Menu.GroupLabel className={s.label}>{g.label}</Menu.GroupLabel>}
              {g.rows.map((row) => (
                <LiveRow key={row.id} row={row} look={look} />
              ))}
            </Menu.Group>
          ))}
        </Menu.List>
      </Positioned>
    </Menu.Root>
  );
  return look.filter ? <Menu.FilterProvider>{body}</Menu.FilterProvider> : body;
}
