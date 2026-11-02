import { useState, type ReactNode } from 'react';
import { CheckIcon, CrossIcon } from '../../ui/icons';
import { cx } from '../../ui/cx';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { useBox, useNarrow } from '../box';
import { Frame } from './Frame';
import { FRAME_UI, useLang } from './lang';
import s from '../shell.module.scss';

type CompareProps = {
  before: ReactNode;
  after: ReactNode;
  /** What the demo can't show: why, a source link, when it flips. */
  beforeNote: ReactNode;
  afterNote: ReactNode;
  height?: number;
  /** One above the other, for demos too wide for half a column (tables). */
  stacked?: boolean;
  /** Offers slow motion, shared by both sides, for demos whose point is how something moves. */
  motion?: boolean;
  /** Offers the Gaps switch, shared by both sides, for demos whose point is spacing. */
  measure?: boolean;
  /** What each side does, in a few words: "Fades both ways". */
  beforeLabel?: string;
  afterLabel?: string;
};

/** The same thing twice: the common version and the better one. */
export function Compare({ before, after, beforeNote, afterNote, height, stacked, motion, measure, beforeLabel, afterLabel }: CompareProps) {
  const ui = FRAME_UI[useLang()];
  const box = useBox();
  const narrow = useNarrow();
  const [shown, setShown] = useState<'before' | 'after'>('after');
  const [slow, setSlow] = useState(false);
  const slowing = motion ? { slow, onSlowChange: setSlow } : {};
  const [gaps, setGaps] = useState(false);
  const measuring = measure ? { gaps, onGapsChange: setGaps } : {};
  // One side at a time: the switch names the verdict in a word, and the side's own phrase goes in
  // the label above the stage, where it has the width to wrap.
  if (box === 'toggle' || (box !== 'band' && narrow && !stacked)) {
    const good = shown === 'after';
    return (
      <div className={s.toggled}>
        <Frame label={<Verdict good={good} words={good ? afterLabel : beforeLabel} />} height={height} tone={good ? 'good' : 'bad'} {...measuring}>
          <div key={shown} className={s.toggledStage}>
            {good ? after : before}
          </div>
        </Frame>
        <SegmentedControl
          className={s.toggle}
          label="Compare"
          value={shown}
          onValueChange={setShown}
          segments={[
            { value: 'before', label: ui.avoid },
            { value: 'after', label: ui.prefer },
          ]}
        />
        <p className={s.note}>{good ? afterNote : beforeNote}</p>
      </div>
    );
  }
  const own = box !== 'band';
  return (
    <div className={cx(s.compare, stacked && s.stacked, box === 'plate' && s.plate)}>
      <div className={s.side}>
        <Frame label={<Verdict good={false} words={own ? beforeLabel : undefined} />} height={height} tone="bad" {...slowing} {...measuring}>
          {before}
        </Frame>
        <p className={s.note}>{beforeNote}</p>
      </div>
      <div className={s.side}>
        <Frame label={<Verdict good words={own ? afterLabel : undefined} />} height={height} tone="good" {...slowing} {...measuring}>
          {after}
        </Frame>
        <p className={s.note}>{afterNote}</p>
      </div>
    </div>
  );
}

function Verdict({ good, words }: { good: boolean; words?: string }) {
  const ui = FRAME_UI[useLang()];
  return (
    <span className={s.verdict} data-good={good ? '' : undefined}>
      {good ? <CheckIcon size={14} /> : <CrossIcon size={14} />}
      {words ?? (good ? ui.prefer : ui.avoid)}
    </span>
  );
}
