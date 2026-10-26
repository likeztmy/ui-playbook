// The message body's editor. Loaded on first use, so reading never pays for it.
import { EditorContent, useEditor, type Editor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useImperativeHandle, type Ref } from 'react';
import { blocksClasses as b } from './Blocks';
import { cx } from '../../ui/cx';
import s from './Body.module.scss';

export type BodyHandle = { focus: () => void };

type Props = {
  content: JSONContent | null;
  onChange: (doc: JSONContent, text: string) => void;
  autoFocus?: boolean;
  handle?: Ref<BodyHandle>;
  /** Hands the editor to the formatting row, once it exists. */
  onEditor?: (editor: Editor | null) => void;
};

export default function Body({ content, onChange, autoFocus, handle, onEditor }: Props) {
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

  return <EditorContent editor={editor} className={s.body} />;
}
