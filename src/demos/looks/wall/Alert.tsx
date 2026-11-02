import { TriangleAlert } from 'lucide-react';
import { Button } from '../../../ui/Button';
import s from './Wall.module.scss';
import c from './Alert.module.scss';

/** The danger colours: a soft fill, its text and an action. */
export function Alert() {
  return (
    <section className={`${s.card} ${c.alert}`} aria-label="Failed release">
      <TriangleAlert size={16} aria-hidden />
      <div className={s.grow}>
        <strong>4.1.2 failed 2 checks</strong>
        <p className={c.text}>Screenshot diff changed on two screens.</p>
      </div>
      <Button size="sm">View</Button>
    </section>
  );
}
