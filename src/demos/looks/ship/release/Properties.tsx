import type { ReactNode } from 'react';
import { Badge } from '../../../../ui/Badge';
import { hoursAgo, tone, type Release } from '../model';
import { when } from './story';
import t from './Release.module.scss';

/** The release's facts beside its history: labels in one column, values in the next (C41: none is an en dash). */
export function Properties({ release: r, paused }: { release: Release; paused: boolean }) {
  const rows: [string, ReactNode][] = [
    [
      'Status',
      paused ? (
        <Badge status>Paused</Badge>
      ) : (
        <Badge tone={tone(r.status)} status>
          {r.status}
        </Badge>
      ),
    ],
    ['Platform', r.platform],
    ['Owner', r.owner],
    ['Rollout', r.rollout ? `${r.rollout}% of users` : '–'],
    ['Crash-free', r.crashFree ? `${r.crashFree}%` : '–'],
    ['Updated', when(hoursAgo(r))],
  ];
  return (
    <aside className={t.side} aria-labelledby="ship-properties">
      <h3 id="ship-properties" className={t.sideTitle}>
        Properties
      </h3>
      <dl className={t.props}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
