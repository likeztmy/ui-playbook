import { AlignCenter, AlignLeft, AlignRight, Columns3, LayoutGrid, List } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { SegmentedControl, type Segment } from '../ui/SegmentedControl';
import { SliderPanel } from '../ui/Slider';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type View = 'board' | 'list' | 'timeline';
const VIEWS: Segment<View>[] = [
  { value: 'board', label: 'Board' },
  { value: 'list', label: 'List' },
  { value: 'timeline', label: 'Timeline' },
];

type Theme = 'light' | 'dark' | 'auto';
const THEMES: Segment<Theme>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

type Align = 'left' | 'center' | 'right';
const ALIGN: Segment<Align>[] = [
  { value: 'left', label: 'Align left', icon: AlignLeft },
  { value: 'center', label: 'Align center', icon: AlignCenter },
  { value: 'right', label: 'Align right', icon: AlignRight },
];

/** A segmented control that keeps its own value. */
function Own<T extends string>({ label, segments, initial, className, segmentClassName, pin }: {
  label: string;
  segments: Segment<T>[];
  initial: T;
  className?: string;
  segmentClassName?: string;
  pin?: { value: T; state: string };
}) {
  const [value, setValue] = useState(initial);
  return <SegmentedControl label={label} value={value} onValueChange={setValue} segments={segments} className={className} segmentClassName={segmentClassName} pin={pin} />;
}

/** Six tasks laid out as the chosen view. */
function ViewPreview({ view }: { view: View }) {
  return (
    <div className={s.viewPreview} data-view={view} role="img" aria-label={`Tasks as ${view}`}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} style={{ '--i': i } as CSSProperties} />
      ))}
    </div>
  );
}

export function SegmentedLive() {
  const [view, setView] = useState<View>('board');
  return (
    <Frame label="Tasks" height={240}>
      <div className={s.stack}>
        <SegmentedControl label="View" value={view} onValueChange={setView} segments={VIEWS} />
        <ViewPreview view={view} />
      </div>
    </Frame>
  );
}

export function SegmentedVariants() {
  return (
    <Gallery
      rows={[
        { name: 'Text', use: 'Two to five nouns of similar length. The usual case.', render: () => <Own label="Theme" segments={THEMES} initial="dark" /> },
        { name: 'Icons', use: 'Symbols people know, each with a tooltip that names it.', render: () => <Own label="Text alignment" segments={ALIGN} initial="left" /> },
        {
          name: 'In a panel',
          use: 'Fills the row of an inspector, among sliders.',
          render: () => (
            <SliderPanel className={s.sliderPanel}>
              <Own label="Layout" segments={VIEWS} initial="list" className={s.fill} />
            </SliderPanel>
          ),
        },
      ]}
    />
  );
}

export function SegmentedStates() {
  return (
    <Frame label="All states" height={0} still>
      <div className={s.sliderStates}>
        {(
          [
            ['Default', undefined],
            ['Hover on List', { value: 'list', state: 'hover' }],
            ['Focus on Board', { value: 'board', state: 'focus' }],
          ] as [string, { value: View; state: string } | undefined][]
        ).map(([name, pin]) => (
          <div key={name} className={s.sliderState}>
            <span>{name}</span>
            <Own label={name} segments={VIEWS} initial="board" pin={pin} />
          </div>
        ))}
        <div className={s.sliderState}>
          <span>Disabled segment</span>
          <Own label="View, with Timeline disabled" segments={VIEWS.map((v) => (v.value === 'timeline' ? { ...v, disabled: true } : v))} initial="board" />
        </div>
      </div>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

export function SegmentedThumb() {
  return (
    <Compare
      height={120}
      before={<Own label="View" segments={VIEWS} initial="board" className={m.noThumb} />}
      after={<Own label="View" segments={VIEWS} initial="board" />}
      beforeNote="Each segment fills in place, so the old goes off as the new comes on: a blink, not a move."
      afterNote="One thumb slides on the smooth spring, so the change has a from and a to."
    />
  );
}

const UNEVEN: Segment<'all' | 'mine' | 'review'>[] = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'Assigned to me' },
  { value: 'review', label: 'In review' },
];

export function SegmentedWidths() {
  return (
    <Compare
      height={120}
      before={<Own label="Filter" segments={UNEVEN} initial="all" className={m.contentWidths} />}
      after={<Own label="Filter" segments={UNEVEN} initial="all" />}
      beforeNote="As wide as their words, the segments look unrelated, and the thumb changes size as it travels."
      afterNote={
        <>
          Equal widths feel balanced, <a href="https://developer.apple.com/design/human-interface-guidelines/segmented-controls">Apple</a> notes; choose words of similar length.
        </>
      }
    />
  );
}

export function SegmentedRaised() {
  return (
    <Compare
      height={120}
      before={<Own label="Theme" segments={THEMES} initial="dark" className={m.accentThumb} />}
      after={<Own label="Theme" segments={THEMES} initial="dark" />}
      beforeNote="In accent blue, the chosen segment looks like a button to press."
      afterNote={
        <>
          A raised thumb says “this one” in the control’s own greys. <a href="/principles/colour-means-one-thing">Colour means one thing</a>.
        </>
      }
    />
  );
}

/** The track and thumb, magnified. */
export function SegmentedAnatomy() {
  return (
    <Frame label="At 2×" height={0} still>
      <figure className={s.anatomyItem}>
        <div className={s.magnify}>
          <Own label="View" segments={VIEWS} initial="list" />
        </div>
        <figcaption className={s.anatomyCaption}>A pill in a pill with an even 2px inset: concentric by shape, no arithmetic.</figcaption>
      </figure>
    </Frame>
  );
}

export function SegmentedContent() {
  return (
    <Compare
      height={120}
      before={
        <Own
          label="View"
          segments={[
            { value: 'grid', label: 'Grid', icon: LayoutGrid },
            { value: 'list', label: 'List' },
            { value: 'columns', label: 'Columns', icon: Columns3 },
          ]}
          initial="list"
        />
      }
      after={
        <Own
          label="View"
          segments={[
            { value: 'grid', label: 'Grid', icon: LayoutGrid },
            { value: 'list', label: 'List', icon: List },
            { value: 'columns', label: 'Columns', icon: Columns3 },
          ]}
          initial="list"
        />
      }
      beforeNote="A word beside icons outweighs them, and the control reads as two things."
      afterNote={
        <>
          All icons with tooltips, or all words: <a href="https://developer.apple.com/design/human-interface-guidelines/segmented-controls">Apple</a> warns that a mix reads as disconnected.
        </>
      }
    />
  );
}

export function SegmentedPreview() {
  return <Own label="View" segments={VIEWS} initial="list" />;
}
