import { useRef, useState } from 'react';
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
    <Frame label="Edit" height={380}>
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
      beforeLabel="Highlight at 5%"
      afterLabel="Highlight at 9%"
      height={STILL_HEIGHT}
      before={<StillMenu itemClass={m.faintHighlight} />}
      after={<StillMenu />}
      beforeNote="At 5% on a raised surface, the keyboard’s cursor has to be hunted for."
      afterNote="At 9% it’s found at a glance, in both themes."
    />
  );
}

export function MenuDanger() {
  return (
    <Compare
      beforeLabel="Grey highlight, red text"
      afterLabel="Red highlight, red text"
      height={STILL_HEIGHT}
      before={<StillMenu initial="delete" itemClass={m.greyDanger} />}
      after={<StillMenu initial="delete" />}
      beforeNote="A neutral highlight under red text smudges the row."
      afterNote="The row keeps saying what it does at the moment you’re about to do it."
    />
  );
}

export function MenuCheck() {
  return (
    <Compare
      beforeLabel="Check after the label"
      afterLabel="Check in a leading column"
      height={STILL_HEIGHT}
      before={<StillMenu itemClass={m.trailingCheck} />}
      after={<StillMenu />}
      beforeNote="Placed after the label, each check lands where its label ends, so the checks never line up."
      afterNote="A leading column, as on macOS: labels keep one edge and checks read top to bottom."
    />
  );
}

export function MenuShortcuts() {
  return (
    <Compare
      beforeLabel="A box per key"
      afterLabel="Bare symbols in a column"
      height={STILL_HEIGHT}
      before={<StillMenu capShortcuts />}
      after={<StillMenu />}
      beforeNote="A box per key is louder than the label it explains."
      afterNote="Bare symbols a step lighter, as macOS draws them; the last key sits in a fixed cell, so the keys form a column."
    />
  );
}

export function MenuMotion() {
  return (
    <Compare
      beforeLabel="Grows from its centre"
      afterLabel="Grows from the trigger"
      motion
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
      beforeNote="Grown from its own centre, the menu seems to come from nowhere. At 0.96 to 1 the two starts differ by a few pixels, which is why it takes slow motion to see: the dashed box is the first frame, the dot the point it grows from."
      afterNote="Grown from the trigger’s corner, it is plainly that button’s menu."
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

type FileRow = { id: number; name: string; minutes: number; size: number };

const START_FILES: FileRow[] = [
  { id: 1, name: 'Q4 roadmap', minutes: 120, size: 18.4 },
  { id: 2, name: 'Brand guide', minutes: 1560, size: 4.2 },
  { id: 3, name: 'Metrics', minutes: 15, size: 0.8 },
];

const edited = (m: number) =>
  m < 1 ? 'Edited just now' : m < 60 ? `Edited ${m} minutes ago` : m < 1440 ? `Edited ${Math.round(m / 60)} hours ago` : 'Edited yesterday';

function FileCard({ name, meta }: { name: string; meta: string }) {
  return (
    <span className={s.fileCard}>
      <FileText size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
      <span>
        <span className={s.fileName}>{name}</span>
        <span className={s.fileMeta}>{meta}</span>
      </span>
    </span>
  );
}

const SORT_FIELDS = ['Name', 'Modified', 'Size'] as const;

/** Files you can sort from a choice menu and act on from a context menu. */
function FilesScene() {
  const [files, setFiles] = useState(START_FILES);
  const [field, setField] = useState<string>('Modified');
  const [order, setOrder] = useState<string>('Descending');
  const next = useRef(START_FILES.length + 1);
  const key = (f: FileRow) => (field === 'Name' ? f.name : field === 'Size' ? f.size : -f.minutes);
  const sorted = [...files].sort((a, b) => {
    const [x, y] = [key(a), key(b)];
    const c = typeof x === 'string' ? x.localeCompare(y as string) : x - (y as number);
    return order === 'Ascending' ? c : -c;
  });
  const duplicate = (f: FileRow) => setFiles((l) => [...l, { ...f, id: next.current++, name: `${f.name} copy`, minutes: 0 }]);
  const remove = (f: FileRow) => setFiles((l) => l.filter((x) => x.id !== f.id));
  return (
    <div className={s.menuFiles}>
      <div className={s.menuFilesBar}>
        <Menu.Root>
          <Menu.Trigger render={<Button variant="ghost" size="sm" />}>
            Sort: {field} <ChevronDownIcon />
          </Menu.Trigger>
          <Menu.Popup align="end">
            <Menu.RadioGroup value={field} onValueChange={(v) => setField(v as string)}>
              {SORT_FIELDS.map((f) => (
                <Menu.RadioItem key={f} value={f}>
                  {f}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
            <Menu.Separator />
            <Menu.RadioGroup value={order} onValueChange={(v) => setOrder(v as string)}>
              {['Ascending', 'Descending'].map((o) => (
                <Menu.RadioItem key={o} value={o}>
                  {o}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Root>
      </div>
      <div className={s.menuFileList} role="list">
        {sorted.map((f) => (
          <div key={f.id} role="listitem">
            <ContextMenu.Root>
              <ContextMenu.Trigger className={s.contextTarget}>
                <FileCard name={f.name} meta={field === 'Size' ? `${f.size.toFixed(1)} MB` : edited(f.minutes)} />
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
                        <Menu.Item
                          key={r.id}
                          icon={r.icon}
                          danger={r.kind === 'item' && r.danger}
                          onClick={r.id === 'duplicate' ? () => duplicate(f) : r.id === 'delete' ? () => remove(f) : undefined}
                        >
                          {r.label}
                        </Menu.Item>
                      ),
                    )}
                  </Menu.Group>
                ))}
              </ContextMenu.Popup>
            </ContextMenu.Root>
          </div>
        ))}
        {!files.length && (
          <Button size="sm" onClick={() => setFiles(START_FILES)}>
            Reset demo
          </Button>
        )}
      </div>
    </div>
  );
}

export function MenuScene() {
  return (
    <Frame label="Files" height={400}>
      <FilesScene />
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
      beforeLabel="Icons on two rows"
      afterLabel="Icons on every row"
      height={STILL_HEIGHT}
      before={<StillMenu groups={withoutIcons(GROUPS, ['copy', 'delete'])} />}
      after={<StillMenu />}
      beforeNote="Labels start at two edges, and the rows without an icon read as lesser."
      afterNote="Every label on one edge. When an item has no icon that clearly means it, the group goes without."
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
      beforeLabel="Six shortcuts"
      afterLabel="No shortcuts"
      height={STILL_HEIGHT}
      before={<StillMenu groups={invented} initial="share" />}
      after={<StillMenu groups={CONTEXT} initial="share" />}
      beforeNote="Right-clicking is already the shortcut, and two of these keys were made up for the menu."
      afterNote="Shortcuts live where people go to learn them: the pull-down and the command menu."
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
      beforeLabel="Two items dimmed"
      afterLabel="Unavailable items left out"
      height={STILL_HEIGHT}
      before={<StillMenu groups={dimmed} initial="open" />}
      after={<StillMenu groups={CONTEXT} initial="open" />}
      beforeNote="The menu lists what this file can’t do."
      afterNote="A context menu holds what applies now. A pull-down keeps the unavailable dimmed instead, so its layout stays put and features stay findable."
    />
  );
}
