import { Button } from '../../../../ui/Button';
import { CheckList } from '../CheckList';
import { Section } from '../Section';

/** Checks with one still running: success, danger and info side by side, each with its word. */
export function Checks() {
  return (
    <Section
      title="Checks"
      action={
        <Button size="sm" variant="ghost">
          Re-run failed
        </Button>
      }
    >
      <CheckList
        checks={[
          { name: 'Unit tests', state: 'Passed', outcome: 'passed' },
          { name: 'iOS build', state: 'Running', outcome: 'running' },
          { name: 'Screenshot diff', state: '2 changed', outcome: 'failed' },
          { name: 'Licence scan', state: 'Passed', outcome: 'passed' },
        ]}
      />
    </Section>
  );
}
