import { useState } from 'react';
import { Button } from '../ui/Button';
import { ClipboardPaste, CopyPlus, FileText, FolderInput, FolderOpen, History, Link, Share2, TextCursorInput, Trash2 } from 'lucide-react';
import { ContextMenu, Menu, RowContent, menuClasses as ms } from '../ui/Menu';
import { ChevronDownIcon } from '../ui/icons';
import { cx } from '../ui/cx';
import { Compare, Frame } from './shell';
import { GROUPS, type Group, type Row } from './menu-lab/content';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type StillProps = {
  /** The menu's content; defaults to the Edit menu. */
  groups?: Group[];
  /** The row highlighted at rest and after the pointer leaves. */
  initial?: string;
  /** Extra class on every row: how a "before" reproduces its mistake. */
  itemClass?: string;
  /** Render shortcuts as a box per key, as the second version did. */
  capShortcuts?: boolean;
};

/**
 * The open menu as a still: the live menu's classes and row markup, with a
 * highlight that follows the pointer.
 */
function StillMenu({ groups = GROUPS, initial = 'duplicate', itemClass, capShortcuts }: StillProps) {
  const [hot, setHot] = useState(initial);
  const row = (r: Row) => {
    const keys = 'keys' in r ? r.keys : undefined;
    return (
      <div
        key={r.id}
        className={cx(ms.item, r.kind === 'item' && r.danger && ms.danger, itemClass)}
        data-highlighted={hot === r.id ? '' : undefined}
        data-disabled={r.kind === 'item' && r.disabled ? '' : undefined}
        onMouseEnter={() => !(r.kind === 'item' && r.disabled) && setHot(r.id)}
      >
        <RowContent
          icon={r.icon}
          keys={capShortcuts ? undefined : keys}
          checked={r.kind === 'check' ? r.checked : undefined}
          submenu={r.kind === 'submenu'}
        >
          {r.label}
        </RowContent>
        {capShortcuts && keys && (
          <kbd className={m.capShortcut}>
            {keys.map((k) => (
              <span key={k}>{k}</span>
            ))}
          </kbd>
        )}
      </div>
    );
  };
  return (
    <div className={ms.popup} role="presentation" onMouseLeave={() => setHot(initial)}>
      {groups.map((g, gi) => (
        <div key={g.id}>
          {gi > 0 && <div className={ms.separator} />}
          {g.rows.map(row)}
        </div>
      ))}
    </div>
  );
}

export function MenuPreview() {
  return <StillMenu />;
}

function LiveMenu({ popupClass }: { popupClass?: string }) {
  return (
    <Menu.Root>
      <Menu.Trigger render={<Button />}>
        Edit <ChevronDownIcon />
      </Menu.Trigger>
      <Menu.Popup className={popupClass}>
        {GROUPS.map((g, gi) => (
          <Menu.Group key={g.id}>
            {gi > 0 && <Menu.Separator />}
            {g.rows.map((r) =>
              r.kind === 'submenu' ? (
                <Menu.Submenu key={r.id} icon={r.icon} label={r.label}>
                  {r.items.map((name) => (
                    <Menu.Item key={name}>{name}</Menu.Item>
                  ))}
                </Menu.Submenu>
              ) : r.kind === 'check' ? (
                <Menu.CheckboxItem key={r.id} icon={r.icon} keys={r.keys} defaultChecked={r.checked}>
                  {r.label}
                </Menu.CheckboxItem>
              ) : (
                <Menu.Item key={r.id} icon={r.icon} keys={r.keys} danger={r.danger} disabled={r.disabled}>
                  {r.label}
                </Menu.Item>
              ),
            )}
          </Menu.Group>
        ))}
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuLive() {
  return (
    <Frame label="Live" height={380}>
      <div className={s.top}>
        <LiveMenu />
      </div>
    </Frame>
  );
}

const STILL_HEIGHT = 360;

export function MenuHighlight() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu itemClass={m.faintHighlight} />}
      after={<StillMenu />}
      beforeNote="A 5% overlay (fill-hover) on surface-raised. Fine under a pointer; from the keyboard you have to hunt for the current row."
      afterNote="fill-active, 9%. The highlight is the keyboard user's cursor, so it has to be found at a glance in both themes."
    />
  );
}

export function MenuDanger() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu initial="delete" itemClass={m.greyDanger} />}
      after={<StillMenu initial="delete" />}
      beforeNote="The neutral highlight under red text. The row looks smudged, and the warning colour loses its ground."
      afterNote="danger-soft behind danger: the row keeps saying what it does at the moment you're about to do it."
    />
  );
}

export function MenuCheck() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu itemClass={m.trailingCheck} />}
      after={<StillMenu />}
      beforeNote="The check after the label, at the end of the label's space. It floats mid-row, far from the word it qualifies, and crowds the shortcut."
      afterNote="A leading column, as on macOS. Once any row can be checked every row keeps the column, so the labels stay on one line and the checks read top to bottom."
    />
  );
}

export function MenuConcentric() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu itemClass={m.sameRadius} />}
      after={<StillMenu />}
      beforeNote="Items reuse the popup's 10px radius. With a 4px inset the highlight's corners bulge toward the popup's edge."
      afterNote="radius-lg 10 − space-1 4 = radius-sm 6. The gap at the corner matches the gap along the sides."
    />
  );
}

export function MenuShortcuts() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu capShortcuts />}
      after={<StillMenu />}
      beforeNote="A box around every key: a dozen boxes in seven rows, louder than the labels they explain. In dark they read as holes in the menu."
      afterNote="Bare symbols a step lighter than the label, as macOS draws them. The last key sits in a fixed cell, modifiers to its left in Apple's order ⌃ ⌥ ⇧ ⌘, so the keys form one column."
    />
  );
}

export function MenuMotion() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={
        <div className={s.top}>
          <LiveMenu popupClass={m.centerScale} />
        </div>
      }
      after={
        <div className={s.top}>
          <LiveMenu />
        </div>
      }
      beforeNote="Grows from its own centre at the same 200ms both ways. It seems to appear from nowhere, and closing makes you wait."
      afterNote="Grows from 0.96, 4px toward the trigger, on the smooth spring; leaves in duration-fast with ease-in."
    />
  );
}

// ── Kinds of menu ────────────────────────────────────────

// A file's context menu: actions on this one object, no shortcuts, nothing
// unavailable shown, three groups at most.
const CONTEXT: Group[] = [
  {
    id: 'object',
    rows: [
      { kind: 'item', id: 'open', label: 'Open', icon: FolderOpen },
      { kind: 'item', id: 'rename', label: 'Rename', icon: TextCursorInput },
      { kind: 'item', id: 'duplicate', label: 'Duplicate', icon: CopyPlus },
      { kind: 'submenu', id: 'move', label: 'Move to', icon: FolderInput, items: ['Inbox', 'Projects', 'Archive'] },
    ],
  },
  {
    id: 'share',
    rows: [
      { kind: 'item', id: 'share', label: 'Share…', icon: Share2 },
      { kind: 'item', id: 'link', label: 'Copy link', icon: Link },
    ],
  },
  { id: 'danger', rows: [{ kind: 'item', id: 'delete', label: 'Delete', icon: Trash2, danger: true }] },
];

function FileCard() {
  return (
    <span className={s.fileCard}>
      <FileText size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
      <span>
        <span className={s.fileName}>Q4 roadmap</span>
        <span className={s.fileMeta}>Edited 2 hours ago</span>
      </span>
    </span>
  );
}

export function MenuContextLive() {
  return (
    <Frame label="Context menu · right-click the file" height={380}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className={cx(s.contextTarget, s.top)}>
          <FileCard />
        </ContextMenu.Trigger>
        <ContextMenu.Popup>
          {CONTEXT.map((g, gi) => (
            <Menu.Group key={g.id}>
              {gi > 0 && <Menu.Separator />}
              {g.rows.map((r) =>
                r.kind === 'submenu' ? (
                  <Menu.Submenu key={r.id} icon={r.icon} label={r.label}>
                    {r.items.map((name) => (
                      <Menu.Item key={name}>{name}</Menu.Item>
                    ))}
                  </Menu.Submenu>
                ) : (
                  <Menu.Item key={r.id} icon={r.icon} danger={r.kind === 'item' && r.danger}>
                    {r.label}
                  </Menu.Item>
                ),
              )}
            </Menu.Group>
          ))}
        </ContextMenu.Popup>
      </ContextMenu.Root>
    </Frame>
  );
}

const SORT_FIELDS = ['Name', 'Modified', 'Created', 'Size'] as const;

export function MenuChoiceLive() {
  const [field, setField] = useState<string>('Modified');
  const [order, setOrder] = useState<string>('Newest first');
  return (
    <Frame label="Choice · the trigger shows the value" height={300}>
      <div className={s.top}>
        <Menu.Root>
          <Menu.Trigger render={<Button variant="ghost" />}>
            Sort: {field} <ChevronDownIcon />
          </Menu.Trigger>
          <Menu.Popup>
            <Menu.RadioGroup value={field} onValueChange={(v) => setField(v as string)}>
              {SORT_FIELDS.map((f) => (
                <Menu.RadioItem key={f} value={f}>
                  {f}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
            <Menu.Separator />
            <Menu.RadioGroup value={order} onValueChange={(v) => setOrder(v as string)}>
              {['Newest first', 'Oldest first'].map((o) => (
                <Menu.RadioItem key={o} value={o}>
                  {o}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Root>
      </div>
    </Frame>
  );
}

// ── Icons, shortcuts and unavailable items, by kind ──────

const withoutIcons = (groups: Group[], keep: string[]): Group[] =>
  groups.map((g) => ({
    ...g,
    rows: g.rows.map((r) => (r.kind === 'item' && !keep.includes(r.id) ? { ...r, icon: undefined } : r)),
  }));

export function MenuIconsAllOrNone() {
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu groups={withoutIcons(GROUPS, ['copy', 'delete'])} />}
      after={<StillMenu />}
      beforeNote="Icons on Copy and Delete only. Labels start at two different x positions, and the iconless rows read as second-class."
      afterNote="Every row in the group has one, so labels share one edge. When an item has no icon that clearly means it, the whole menu goes without."
    />
  );
}

const withKeys = (groups: Group[], keys: Record<string, string[]>): Group[] =>
  groups.map((g) => ({
    ...g,
    rows: g.rows.map((r) => (r.kind === 'item' && keys[r.id] ? { ...r, keys: keys[r.id] } : r)),
  }));

export function MenuContextShortcuts() {
  const invented = withKeys(CONTEXT, {
    open: ['↵'],
    rename: ['⌘', 'R'],
    duplicate: ['⌘', 'D'],
    share: ['⇧', '⌘', 'S'],
    link: ['⇧', '⌘', 'C'],
    delete: ['⌘', '⌫'],
  });
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu groups={invented} initial="share" />}
      after={<StillMenu groups={CONTEXT} initial="share" />}
      beforeNote="A context menu carrying shortcuts, two of them made up for the menu. Right-clicking already is the shortcut; the column only adds width and noise."
      afterNote="No shortcuts in the context menu. They live in the pull-down and command menus, where people go to learn them."
    />
  );
}

export function MenuUnavailable() {
  const dimmed: Group[] = [
    {
      ...CONTEXT[0],
      rows: [
        ...CONTEXT[0].rows,
        { kind: 'item', id: 'paste', label: 'Paste style', icon: ClipboardPaste, disabled: true },
        { kind: 'item', id: 'restore', label: 'Restore version', icon: History, disabled: true },
      ],
    },
    ...CONTEXT.slice(1),
  ];
  return (
    <Compare
      height={STILL_HEIGHT}
      before={<StillMenu groups={dimmed} initial="open" />}
      after={<StillMenu groups={CONTEXT} initial="open" />}
      beforeNote="Paste style and Restore version shown dimmed in a context menu. There's nothing to paste and no versions: the menu lists what this file can't do."
      afterNote="Hidden: a context menu holds what applies to this object now. A pull-down keeps unavailable commands dimmed instead, so its layout stays put and features stay discoverable."
    />
  );
}
