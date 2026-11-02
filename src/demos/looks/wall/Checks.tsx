import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import { Button } from '../../../ui/Button';
import s from './Wall.module.scss';

const checks = [
  { name: 'Unit tests', state: 'Passed', tone: 'success', Icon: CircleCheck },
  { name: 'iOS build', state: 'Running', tone: 'warning', Icon: LoaderCircle },
  { name: 'Screenshot diff', state: '2 changed', tone: 'danger', Icon: CircleX },
  { name: 'Licence scan', state: 'Passed', tone: 'success', Icon: CircleCheck },
] as const;

/** Status as icon and word, never colour alone. */
export function Checks() {
  return (
    <section className={s.card} aria-label="Checks">
      <div className={s.head}>
        <h3>Checks</h3>
        <Button size="sm" variant="ghost">
          Re-run failed
        </Button>
      </div>
      <ul className={s.rows}>
        {checks.map(({ name, state, tone, Icon }) => (
          <li key={name}>
            <Icon size={16} data-tone={tone} aria-hidden />
            <span className={s.grow}>{name}</span>
            <span className={s.muted}>{state}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
