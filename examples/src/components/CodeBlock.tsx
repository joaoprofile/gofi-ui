import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/** Code block with a "copy" button. Light token highlighting (no heavy libs). */
export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <div className={cn('group relative overflow-hidden rounded-md bg-sunken', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-caption font-medium uppercase tracking-wide text-ink-secondary">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-caption text-ink-secondary transition-colors duration-100 hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label={copied ? 'Code copied' : 'Copy code'}
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-body-sm leading-relaxed">
        <code className="font-mono text-ink">{code}</code>
      </pre>
    </div>
  );
}
