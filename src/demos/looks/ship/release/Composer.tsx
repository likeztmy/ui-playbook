import { useRef, useState } from 'react';
import { Button } from '../../../../ui/Button';
import { TextField } from '../../../../ui/Field';
import t from './Release.module.scss';

/**
 * A comment under the history, from whoever is signed in. Post stays enabled: pressed with nothing
 * written, it puts the caret in the box rather than greying out with no reason (LK#46).
 */
export function Composer({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState('');
  const field = useRef<HTMLInputElement>(null);
  return (
    <div className={t.composer}>
      <span className={t.face} aria-hidden>
        MC
      </span>
      <TextField label="Comment" multiline value={text} onValueChange={setText} inputRef={field} />
      <div className={t.send}>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            if (!text.trim()) return field.current?.focus();
            onPost(text.trim());
            setText('');
          }}
        >
          Post comment
        </Button>
      </div>
    </div>
  );
}
