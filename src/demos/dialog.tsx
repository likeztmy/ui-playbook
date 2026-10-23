import { useRef, useState, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { AlertDialog, Dialog, dialogClasses as ds } from '../ui/Dialog';
import { TextField } from '../ui/Field';
import { Compare, Frame } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const PROJECT = 'Q4 roadmap';

type ConfirmProps = {
  /** Which button takes focus when the dialog opens. */
  focus?: 'cancel' | 'delete';
  title?: string;
  description?: string;
  popupClass?: string;
};

/** Delete a project behind a confirmation. Shows what happened, and resets. */
function DeleteFlow({
  focus = 'cancel',
  title = `Delete “${PROJECT}”?`,
  description = 'The project and its 24 files are deleted for everyone. This can’t be undone.',
  popupClass,
}: ConfirmProps) {
  const [deleted, setDeleted] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null);
  const confirm = useRef<HTMLButtonElement>(null);
  if (deleted) {
    return (
      <div className={s.stack}>
        <p className={s.meter}>
          <b>{PROJECT}</b> was deleted.
        </p>
        <Button size="sm" onClick={() => setDeleted(false)}>
          Reset demo
        </Button>
      </div>
    );
  }
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="danger" />}>Delete project…</AlertDialog.Trigger>
      <AlertDialog.Popup
        title={title}
        description={description}
        className={popupClass}
        initialFocus={focus === 'cancel' ? cancel : confirm}
        actions={
          <>
            <AlertDialog.Close render={<Button ref={cancel} />}>Cancel</AlertDialog.Close>
            <AlertDialog.Close render={<Button ref={confirm} variant="danger-fill" />} onClick={() => setDeleted(true)}>
              Delete project
            </AlertDialog.Close>
          </>
        }
      />
    </AlertDialog.Root>
  );
}

/** A project you can rename in a task dialog or delete behind a confirm. */
function Projects() {
  const [name, setName] = useState(PROJECT);
  const [draft, setDraft] = useState(name);
  const [renaming, setRenaming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  if (deleted)
    return (
      <div className={s.stack}>
        <p className={s.meter}>
          <b>{name}</b> was deleted.
        </p>
        <Button size="sm" onClick={() => setDeleted(false)}>
          Reset demo
        </Button>
      </div>
    );
  return (
    <div className={s.projectRow}>
      <span className={s.projectText}>
        <span className={s.fileName}>{name}</span>
        <span className={s.fileMeta}>24 files</span>
      </span>
      <Dialog.Root
        open={renaming}
        onOpenChange={(o) => {
          setRenaming(o);
          if (o) setDraft(name);
        }}
        // Typed input survives a stray click outside; an untouched dialog doesn't need to.
        disablePointerDismissal={draft !== name}
      >
        <Dialog.Trigger render={<Button size="sm" />}>Rename…</Dialog.Trigger>
        <Dialog.Popup
          title="Rename project"
          initialFocus={input}
          actions={
            <>
              <Dialog.Close render={<Button />}>Cancel</Dialog.Close>
              <Button variant="primary" type="submit" form="rename-form" disabled={!draft.trim()}>
                Rename
              </Button>
            </>
          }
        >
          <form
            id="rename-form"
            onSubmit={(e) => {
              e.preventDefault();
              setName(draft.trim());
              setRenaming(false);
            }}
          >
            <TextField label="Name" inputRef={input} value={draft} onValueChange={setDraft} onFocus={(e) => e.target.select()} />
          </form>
        </Dialog.Popup>
      </Dialog.Root>
      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button size="sm" variant="danger" />}>Delete…</AlertDialog.Trigger>
        <AlertDialog.Popup
          title={`Delete “${name}”?`}
          description="The project and its 24 files are deleted for everyone. This can’t be undone."
          initialFocus={cancel}
          actions={
            <>
              <AlertDialog.Close render={<Button ref={cancel} />}>Cancel</AlertDialog.Close>
              <AlertDialog.Close render={<Button variant="danger-fill" />} onClick={() => setDeleted(true)}>
                Delete project
              </AlertDialog.Close>
            </>
          }
        />
      </AlertDialog.Root>
    </div>
  );
}

export function DialogScene() {
  return (
    <Frame label="Project" height={160}>
      <Projects />
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

/** A dialog drawn in place, without the scrim, for side-by-side stills. */
function Still({ title, description, actions, actionClass }: { title: string; description: string; actions: [string, 'secondary' | 'primary' | 'danger-fill'][]; actionClass?: string }) {
  return (
    <div className={cx(ds.popup, ds.sm)} role="presentation">
      <h3 className={ds.title}>{title}</h3>
      <p className={ds.description}>{description}</p>
      <div className={ds.footer}>
        {actions.map(([label, variant]) => (
          <Button key={label} variant={variant} className={actionClass}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

const AFTER_TEXT = {
  title: `Delete “${PROJECT}”?`,
  description: 'The project and its 24 files are deleted for everyone. This can’t be undone.',
};

export function DialogWording() {
  return (
    <Compare
      height={220}
      before={<Still title="Are you sure?" description="This action cannot be undone." actions={[['Cancel', 'secondary'], ['OK', 'primary']]} />}
      after={<Still {...AFTER_TEXT} actions={[['Cancel', 'secondary'], ['Delete project', 'danger-fill']]} />}
      beforeNote="Sure of what? OK could mean “do it” or “understood”, and blue says go."
      afterNote="The title is the decision with its object; the button repeats the verb, so the answer reads without the question."
    />
  );
}

export function DialogFocus() {
  return (
    <Compare
      height={140}
      before={<DeleteFlow focus="delete" />}
      after={<DeleteFlow />}
      beforeNote={
        <>
          Enter pressed out of habit, to get past a prompt, deletes the project. Answers to frequent prompts become reflexes (
          <a href="https://alistapart.com/article/neveruseawarning/">Aza Raskin</a>).
        </>
      }
      afterNote="Enter backs out; deleting takes a deliberate Tab or click."
    />
  );
}

export function DialogMotion() {
  return (
    <Compare
      height={140}
      before={<DeleteFlow popupClass={m.dropIn} />}
      after={<DeleteFlow />}
      beforeNote={
        <>
          A 50px journey for a box that belongs in place, as in{' '}
          <a href="https://getbootstrap.com/docs/5.3/components/modal/">Bootstrap’s modal</a>.
        </>
      }
      afterNote="Nothing travels: the dialog grows where it will sit, and the eye is already there."
    />
  );
}

export function DialogPreview(): ReactNode {
  return <Still {...AFTER_TEXT} actions={[['Cancel', 'secondary'], ['Delete project', 'danger-fill']]} />;
}
