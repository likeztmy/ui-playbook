import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { ShoppingBag, Tag, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../../ui/Button';
import { dialogClasses as d } from '../../ui/Dialog';
import { usePortalContainer } from '../../ui/portal';
import { Switch } from '../../ui/Switch';
import { useToast } from '../../ui/Toast';
import { Tip } from '../../ui/Tooltip';
import { AssigneePicker } from './AssigneePicker';
import { Face } from './Face';
import { NOBODY, priorityName, statusName, type Priority, type Status } from './model';
import { LABEL_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from './options';
import { PEOPLE } from './people';
import { PickMenu } from './PickMenu';
import { PriorityIcon } from './PriorityIcon';
import { StatusIcon } from './StatusIcon';
import type { Track } from './useTrack';
import s from './NewIssue.module.scss';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: Track;
  /** The status it starts in: the group whose + opened it, or Todo. */
  status: Status;
  /** Opened from a group's +: its status wins over a kept draft's. */
  from?: boolean;
  onCreated: (n: number) => void;
};

/**
 * A new issue as it will read: a title as large as the issue's own, a description, then each property
 * as a chip that says its value once set. An empty title is a problem only once you try to
 * create it or leave the field, and stops being one with the first letter. Create more keeps it open
 * with the properties as they were, for a run of similar issues.
 */
export function NewIssue({ open, onOpenChange, track, status: initial, from, onCreated }: Props) {
  const toast = useToast();
  const container = usePortalContainer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(initial);
  const [priority, setPriority] = useState<Priority>('none');
  const [assignee, setAssignee] = useState<string>(track.place === 'mine' ? 'me' : NOBODY);
  const [labels, setLabels] = useState<string[]>([]);
  const [more, setMore] = useState(false);
  const [tried, setTried] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const dirty = useRef(false);
  const error = useId();

  // What you wrote outlives closing it: it's there when you open it again, until it's created or
  // discarded. A group's + still sets where it goes.
  const kept = !!(title.trim() || description.trim());
  const clear = () => {
    setTitle('');
    setDescription('');
    setPriority('none');
    setAssignee(track.place === 'mine' ? 'me' : NOBODY);
    setLabels([]);
    setTried(false);
    dirty.current = false;
  };
  useEffect(() => {
    if (!open) return;
    if (!kept) clear();
    if (!kept || from) setStatus(initial);
  }, [open]);

  const dismiss = (o: boolean) => {
    if (!o && kept)
      toast({
        title: 'Draft kept',
        action: {
          label: 'Discard',
          onClick: () => {
            clear();
            setStatus(initial);
          },
        },
      });
    onOpenChange(o);
  };

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title.trim()) {
      setTried(true);
      field.current?.focus();
      return;
    }
    const n = track.create({ title: title.trim(), description, status, priority, assignee: assignee === NOBODY ? undefined : assignee, labels });
    onCreated(n);
    setTitle('');
    setDescription('');
    setTried(false);
    dirty.current = false;
    if (!more) return onOpenChange(false);
    // Create more keeps the properties: the next of a run of similar issues.
    field.current?.focus();
  };

  // ⌘↵ from anywhere in it, the description included.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      form.current?.requestSubmit();
    }
  };

  const who = assignee === NOBODY ? null : PEOPLE[assignee];
  const invalid = tried && !title.trim();
  const chip = (children: ReactNode) => (
    <button type="button" className={s.chip}>
      {children}
    </button>
  );

  return (
    <BaseDialog.Root open={open} onOpenChange={dismiss}>
      <BaseDialog.Portal container={container}>
        <BaseDialog.Backdrop className={d.backdrop} />
        <BaseDialog.Viewport className={`${d.viewport} ${s.viewport}`}>
          <BaseDialog.Popup className={s.popup} initialFocus={field}>
            <form ref={form} className={s.form} onSubmit={submit} onKeyDown={onKeyDown} noValidate>
              <div className={s.top}>
                <BaseDialog.Title className={s.heading}>New issue</BaseDialog.Title>
                <span className={s.where}>in</span>
                <span className={s.team}>
                  <span className={s.mark} aria-hidden>
                    <ShoppingBag size={11} strokeWidth={2} />
                  </span>
                  Shop app
                </span>
                <Tip label="Close">
                  <BaseDialog.Close render={<Button variant="ghost" icon size="sm" aria-label="Close" className={s.close} />}>
                    <X size={16} strokeWidth={1.5} aria-hidden />
                  </BaseDialog.Close>
                </Tip>
              </div>

              <input
                ref={field}
                className={s.title}
                aria-label="Title"
                placeholder="Issue title"
                value={title}
                onChange={(e) => {
                  dirty.current = true;
                  setTitle(e.target.value);
                }}
                // Leaving it empty after typing is finishing; tabbing past it untouched isn't.
                onBlur={() => dirty.current && !title.trim() && setTried(true)}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? error : undefined}
                autoComplete="off"
              />
              {invalid && (
                <p id={error} className={s.error}>
                  Give it a title
                </p>
              )}
              <textarea
                className={s.description}
                aria-label="Description"
                placeholder="Add description…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />

              <div className={s.props} role="group" aria-label="Properties">
                <PickMenu
                  options={STATUS_OPTIONS}
                  value={status}
                  onPick={(v) => setStatus(v as Status)}
                  trigger={chip(
                    <>
                      <StatusIcon status={status} />
                      {statusName(status)}
                    </>,
                  )}
                />
                <PickMenu
                  options={PRIORITY_OPTIONS}
                  value={priority}
                  onPick={(v) => setPriority(v as Priority)}
                  trigger={chip(
                    <>
                      <PriorityIcon priority={priority} />
                      {priority === 'none' ? 'Priority' : priorityName(priority)}
                    </>,
                  )}
                />
                <AssigneePicker
                  value={assignee}
                  onPick={setAssignee}
                  trigger={chip(
                    <>
                      <Face id={who?.id} size="sm" />
                      {who ? who.name : 'Assignee'}
                    </>,
                  )}
                />
                <PickMenu
                  multiple
                  options={LABEL_OPTIONS}
                  value={labels}
                  onPick={setLabels}
                  trigger={chip(
                    <>
                      <Tag size={14} strokeWidth={1.5} aria-hidden className={s.tag} />
                      {labels.length === 0 ? 'Labels' : labels.length <= 2 ? labels.join(', ') : `${labels.length} labels`}
                    </>,
                  )}
                />
              </div>

              <div className={s.footer}>
                <Switch label="Create more" placement="start" checked={more} onCheckedChange={setMore} className={s.more} />
                <Tip keys={['⌘', '↵']}>
                  <Button variant="primary" type="submit">
                    Create issue
                  </Button>
                </Tip>
              </div>
            </form>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
