import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The design system declares custom font-size utilities via `@theme`
 * (`text-display`, `text-h1`…`text-h3`, `text-body`, `text-body-sm`, `text-caption`).
 * tailwind-merge doesn't know about them, so by default it groups e.g.
 * `text-body-sm` with text *color* utilities and silently drops `text-white`
 * when both appear (size declared after color in a variant) — which left filled
 * buttons with inherited dark ink instead of white. Registering the custom
 * sizes in the `font-size` group keeps color and size independent.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'h1', 'h2', 'h3', 'body', 'body-sm', 'caption'] },
      ],
    },
  },
});

/**
 * Combines conditional classes (clsx) and resolves Tailwind conflicts (twMerge).
 * Use it in every component to merge the consumer's `className` with the base one.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
