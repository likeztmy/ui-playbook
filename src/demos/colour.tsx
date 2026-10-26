import { CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { EllipseIcon, PenIcon, PointerIcon, RectIcon, TextIcon } from '../ui/icons';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Tabs } from '../ui/Tabs';
import { Toolbar } from '../ui/Toolbar';
import { Compare, Frame } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const TOOLS = [
  ['select', 'Select', <PointerIcon />],
  ['rect', 'Rectangle', <RectIcon />],
  ['ellipse', 'Ellipse', <EllipseIcon />],
  ['text', 'Text', <TextIcon />],
  ['pen', 'Pen', <PenIcon />],
] as const;

const FRAMES = ['Cover', 'Pricing', 'Onboarding', 'Settings'];

/**
 * An editor: tabs, tools, a view switch, a list with one row chosen, and the
 * one action. `loud` marks every current state in solid accent.
 */
function Editor({ loud }: { loud?: boolean }) {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [frame, setFrame] = useState('Pricing');
  return (
    <div className={s.editor}>
      <div className={s.editorBar}>
        <Tabs.Root defaultValue="design">
          <Tabs.List aria-label="Document" className={cx(loud && m.accentTabs)}>
            <Tabs.Tab value="design">Design</Tabs.Tab>
            <Tabs.Tab value="prototype">Prototype</Tabs.Tab>
            <Tabs.Tab value="comments" count={3}>
              Comments
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>
        <Button variant="primary" size="sm">
          Publish
        </Button>
      </div>
      <div className={s.editorBar}>
        <Toolbar.Root aria-label="Drawing" className={s.editorTools}>
          <Toolbar.Tools defaultValue={['rect']} aria-label="Tools">
            {TOOLS.map(([value, label, icon]) => (
              <Toolbar.Tool key={value} value={value} label={label} className={cx(loud && m.solidPressed)}>
                {icon}
              </Toolbar.Tool>
            ))}
          </Toolbar.Tools>
        </Toolbar.Root>
        <SegmentedControl
          label="View"
          value={view}
          onValueChange={setView}
          segments={[
            { value: 'board', label: 'Board' },
            { value: 'list', label: 'List' },
          ]}
          className={cx(loud && m.accentThumb)}
        />
      </div>
      <div
        className={s.editorList}
        role="listbox"
        aria-label="Frames"
        onKeyDown={(e) => {
          const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
          if (!step) return;
          e.preventDefault();
          const next = FRAMES[(FRAMES.indexOf(frame) + step + FRAMES.length) % FRAMES.length];
          setFrame(next);
          (e.currentTarget.querySelector(`[data-frame="${next}"]`) as HTMLElement | null)?.focus();
        }}
      >
        {FRAMES.map((f) => (
          <div
            key={f}
            role="option"
            data-frame={f}
            aria-selected={f === frame}
            tabIndex={f === frame ? 0 : -1}
            className={cx(s.editorRow, loud && m.loudRow)}
            onClick={() => setFrame(f)}
          >
            <span className={s.editorThumb} aria-hidden />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColourOneBlue() {
  return (
    <Compare
      stacked
      height={0}
      before={<Editor loud />}
      after={<Editor />}
      beforeNote={
        <>
          Every “current” is blue, so the one blue that means “do this now” has to be read for, not seen. A single colour pops out of a
          scene only while it’s the only one; mixed in with others, finding it becomes a search item by item (
          <a href="https://doi.org/10.1109/TVCG.2011.127">Healey and Enns 2012</a>).
        </>
      }
      afterNote="Current states speak in shape and shade: an ink bar, a raised segment, a pale tint. The one solid blue is Publish."
    />
  );
}

export function ColourGreyscale() {
  return (
    <Frame label="Without colour" height={0}>
      <div className={cx(m.greyscale, s.fill)}>
        <Editor />
      </div>
    </Frame>
  );
}

// ── More cases ───────────────────────────────────────────

/** A list whose hover can borrow the selection's tint. */
function HoverList({ hoverTint }: { hoverTint?: boolean }) {
  const [chosen, setChosen] = useState('Pricing');
  return (
    <div className={s.editorList} role="listbox" aria-label="Frames">
      {FRAMES.map((f) => (
        <div
          key={f}
          role="option"
          aria-selected={f === chosen}
          className={cx(s.editorRow, hoverTint && m.tintHover)}
          onClick={() => setChosen(f)}
        >
          <span className={s.editorThumb} aria-hidden />
          {f}
        </div>
      ))}
    </div>
  );
}

export function ColourHover() {
  return (
    <Compare
      height={200}
      before={<HoverList hoverTint />}
      after={<HoverList />}
      beforeNote="With hover in the selection’s tint, every row the pointer crosses looks chosen for a moment."
      afterNote="Hover is a neutral fill that only says “here”; the tint is kept for the row that’s chosen."
    />
  );
}

const NAV = [
  ['Inbox', 12],
  ['Mentions', 3],
  ['Drafts', 2],
] as const;

/** A sidebar with counts, and one thing that really is wrong. */
function Sidebar({ redCounts }: { redCounts?: boolean }) {
  return (
    <div className={s.sideNav}>
      {NAV.map(([name, n]) => (
        <div key={name} className={s.sideNavRow}>
          <span>{name}</span>
          <span className={cx(s.sideCount, redCounts && m.redCount)}>{n}</span>
        </div>
      ))}
      <div className={s.sideAlert} role="status">
        <CircleAlert size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
        Payment failed
      </div>
    </div>
  );
}

export function ColourRed() {
  return (
    <Compare
      height={200}
      before={<Sidebar redCounts />}
      after={<Sidebar />}
      beforeNote="With counts in red too, the one red that needs doing is one of four, and people learn to look past red."
      afterNote="Counts are ink on grey: news, not trouble. Red is left to the payment that failed."
    />
  );
}

/** A plan summary where blue may mean more than “goes somewhere”. */
function Plan({ blueText }: { blueText?: boolean }) {
  const em = cx(blueText && m.blueText);
  return (
    <div className={s.planCard}>
      <span>
        Plan: <b className={em}>Pro</b>
      </span>
      <span>
        Storage: <span className={em}>4.2 of 10 GB</span>
      </span>
      <span>
        Renews on <span className={em}>1 December</span>.{' '}
        <a href="#billing" onClick={(e) => e.preventDefault()}>
          Manage billing
        </a>
      </span>
    </div>
  );
}

export function ColourLinks() {
  return (
    <Compare
      height={160}
      before={<Plan blueText />}
      after={<Plan />}
      beforeNote="Blue text reads as a link, so the plan name and the numbers get clicked and do nothing."
      afterNote="Only Manage billing is blue, and it’s the only thing here that goes somewhere."
    />
  );
}

export function ColourPreview() {
  return (
    <div className={s.colourStill}>
      <Editor />
    </div>
  );
}
