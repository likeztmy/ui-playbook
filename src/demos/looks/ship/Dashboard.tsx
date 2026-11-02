import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { SegmentedControl } from '../../../ui/SegmentedControl';
import { useState } from 'react';
import { Bars } from './Bars';
import { Donut } from './Donut';
import { Line } from './Line';
import { Shell } from './Shell';
import s from './Page.module.scss';
import d from './Dashboard.module.scss';

const stats = [
  { label: 'Live releases', value: '9', delta: '+2', up: true, note: 'this month' },
  { label: 'Crash-free', value: '99.82%', delta: '+0.12', up: true, note: 'since 4.1.3' },
  { label: 'Adoption of 4.1', value: '64%', delta: '+18', up: true, note: 'this week' },
  { label: 'Time to roll out', value: '2.4 d', delta: '−0.6', up: false, note: 'faster than Sep' },
];

const recent = [
  ['Mira Chen', 'raised 4.2.0 iOS to 25%', '2h'],
  ['Jonas Berg', 'halted 4.1.3 Android', '1d'],
  ['Ada Okafor', 'shipped 2026.44 to the web', '1d'],
  ['Sam Rivera', 'opened 4.3.0 Widgets', '4d'],
  ['Ship', 'finished checks on 4.2.0', '5h'],
];

/** The overview: four numbers, three charts, and what just happened. */
export function Dashboard() {
  const [range, setRange] = useState('14d');
  return (
    <Shell section="dashboard" place="Dashboard">
      <div className={s.bar}>
        <SegmentedControl
          label="Range"
          value={range}
          onValueChange={setRange}
          segments={[
            { value: '7d', label: '7 days' },
            { value: '14d', label: '14 days' },
            { value: '30d', label: '30 days' },
          ]}
        />
      </div>
      <div className={d.grid}>
        {stats.map(({ label, value, delta, up, note }) => (
          <section key={label} className={s.card} aria-label={label}>
            <p className={s.meta}>{label}</p>
            <div className={d.big}>{value}</div>
            <p className={s.meta}>
              <span className={d.delta} data-tone="success">
                {up ? <ArrowUpRight size={14} aria-hidden /> : <ArrowDownRight size={14} aria-hidden />}
                {delta}
              </span>{' '}
              {note}
            </p>
          </section>
        ))}
        <div className={d.wide}>
          <Bars />
        </div>
        <div className={d.half}>
          <Donut />
        </div>
        <div className={d.wide}>
          <Line />
        </div>
        <section className={`${s.card} ${d.half}`} aria-label="Recent">
          <div className={s.head}>
            <h3>Recent</h3>
          </div>
          <ul className={d.rows}>
            {recent.map(([who, what, when]) => (
              <li key={what}>
                <span className={d.grow}>
                  <strong>{who}</strong> {what}
                </span>
                <span className={s.meta}>{when}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
