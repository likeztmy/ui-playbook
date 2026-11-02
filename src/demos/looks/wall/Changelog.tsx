import { TextField } from '../../../ui/Field';
import { Tabs } from '../../../ui/Tabs';
import s from './Wall.module.scss';

/** Tabs over a text area: what goes in the release notes. */
export function Changelog() {
  return (
    <section className={s.card} aria-label="Release notes">
      <Tabs.Root defaultValue="write">
        <Tabs.List>
          <Tabs.Tab value="write">Write</Tabs.Tab>
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="write">
          <TextField label="Release notes" multiline defaultValue="Faster launch: the home screen shows before sync finishes." />
        </Tabs.Panel>
        <Tabs.Panel value="preview">
          <p>Faster launch: the home screen shows before sync finishes.</p>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  );
}
