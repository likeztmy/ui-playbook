import { Button } from '../../../../ui/Button';
import { Checkbox } from '../../../../ui/Checkbox';
import { FieldSuffix, TextField } from '../../../../ui/Field';
import { Radio, RadioGroup } from '../../../../ui/Radio';
import { Section } from '../Section';
import c from './Components.module.scss';
import p from './Publish.module.scss';

/**
 * A form that waits for Publish: radios for one of three (not a Select, LK#28), a field for an exact
 * share (not a slider, LK#19), a checkbox for an option sent with it (not a switch, LK#6).
 */
export function Publish() {
  return (
    <Section title="Publish 4.2.0" meta="12 changes">
      <div className={p.form}>
        <TextField label="Version" defaultValue="4.2.0" />
        <RadioGroup label="Channel" defaultValue="stable" inline>
          <Radio value="stable" label="Stable" />
          <Radio value="beta" label="Beta" />
          <Radio value="nightly" label="Nightly" />
        </RadioGroup>
        <TextField label="First rollout" className={p.share} defaultValue="25" inputMode="numeric" trailing={<FieldSuffix>%</FieldSuffix>} />
        <Checkbox label="Email subscribers when it’s live" defaultChecked />
        <div className={c.actions}>
          <Button>Save draft</Button>
          <Button variant="primary">Publish</Button>
        </div>
      </div>
    </Section>
  );
}
