import { Radio, RadioGroup } from '../../../../ui/Radio';
import { Switch } from '../../../../ui/Switch';
import { Section } from '../Section';
import n from './Notify.module.scss';

/** Settings that apply as they change: switches for what (LK#20), radios for where (C31). No Save. */
export function Notify() {
  return (
    <Section title="Notifications">
      <div className={n.switches}>
        <Switch label="A release goes out" defaultChecked />
        <Switch label="A check fails" defaultChecked />
        <Switch label="Weekly digest" />
      </div>
      <RadioGroup label="Send to" defaultValue="email" inline>
        <Radio value="email" label="Email" />
        <Radio value="chat" label="Team chat" />
      </RadioGroup>
    </Section>
  );
}
