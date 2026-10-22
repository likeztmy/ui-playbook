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

export function DialogConfirmLive() {
  return (
    <Frame label="Confirm · a rare action that can’t be undone" height={160}>
      <DeleteFlow />
    </Frame>
  );
}

/** Rename in a task dialog: one field, Enter submits, Esc cancels. */
function RenameFlow() {
  const [name, setName] = useState(PROJECT);
  const [draft, setDraft] = useState(name);
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const dirty = draft !== name;
  return (
    <div className={s.stack}>
      <p className={s.meter}>
        Project: <b>{name}</b>
      </p>
      <Dialog.Root
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setDraft(name);
        }}
        // Typed input survives a stray click outside; an untouched dialog doesn't need to.
        disablePointerDismissal={dirty}
      >
        <Dialog.Trigger render={<Button />}>Rename…</Dialog.Trigger>
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
              setOpen(false);
            }}
          >
            <TextField label="Name" inputRef={input} value={draft} onValueChange={setDraft} onFocus={(e) => e.target.select()} />
          </form>
        </Dialog.Popup>
      </Dialog.Root>
    </div>
  );
}

export function DialogTaskLive() {
  return (
    <Frame label="Task · a short job with one field" height={160}>
      <RenameFlow />
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
      beforeNote="Sure of what? The title names nothing, the body adds nothing, and OK could mean “do it” or “understood”. Blue says go."
      afterNote="The title is the decision, with its object. The body says the consequence. The button repeats the verb, in danger."
    />
  );
}

export function DialogFocus() {
  return (
    <Compare
      height={140}
      before={<DeleteFlow focus="delete" />}
      after={<DeleteFlow />}
      beforeNote="Opens with Delete project focused. Someone pressing Enter to get past an expected prompt deletes the project."
      afterNote="Focus starts on Cancel, the safe choice: Enter backs out. Deleting takes a deliberate Tab or click."
    />
  );
}

export function DialogCorners() {
  return (
    <Compare
      height={220}
      before={<Still {...AFTER_TEXT} actions={[['Cancel', 'secondary'], ['Delete project', 'danger-fill']]} actionClass={m.squareActions} />}
      after={<Still {...AFTER_TEXT} actions={[['Cancel', 'secondary'], ['Delete project', 'danger-fill']]} />}
      beforeNote="The concentric formula applied blindly: radius-xl 18 − padding 20 is below 0, so the buttons go square and look foreign to the rest of the product."
      afterNote="Padding is more than the radius, so the arcs no longer meet and the formula has nothing to keep equal. The buttons keep their own pill."
    />
  );
}

export function DialogMotion() {
  return (
    <Compare
      height={140}
      before={<DeleteFlow popupClass={m.dropIn} />}
      after={<DeleteFlow />}
      beforeNote="Drops 32px from above over 300ms, and climbs back out just as slowly. A big move for a box that appears in place."
      afterNote="Grows from enter-scale (0.96) on the gentle spring, fading in over duration-base; leaves in duration-fast, ease-in, no spring. The scrim fades with it."
    />
  );
}

export function DialogPreview(): ReactNode {
  return <Still {...AFTER_TEXT} actions={[['Cancel', 'secondary'], ['Delete project', 'danger-fill']]} />;
}
