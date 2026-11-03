import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { SegmentedControl } from '../../../../ui/SegmentedControl';
import { Bars } from './Bars';
import { Donut } from './Donut';
import { Line } from './Line';
import { live } from '../model';
import { Recent } from './Recent';
import { SPANS, type Span } from './span';
import d from './Dashboard.module.scss';

const figures = [
  { label: 'Live releases', value: String(live), delta: '+2', up: true, note: 'this month' },
  { label: 'Crash-free', value: '99.82%', delta: '+0.12', up: true, note: 'since 4.1.3' },
  { label: 'Adoption of 4.1', value: '64%', delta: '+18', up: true, note: 'this week' },
  { label: 'Time to roll out', value: '2.4 d', delta: '−0.6', up: false, note: 'since Sep' },
];

/**
 * The overview. Four figures read together, so one row with a line between them; the charts are
 * sections held by their headings and space. No box on this page.
 */
export function Dashboard() {
  const [span, setSpan] = useState<Span>(14);
  return (
    <div className={d.page}>
      <SegmentedControl
        label="Range"
        value={String(span)}
        onValueChange={(v) => setSpan(Number(v) as Span)}
        segments={SPANS.map((n) => ({ value: String(n), label: `${n} days` }))}
      />
      <dl className={d.figures}>
        {figures.map(({ label, value, delta, up, note }) => (
          <div key={label} className={d.figure}>
            <dt>{label}</dt>
            <dd className={d.value}>{value}</dd>
            <dd className={d.note}>
              <span className={d.delta}>
                {up ? <ArrowUpRight size={14} aria-hidden /> : <ArrowDownRight size={14} aria-hidden />}
                {delta}
              </span>{' '}
              {note}
            </dd>
          </div>
        ))}
      </dl>
      <div className={d.charts}>
        <Bars span={span} className={d.wide} />
        <Donut span={span} />
        <Line span={span} className={d.wide} />
        <Recent />
      </div>
    </div>
  );
}
