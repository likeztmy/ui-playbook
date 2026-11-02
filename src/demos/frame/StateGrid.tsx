import type { CSSProperties, ReactNode } from 'react';
import { Frame } from './Frame';
import s from '../shell.module.scss';

export const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'] as const;
export type State = (typeof STATES)[number];

/** The `data-pin` value that holds each state still. Disabled is a prop. */
export const statePin: Record<State, string | undefined> = {
  Default: undefined,
  Hover: 'hover',
  Pressed: 'hover active',
  Focus: 'focus',
  Disabled: undefined,
};

type StateGridProps = {
  rows: { name: string; render: (state: State) => ReactNode }[];
};

/** Every variant × every state, pinned, so they can be read side by side. */
export function StateGrid({ rows }: StateGridProps) {
  return (
    <Frame label="All states" height={0} still>
      <div className={s.grid} style={{ '--cols': `auto repeat(${STATES.length}, 1fr)` } as CSSProperties}>
        <span />
        {STATES.map((state) => (
          <span key={state} className={s.head}>
            {state}
          </span>
        ))}
        {rows.map((row) => (
          <div key={row.name} className={s.row}>
            <span className={s.name}>{row.name}</span>
            {STATES.map((state) => (
              <div key={state} className={s.cell} data-state={state}>
                {row.render(state)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}
