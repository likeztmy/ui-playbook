import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../ui/Button';
import r from '../Rows.module.scss';
import { Section } from '../Section';
import c from './Components.module.scss';

/** An empty section: what goes here, then the action that adds it. Each press drafts the next hotfix. */
export function Hotfixes() {
  const [drafted, setDrafted] = useState(0);
  return (
    <Section title="Hotfixes">
      {drafted ? (
        <ul className={r.rows}>
          {Array.from({ length: drafted }, (_, i) => (
            <li key={i}>
              <span className={r.grow}>4.2.{i + 1}</span>
              <span className={r.muted}>Draft</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={c.note}>No hotfixes yet. A hotfix goes to everyone on 4.2.0 at once.</p>
      )}
      <div>
        <Button size="sm" onClick={() => setDrafted((n) => n + 1)}>
          <Plus size={16} aria-hidden /> New hotfix
        </Button>
      </div>
    </Section>
  );
}
