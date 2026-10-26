// The message body's editor. Loaded on first use, so reading never pays for it.
import { EditorContent, Extension, useEditor, type Editor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useId, useImperativeHandle, useRef, type Ref } from 'react';
import { blocksClasses as b } from './Blocks';
import { cx } from '../../ui/cx';
import { useMentions } from './mentions';
import { Suggestions } from './Suggestions';
import s from './Body.module.scss';

export type BodyHandle = { focus: () => void };

/** ⌘↵ is Send, not the line break StarterKit gives it: taken here, before the hard break sees it, and left to the composer. */
const SendKey = Extension.create({
  name: 'sendKey',
  priority: 1000,
  addKeyboardShortcuts: () => ({ 'Mod-Enter': () => true }),
});

type Props = {
  content: JSONContent | null;
  onChange: (doc: JSONContent, text: string) => void;
  autoFocus?: boolean;
  handle?: Ref<BodyHandle>;
  /** Hands the editor to the formatting row, once it exists. */
  onEditor?: (editor: Editor | null) => void;
  /** Someone was @mentioned: they belong on To. */
  onMention: (email: string) => void;
};

export default function Body({ content, onChange, autoFocus, handle, onEditor, onMention }: Props) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const mentions = useMentions(onMention);
  const editor = useEditor({
    extensions: [
      // What a message can hold, and what the reader renders: no headings, code or rules.
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: { openOnClick: false },
      }),
      mentions.extension,
      SendKey,
    ],
    content,
    immediatelyRender: false,
    // Typing "- ", "1. " or "> " starts a list or quote; nothing else rewrites what you type.
    enableInputRules: ['bulletList', 'orderedList', 'blockquote'],
    enablePasteRules: ['link'],
    editorProps: { attributes: { class: cx(b.prose, s.prose), 'aria-label': 'Message', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor }) => onChange(editor.getJSON(), editor.getText()),
  });

  // Into the body once it's in the page. Until then the composer's placeholder holds focus,
  // so keys typed straight after R never reach the app's shortcuts.
  useEffect(() => {
    if (autoFocus && editor) editor.commands.focus('end');
  }, [editor]);

  useEffect(() => {
    onEditor?.(editor);
    return () => onEditor?.(null);
  }, [editor]);

  useImperativeHandle(handle, () => ({ focus: () => editor?.commands.focus('end') }), [editor]);

  // The list opens under the caret's query, placed within this box so it scrolls with the text.
  const at = mentions.menu?.rect && box.current?.getBoundingClientRect();
  return (
    <div ref={box} className={s.box}>
      <EditorContent editor={editor} className={s.body} />
      {mentions.menu && at && (
        <Suggestions
          id={id}
          label="People to mention"
          items={mentions.menu.items}
          active={mentions.menu.active}
          onPick={mentions.pick}
          onActive={mentions.setActive}
          className={s.mentions}
          style={{ top: mentions.menu.rect!.bottom - at.top + 4, left: Math.max(0, mentions.menu.rect!.left - at.left) }}
        />
      )}
    </div>
  );
}
