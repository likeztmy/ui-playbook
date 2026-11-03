import { TextField } from '../../../../ui/Field';
import { Tabs } from '../../../../ui/Tabs';
import { Section } from '../Section';
import c from './Components.module.scss';

const text = 'Faster launch: the home screen shows before sync finishes.';

/** Tabs over a text area: the notes as written, and as they'll read. */
export function Notes() {
  return (
    <Section title="Release notes">
      <Tabs.Root defaultValue="write">
        <Tabs.List>
          <Tabs.Tab value="write">Write</Tabs.Tab>
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="write" className={c.tab}>
          <TextField label="Release notes" className={c.bare} multiline defaultValue={text} />
        </Tabs.Panel>
        <Tabs.Panel value="preview" className={c.tab}>
          <p className={c.preview}>{text}</p>
        </Tabs.Panel>
      </Tabs.Root>
    </Section>
  );
}
