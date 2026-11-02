import { Plus } from 'lucide-react';
import { Button } from '../../../ui/Button';
import s from './Wall.module.scss';
import c from './Empty.module.scss';

/** An empty state that names the next step. */
export function Empty() {
  return (
    <section className={`${s.card} ${c.empty}`} aria-label="Hotfixes">
      <h3>No hotfixes</h3>
      <p className={s.meta}>A hotfix ships to everyone on 4.2.0 at once.</p>
      <Button size="sm" variant="primary">
        <Plus size={16} aria-hidden /> New hotfix
      </Button>
    </section>
  );
}
