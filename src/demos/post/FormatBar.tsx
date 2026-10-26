import type { ChainedCommands, Editor } from '@tiptap/react';
import { Bold, Italic, Link, List, ListOrdered, TextQuote } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Button, buttonClass } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { fieldClasses as f } from '../../ui/Field';
import { Popover } from '../../ui/Popover';
import { Toolbar, toolbarClasses } from '../../ui/Toolbar';
import s from './FormatBar.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** An address as typed, made absolute: "example.com" means https://example.com. */
const absolute = (url: string) => (/^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`);

/**
 * The selection as the page has it. The editor reads a selection change a moment later, so a ⌘K
 * straight after Shift+← would otherwise link nothing.
 */
function selection(editor: Editor) {
  const page = getSelection();
  const { view } = editor;
  if (!page?.anchorNode || !page.focusNode || !view.dom.contains(page.anchorNode)) return editor.state.selection;
  const a = view.posAtDOM(page.anchorNode, page.anchorOffset);
  const b = view.posAtDOM(page.focusNode, page.focusOffset);
  return { from: Math.min(a, b), to: Math.max(a, b) };
}

/** The link tool: an address in a popover, opened by the tool or ⌘K. */
function LinkTool({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const field = useRef<HTMLInputElement>(null);
  // The selection when the popover opened: focus leaving the text can collapse it.
  const range = useRef({ from: 0, to: 0 });
  const inLink = !!editor?.isActive('link');

  const show = () => {
    if (!editor) return;
    range.current = selection(editor);
    setUrl(inLink ? (editor.getAttributes('link').href ?? '') : '');
    setOpen(true);
  };

  // ⌘K in the text opens it, as in Gmail.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        show();
      }
    };
    dom.addEventListener('keydown', onKey);
    return () => dom.removeEventListener('keydown', onKey);
  });

  const apply = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!editor || !url.trim()) return;
    const href = absolute(url.trim());
    const { from, to } = range.current;
    const chain = editor.chain().focus().setTextSelection({ from, to });
    // Nothing selected and not in a link: the address becomes the text too.
    if (from === to && !inLink) chain.insertContent({ type: 'text', text: url.trim(), marks: [{ type: 'link', attrs: { href } }] }).run();
    else chain.extendMarkRange('link').setLink({ href }).run();
    setOpen(false);
  };

  const remove = () => {
    editor?.chain().focus().setTextSelection(range.current).extendMarkRange('link').unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => (next ? show() : setOpen(false))}
      initialFocus={field}
      // Closing returns to the text, with the selection as it was.
      finalFocus={false}
      tip="Link"
      title="Link"
      hideTitle
      side="top"
      trigger={
        <Toolbar.Button
          aria-label="Link"
          disabled={!editor}
          data-pressed={inLink ? '' : undefined}
          className={cx(buttonClass({ icon: true }), toolbarClasses.tool)}
        >
          <Link {...ic} />
        </Toolbar.Button>
      }
    >
      <form
        className={s.link}
        onSubmit={apply}
        onKeyDown={(e) => {
          if (e.key === 'Escape') editor?.commands.focus();
        }}
      >
        <input
          ref={field}
          className={cx(f.control, s.address)}
          value={url}
          placeholder="Paste or type a link"
          aria-label="Address"
          onFocus={(e) => e.target.select()}
          onChange={(e) => setUrl(e.target.value)}
        />
        {inLink && (
          <Button size="sm" variant="ghost" onClick={remove}>
            Remove
          </Button>
        )}
        <Button size="sm" variant="primary" type="submit" disabled={!url.trim()}>
          Apply
        </Button>
      </form>
    </Popover>
  );
}

/**
 * What a message can hold, and what the reader renders: bold, italic, two lists, a quote, a link.
 * Each tool shows pressed for what applies where the caret is.
 */
export function FormatBar({ editor }: { editor: Editor | null }) {
  // The editor changes outside React; redraw with each change of text or selection.
  const [, redraw] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    if (!editor) return;
    editor.on('transaction', redraw);
    return () => {
      editor.off('transaction', redraw);
    };
  }, [editor]);

  const on = (name: string) => !!editor?.isActive(name);
  const run = (command: (c: ChainedCommands) => ChainedCommands) => editor && command(editor.chain().focus()).run();

  return (
    <Toolbar.Root flat aria-label="Formatting" className={s.bar}>
      <Toolbar.Toggle label="Bold" pressed={on('bold')} onPressedChange={() => run((c) => c.toggleBold())}>
        <Bold {...ic} />
      </Toolbar.Toggle>
      <Toolbar.Toggle label="Italic" pressed={on('italic')} onPressedChange={() => run((c) => c.toggleItalic())}>
        <Italic {...ic} />
      </Toolbar.Toggle>
      <Toolbar.Separator />
      <Toolbar.Toggle label="Bulleted list" pressed={on('bulletList')} onPressedChange={() => run((c) => c.toggleBulletList())}>
        <List {...ic} />
      </Toolbar.Toggle>
      <Toolbar.Toggle label="Numbered list" pressed={on('orderedList')} onPressedChange={() => run((c) => c.toggleOrderedList())}>
        <ListOrdered {...ic} />
      </Toolbar.Toggle>
      <Toolbar.Toggle label="Quote" pressed={on('blockquote')} onPressedChange={() => run((c) => c.toggleBlockquote())}>
        <TextQuote {...ic} />
      </Toolbar.Toggle>
      <Toolbar.Separator />
      <LinkTool editor={editor} />
    </Toolbar.Root>
  );
}
