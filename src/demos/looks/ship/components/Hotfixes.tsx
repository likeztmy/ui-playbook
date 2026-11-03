import { Plus } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { Section } from '../Section';
import c from './Components.module.scss';

/** An empty section: what goes here, then the action that adds it. */
export function Hotfixes() {
  return (
    <Section title="Hotfixes">
      <p className={c.meta}>No hotfixes yet. A hotfix goes to everyone on 4.2.0 at once.</p>
      <div>
        <Button size="sm">
          <Plus size={16} aria-hidden /> New hotfix
        </Button>
      </div>
    </Section>
  );
}
