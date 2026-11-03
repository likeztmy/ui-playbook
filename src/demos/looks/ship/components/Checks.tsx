import { useEffect, useState } from 'react';
import { Button } from '../../../../ui/Button';
import { CheckList } from '../CheckList';
import { Section } from '../Section';

/**
 * Checks with one still running: success, danger and info side by side, each with its word. Re-run
 * failed runs the failed check again (it fails again: the screenshots did change); the button keeps
 * its width and focus while it runs (C23).
 */
export function Checks() {
  const [rerun, setRerun] = useState(false);
  useEffect(() => {
    if (!rerun) return;
    const t = setTimeout(() => setRerun(false), 3000);
    return () => clearTimeout(t);
  }, [rerun]);
  return (
    <Section
      title="Checks"
      action={
        <Button size="sm" variant="ghost" loading={rerun} loadingLabel="Re-running" onClick={() => setRerun(true)}>
          Re-run failed
        </Button>
      }
    >
      <CheckList
        checks={[
          { name: 'Unit tests', state: 'Passed', outcome: 'passed' },
          { name: 'iOS build', state: 'Running', outcome: 'running' },
          rerun
            ? { name: 'Screenshot diff', state: 'Running', outcome: 'running' }
            : { name: 'Screenshot diff', state: '2 changed', outcome: 'failed' },
          { name: 'Licence scan', state: 'Passed', outcome: 'passed' },
        ]}
      />
    </Section>
  );
}
