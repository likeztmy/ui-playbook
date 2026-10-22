import { Form as BaseForm } from '@base-ui/react/form';
import type { ComponentProps } from 'react';

/**
 * A form that, on a failed submit, moves focus to the first invalid field
 * with the caret at the end. Base UI selects the field's text there, so the
 * next keystroke would replace an answer that's usually one character off.
 */
export function Form({ onSubmitCapture, ...props }: ComponentProps<typeof BaseForm>) {
  return (
    <BaseForm
      {...props}
      // Capture: on a failed submit Base UI focuses and returns before any
      // onSubmit of ours runs.
      onSubmitCapture={(e) => {
        onSubmitCapture?.(e);
        const form = e.currentTarget;
        // The selection Base UI makes after this submit, and only that one.
        const collapse = (event: Event) => {
          const el = event.target;
          if (el instanceof HTMLInputElement) el.setSelectionRange(el.value.length, el.value.length);
        };
        form.addEventListener('select', collapse, { capture: true, once: true });
        setTimeout(() => form.removeEventListener('select', collapse, { capture: true }), 500);
      }}
    />
  );
}
