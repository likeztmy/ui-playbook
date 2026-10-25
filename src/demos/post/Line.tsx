import { Archive, ArchiveRestore, Mail, MailOpen, Star } from "lucide-react";
import { Button } from "../../ui/Button";
import { Checkbox } from "../../ui/Checkbox";
import { ContextMenu, Menu } from "../../ui/Menu";
import { Tip } from "../../ui/Tooltip";
import { latest, snippet, unread, type Conversation } from "./model";
import { participants } from "./people";
import { Marked } from "./Marked";
import type { Post } from "./usePost";
import s from "./List.module.scss";

const ic = {
  size: 16,
  strokeWidth: 1.5,
  nonScalingStroke: true,
  "aria-hidden": true,
} as const;

type Props = {
  c: Conversation;
  post: Post;
  rowRef?: (el: HTMLButtonElement | null) => void;
  /** Holds a state still, e.g. "hover", for the state matrix. */
  pin?: string;
};

/** One conversation in the list: who, what, when; its actions over the time on hover. */
export function Line({ c, post, rowRef, pin }: Props) {
  const q = post.query.trim();
  const checked = post.checked.has(c.id);
  const count = c.messages.length;
  const check = (on: boolean) => {
    const next = new Set(post.checked);
    if (on) next.add(c.id);
    else next.delete(c.id);
    post.setChecked(next);
  };
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        render={
          <div
            className={s.line}
            role="listitem"
            data-row={c.id}
            data-unread={unread(c) ? "" : undefined}
            data-checked={checked ? "" : undefined}
            data-current={post.open?.id === c.id ? "" : undefined}
            data-pin={pin}
          />
        }
      >
        <span className={s.check}>
          <Checkbox
            aria-label={`Select ${c.subject}`}
            checked={checked}
            onCheckedChange={(v) => check(!!v)}
          />
        </span>
        <Tip label={c.starred ? "Unstar" : "Star"} keys={["S"]}>
          <Button
            variant="ghost"
            size="sm"
            icon
            aria-label={c.starred ? "Unstar" : "Star"}
            aria-pressed={!!c.starred}
            className={s.star}
            onClick={() => post.star([c.id], !c.starred)}
          >
            <Star
              {...ic}
              className={s.starIcon}
              data-on={c.starred ? "" : undefined}
            />
          </Button>
        </Tip>
        <button
          type="button"
          ref={rowRef}
          className={s.main}
          aria-current={post.open?.id === c.id || undefined}
          onClick={() => post.show(c.id)}
        >
          <span className={s.from} data-from="">
            <Marked text={participants(c.messages.map((m) => m.from))} q={q} />
            {count > 1 && <span className={s.count}>{count}</span>}
          </span>
          <span className={s.text}>
            <span className={s.subject}>
              <Marked text={c.subject} q={q} />
            </span>
            <span className={s.snippet}>
              <Marked text={snippet(latest(c).body)} q={q} />
            </span>
          </span>
          <span className={s.time}>{c.time}</span>
        </button>
        {/* Over the time's place, at the row's end. */}
        <span className={s.actions}>
          {c.folder === "inbox" && (
            <Tip label="Archive" keys={["E"]}>
              <Button
                variant="ghost"
                size="sm"
                icon
                aria-label="Archive"
                onClick={() => post.archive([c.id])}
              >
                <Archive {...ic} />
              </Button>
            </Tip>
          )}
          {c.folder === "archive" && (
            <Tip label="Move to Inbox">
              <Button
                variant="ghost"
                size="sm"
                icon
                aria-label="Move to Inbox"
                onClick={() => post.unarchive([c.id])}
              >
                <ArchiveRestore {...ic} />
              </Button>
            </Tip>
          )}
          <Tip label={unread(c) ? "Mark as read" : "Mark as unread"}>
            <Button
              variant="ghost"
              size="sm"
              icon
              aria-label={unread(c) ? "Mark as read" : "Mark as unread"}
              onClick={() => post.setUnread([c.id], !unread(c))}
            >
              {unread(c) ? <MailOpen {...ic} /> : <Mail {...ic} />}
            </Button>
          </Tip>
        </span>
      </ContextMenu.Trigger>
      {/* A context menu carries no shortcuts; the tooltips do. */}
      <ContextMenu.Popup>
        {c.folder === "inbox" && (
          <Menu.Item icon={Archive} onClick={() => post.archive([c.id])}>
            Archive
          </Menu.Item>
        )}
        {c.folder === "archive" && (
          <Menu.Item
            icon={ArchiveRestore}
            onClick={() => post.unarchive([c.id])}
          >
            Move to Inbox
          </Menu.Item>
        )}
        <Menu.Item icon={Star} onClick={() => post.star([c.id], !c.starred)}>
          {c.starred ? "Unstar" : "Star"}
        </Menu.Item>
        <Menu.Item
          icon={unread(c) ? MailOpen : Mail}
          onClick={() => post.setUnread([c.id], !unread(c))}
        >
          {unread(c) ? "Mark as read" : "Mark as unread"}
        </Menu.Item>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  );
}
