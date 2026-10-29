import type { ReactNode } from 'react';
import { Button } from '../../ui/Button';
import { TextField } from '../../ui/Field';
import { cx } from '../../ui/cx';
import { Members } from './Members';
import s from './boundary.module.scss';

/**
 * One section of the settings screen. `boxed` draws it as the agents' builds did: a card with a
 * header band and a footer band, three regions a section.
 */
function Section({
  title,
  action,
  footer,
  danger,
  boxed,
  children,
}: {
  title: string;
  action?: ReactNode;
  footer?: ReactNode;
  danger?: boolean;
  boxed?: boolean;
  children: ReactNode;
}) {
  if (boxed)
    return (
      <section className={cx(s.card, danger && s.dangerCard)}>
        <header className={s.cardHead}>
          <h4 className={s.heading}>{title}</h4>
          {action}
        </header>
        <div className={s.cardBody}>{children}</div>
        {footer && <footer className={s.cardFoot}>{footer}</footer>}
      </section>
    );
  return (
    <section className={cx(s.section, danger && s.danger)}>
      <header className={s.sectionHead}>
        <h4 className={s.heading}>{title}</h4>
        {action}
      </header>
      {children}
      {footer && <div className={s.sectionFoot}>{footer}</div>}
    </section>
  );
}

/** A project's settings: General, Access, Danger zone. */
export function Settings({ boxed }: { boxed?: boolean }) {
  return (
    <div className={s.settings}>
      <Section boxed={boxed} title="General" footer={<Button variant="primary">Save</Button>}>
        <div className={s.fields}>
          <TextField label="Name" defaultValue="Shop app" />
          <TextField label="Description" defaultValue="The iOS and Android shopping app." />
        </div>
      </Section>
      <Section boxed={boxed} title="Access" action={<Button size="sm">Invite</Button>}>
        <Members />
      </Section>
      <Section boxed={boxed} danger title="Danger zone" footer={<Button variant="danger">Delete project</Button>}>
        <p className={s.muted}>Deletes the project, its 42 issues and their history. This can’t be undone.</p>
      </Section>
    </div>
  );
}
