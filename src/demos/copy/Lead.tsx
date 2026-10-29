import { Compare } from '../shell';
import { NewIssue } from './NewIssue';

/** The page's own scene: the same panel, with and without three lines that could top any form. */
export function CopyLead() {
  return (
    <Compare
      height={420}
      beforeLabel="Three lines before the first field"
      afterLabel="The task, then the field"
      before={<NewIssue filler />}
      after={<NewIssue />}
      beforeNote="From an agent’s tracker build. Each line could sit above any form in any product, and each is read before the Title field it pushes down."
      afterNote="The panel is named for the task, in the words of the button that opened it. Everything under the name is the work."
    />
  );
}
