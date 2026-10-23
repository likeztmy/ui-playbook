import { CircleCheck } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { AlertDialog } from '../ui/Dialog';
import { cx } from '../ui/cx';
import { ToastProvider, useToast } from '../ui/Toast';
import { Compare, Frame } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

/** A demo area whose toasts rise inside it, not at the bottom of the window. */
function ToastStage({ children, limit, className }: { children: ReactNode; limit?: number; className?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div ref={setContainer} className={cx(s.toastStage, className)}>
      <ToastProvider container={container} contained limit={limit}>
        {children}
      </ToastProvider>
    </div>
  );
}

const START = ['Q4 roadmap.fig', 'Brand guide.pdf', 'Metrics.csv'];

/** Files you can delete; a toast offers Undo. */
function Files({ toastClass }: { toastClass?: string }) {
  const [files, setFiles] = useState(START);
  const toast = useToast();
  const remove = (f: string) => {
    const at = files.indexOf(f);
    setFiles((list) => list.filter((x) => x !== f));
    toast({
      title: `Deleted “${f}”`,
      action: { label: 'Undo', onClick: () => setFiles((list) => [...list.slice(0, at), f, ...list.slice(at)]) },
    });
  };
  return (
    <div className={cx(s.toastFiles, toastClass)}>
      {files.map((f) => (
        <div key={f}>
          <span>{f}</span>
          <Button size="sm" variant="danger" onClick={() => remove(f)}>
            Delete
          </Button>
        </div>
      ))}
      {!files.length && (
        <Button size="sm" onClick={() => setFiles(START)}>
          Reset demo
        </Button>
      )}
    </div>
  );
}

function Triggers() {
  const toast = useToast();
  return (
    <div className={s.row}>
      <Button onClick={() => toast({ title: 'Link copied', type: 'success' })}>Copy link</Button>
      <Button onClick={() => toast({ title: 'Sync paused while offline', type: 'warning' })}>Go offline</Button>
      <Button onClick={() => toast({ title: 'Couldn’t export: the file is locked', type: 'error' })}>Export</Button>
    </div>
  );
}

export function ToastLive() {
  return (
    <Frame label="Files" height={320}>
      <ToastStage>
        <div className={s.stack}>
          <Files />
          <Triggers />
        </div>
      </ToastStage>
    </Frame>
  );
}

export function ToastKinds() {
  return (
    <Frame label="Kinds" height={280}>
      <ToastStage>
        <Triggers />
      </ToastStage>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

/** The mistake: ask first, for something that could simply be undone. */
function ConfirmFirst() {
  const [files, setFiles] = useState(START);
  return (
    <div className={s.toastFiles}>
      {files.map((f) => (
        <div key={f}>
          <span>{f}</span>
          <AlertDialog.Root>
            <AlertDialog.Trigger render={<Button size="sm" variant="danger" />}>Delete</AlertDialog.Trigger>
            <AlertDialog.Popup
              title={`Delete “${f}”?`}
              description="You can restore it from Trash for 30 days."
              actions={
                <>
                  <AlertDialog.Close render={<Button />}>Cancel</AlertDialog.Close>
                  <AlertDialog.Close render={<Button variant="danger-fill" />} onClick={() => setFiles((l) => l.filter((x) => x !== f))}>
                    Delete
                  </AlertDialog.Close>
                </>
              }
            />
          </AlertDialog.Root>
        </div>
      ))}
      {!files.length && (
        <Button size="sm" onClick={() => setFiles(START)}>
          Reset demo
        </Button>
      )}
    </div>
  );
}

export function ToastUndo() {
  return (
    <Compare
      height={260}
      before={<ConfirmFirst />}
      after={
        <ToastStage>
          <Files />
        </ToastStage>
      }
      beforeNote={
        <>
          Asked every time, the answer becomes a reflex, and the reflex is still there the one time it matters (
          <a href="https://alistapart.com/article/neveruseawarning/">Aza Raskin</a>). This one even says the file can be restored.
        </>
      }
      afterNote="The rare mistake costs one click; the common case costs nothing."
    />
  );
}

export function ToastTone() {
  return (
    <Compare
      height={240}
      before={
        <ToastStage className={m.filledToasts}>
          <Triggers />
        </ToastStage>
      }
      after={
        <ToastStage>
          <Triggers />
        </ToastStage>
      }
      beforeNote={
        <>
          A slab of colour reads as an alarm whatever it says. <a href="https://github.com/CodeSeven/toastr">toastr</a> fills each toast this way.
        </>
      }
      afterNote={
        <>
          The words do the talking; the icon tells the kind at a glance. <a href="/principles/colour-means-one-thing">Colour means one thing</a>.
        </>
      }
    />
  );
}

export function ToastLimit() {
  const Burst = () => {
    const toast = useToast();
    return (
      <Button
        onClick={() => {
          for (let i = 1; i <= 6; i++) toast({ title: `Uploaded photo ${i} of 6`, type: 'success' });
        }}
      >
        Upload 6 photos
      </Button>
    );
  };
  return (
    <Compare
      height={340}
      before={
        <ToastStage limit={10}>
          <Burst />
        </ToastStage>
      }
      after={
        <ToastStage>
          <Burst />
        </ToastStage>
      }
      beforeNote="Six messages that say nearly the same thing cover what you were doing."
      afterNote="Three at most, the rest wait. Better still, say it once: “Uploaded 6 photos”."
    />
  );
}

export function ToastPreview() {
  return (
    <div className={s.toastStill}>
      <CircleCheck className={s.toastStillIcon} size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
      <span>Deleted “Q4 roadmap”</span>
      <Button>Undo</Button>
    </div>
  );
}
