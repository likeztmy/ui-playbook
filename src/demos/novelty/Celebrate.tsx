import { Compare } from '../shell';
import { Tasks } from './Tasks';

/** Tick off a day: confetti on every task, or once, when the day is done. */
export function NoveltyCelebrate() {
  return (
    <Compare
      beforeLabel="Confetti on every tick"
      afterLabel="Confetti on the last tick"
      height={380}
      before={<Tasks every />}
      after={<Tasks />}
      beforeNote="Confetti on every tick. A few ticks in, it's background, and it still plays over the next box you reach for."
      afterNote="A tick is just a tick. The day's last one gets the celebration, and because it's the only one, it's seen."
    />
  );
}
