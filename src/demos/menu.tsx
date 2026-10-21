import { useState } from 'react';
import { Button } from '../ui/Button';
import { Menu, RowContent, menuClasses as ms } from '../ui/Menu';
import { ChevronDownIcon } from '../ui/icons';
import { cx } from '../ui/cx';
import { Compare, Frame } from './shell';
import { GROUPS, type Row } from './menu-lab/content';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type StillProps = {
  /** The row highlighted at rest and after the pointer leaves. */
  initial?: string;
  /** Extra class on every row: how a "before" reproduces its mistake. */
  itemClass?: string;
  /** Render shortcuts as one mono string, as the first version did. */
  monoShortcuts?: boolean;
};

/**
 * The open menu as a still: the live menu's classes and row markup, with a
 * highlight that follows the pointer.
 */
function StillMenu({ initial = 'duplicate', itemClass, monoShortcuts }: StillProps) {
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
          keys={monoShortcuts ? undefined : keys}
          checked={r.kind === 'check' && r.checked}
          submenu={r.kind === 'submenu'}
        >
          {r.label}
        </RowContent>
        {monoShortcuts && keys && <kbd className={m.monoShortcut}>{keys.join('')}</kbd>}
      </div>
    );
  };
  return (
    <div className={ms.popup} role="presentation" onMouseLeave={() => setHot(initial)}>
      {GROUPS.map((g, gi) => (
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

export function MenuConcentric() {
  return (
    <Compare
      height={STILL_HEIGHT}
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
      height={STILL_HEIGHT}
      before={<StillMenu monoShortcuts />}
      after={<StillMenu />}
      beforeNote="One mono string per shortcut. The UI fonts have no ⌘ or ⌫, so the browser borrows them from another face: thinner, smaller, off the baseline."
      afterNote="One 18px cap per key, modifiers drawn as icons at the text's stroke. Every glyph comes from the same hand, and the caps line up as a column."
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
      afterNote="Slides 4px out of the trigger with ease-out, and leaves in half the time with ease-in."
    />
  );
}
