import { ToastProvider } from "../../ui/Toast";
import { CONVERSATIONS } from "./conversations";
import { Line } from "./Line";
import { Message } from "./Message";
import type { Conversation } from "./model";
import { usePost } from "./usePost";
import s from "./States.module.scss";

const byId = (id: string) => CONVERSATIONS.find((c) => c.id === id)!;

// The rows that differ in what they carry: a count, a star, a long subject, an archived row, a search match.
const KINDS: { name: string; c: Conversation; query?: string }[] = [
  { name: "Read", c: byId("invoice") },
  { name: "Unread thread", c: byId("roadmap") },
  { name: "Starred", c: byId("review") },
  { name: "Company sender", c: byId("gym") },
  { name: "Archived", c: byId("oncall") },
  { name: "Search match", c: byId("lisbon"), query: "lisbon" },
];

const STATES: {
  name: string;
  pin?: string;
  checked?: boolean;
  current?: boolean;
}[] = [
  { name: "Rest" },
  { name: "Hover", pin: "hover" },
  { name: "Ticked", checked: true },
  { name: "Ticked, hover", checked: true, pin: "hover" },
  { name: "Open", current: true },
];

/** One row held in one state: its own Post, with the state written over it. */
function Row({
  c,
  query = "",
  st,
}: {
  c: Conversation;
  query?: string;
  st: (typeof STATES)[number];
}) {
  const post = usePost([c]);
  const still = {
    ...post,
    query,
    checked: new Set(st.checked ? [c.id] : []),
    open: st.current ? c : null,
  };
  return (
    <div role="list" className={s.statesCell}>
      <Line c={c} post={still} pin={st.pin} />
    </div>
  );
}

const roadmap = byId("roadmap").messages;
// A message's header in each of its states, from a plain reply to one with quoted text, copies and files.
const MESSAGES = [
  { name: "Reply with quote", m: roadmap[1] },
  { name: "Copies and a file", m: roadmap[3] },
  { name: "Company sender", m: byId("gym").messages[0] },
];

export function PostStates() {
  return (
    <ToastProvider>
      <div className={s.states}>
        <div
          className={s.grid}
          style={{
            gridTemplateColumns: `120px repeat(${STATES.length}, 320px)`,
          }}
        >
          <span />
          {STATES.map((st) => (
            <span key={st.name} className={s.head}>
              {st.name}
            </span>
          ))}
          {KINDS.map((k) => (
            <div key={k.name} className={s.row}>
              <span className={s.name}>{k.name}</span>
              {STATES.map((st) => (
                <Row key={st.name} c={k.c} query={k.query} st={st} />
              ))}
            </div>
          ))}
        </div>
        <div
          className={s.grid}
          style={{ gridTemplateColumns: "120px repeat(3, 560px)" }}
        >
          <span />
          {["Collapsed", "Collapsed, unread", "Open"].map((n) => (
            <span key={n} className={s.head}>
              {n}
            </span>
          ))}
          {MESSAGES.map(({ name, m }) => (
            <div key={name} className={s.row}>
              <span className={s.name}>{name}</span>
              <div className={s.statesCell}>
                <Message
                  m={{ ...m, unread: false }}
                  open={false}
                  onToggle={() => {}}
                />
              </div>
              <div className={s.statesCell}>
                <Message
                  m={{ ...m, unread: true }}
                  open={false}
                  onToggle={() => {}}
                />
              </div>
              <div className={s.statesCell}>
                <Message m={m} open onToggle={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastProvider>
  );
}
