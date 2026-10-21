import { useState, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Menu } from '../ui/Menu';
import { ChevronDownIcon, CopyIcon, DuplicateIcon, RenameIcon, TrashIcon } from '../ui/icons';
import { cx } from '../ui/cx';
import { Compare, Frame } from './shell';
import ms from '../ui/Menu.module.scss';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type Entry = { label: string; icon?: ReactNode; shortcut?: string; danger?: boolean } | 'sep';

const ENTRIES: Entry[] = [
  { label: 'Copy', icon: <CopyIcon />, shortcut: '⌘C' },
  { label: 'Duplicate', icon: <DuplicateIcon />, shortcut: '⌘D' },
  { label: 'Rename', icon: <RenameIcon />, shortcut: 'F2' },
  'sep',
  { label: 'Delete', icon: <TrashIcon />, shortcut: '⌫', danger: true },
];

/**
 * The menu's look without its behaviour, for side-by-side stills.
 * Hovering highlights like the real thing.
 */
function StillMenu({ itemClass, inlineShortcut }: { itemClass?: string; inlineShortcut?: boolean }) {
  const [hot, setHot] = useState(0);
  return (
    <div className={ms.popup} role="presentation" onMouseLeave={() => setHot(-1)}>
      <div className={ms.label}>Edit</div>
      {ENTRIES.map((e, i) =>
        e === 'sep' ? (
          <div key={i} className={ms.separator} />
        ) : (
          <div
            key={i}
            className={cx(ms.item, e.danger && ms.danger, itemClass)}
            data-highlighted={hot === i ? '' : undefined}
            onMouseEnter={() => setHot(i)}
          >
            {e.icon}
            {e.label}
            {e.shortcut && (
              <kbd className={ms.shortcut} style={inlineShortcut ? { marginLeft: 0 } : undefined}>
                {e.shortcut}
              </kbd>
            )}
          </div>
        ),
      )}
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
        {ENTRIES.map((e, i) =>
          e === 'sep' ? (
            <Menu.Separator key={i} />
          ) : (
            <Menu.Item key={i} icon={e.icon} shortcut={e.shortcut} danger={e.danger}>
              {e.label}
            </Menu.Item>
          ),
        )}
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuLive() {
  return (
    <Frame label="Live" height={260}>
      <div className={s.top}>
        <LiveMenu />
      </div>
    </Frame>
  );
}

export function MenuConcentric() {
  return (
    <Compare
      height={240}
      before={<StillMenu itemClass={m.sameRadius} />}
      after={<StillMenu />}
      beforeNote="Items reuse the popup's 12px radius. With a 4px inset the highlight's corners bulge toward the popup's edge."
      afterNote="radius-lg 12 − space-1 4 = radius-md 8. The gap at the corner matches the gap along the sides."
    />
  );
}

export function MenuShortcuts() {
  return (
    <Compare
      height={240}
      before={<StillMenu inlineShortcut />}
      after={<StillMenu />}
      beforeNote="Shortcuts trail each label, so they start at a different x on every row and can't be scanned."
      afterNote="Pushed to the right edge in mono with tabular figures: one column, read top to bottom."
    />
  );
}

export function MenuMotion() {
  return (
    <Compare
      height={260}
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
      afterNote="Slides 4px out of the trigger with ease-out, and leaves in half the time with ease-in."
    />
  );
}
