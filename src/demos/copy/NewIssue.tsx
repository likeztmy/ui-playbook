import { Button } from '../../ui/Button';
import { TextField } from '../../ui/Field';
import s from './copy.module.scss';

/**
 * A tracker's new-issue panel. `filler` adds what an agent's build put above the first field:
 * an eyebrow, a slogan for a title and a line under it.
 */
export function NewIssue({ filler }: { filler?: boolean }) {
  return (
    <form className={s.panel} onSubmit={(e) => e.preventDefault()}>
      <header className={s.head}>
        {filler && <span className={s.eyebrow}>Make it happen</span>}
        <h3 className={s.title}>{filler ? 'Every improvement starts here.' : 'New issue'}</h3>
        {filler && <p className={s.sub}>Give your next step a little clarity.</p>}
      </header>
      <TextField label="Title" />
      <TextField label="Description" multiline />
      <div className={s.actions}>
        <Button>Cancel</Button>
        <Button variant="primary" type="submit">
          Create issue
        </Button>
      </div>
    </form>
  );
}
