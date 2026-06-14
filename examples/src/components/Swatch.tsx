import { cn } from '@/lib/cn';

export interface SwatchProps {
  /** Background utility class (e.g. "bg-action"). */
  bg: string;
  /** Token / utility name (e.g. "--color-action / bg-action"). */
  name: string;
  /** Reference value (e.g. "primary-600 #1B72D8"). */
  value?: string;
  /** Text class for the overlaid label, when applicable. */
  textClass?: string;
}

/** Color/surface swatch for the foundations docs. */
export function Swatch({ bg, name, value, textClass }: SwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'flex h-20 items-end rounded-lg border border-border p-3',
          bg,
          textClass,
        )}
      >
        {textClass && <span className="text-caption font-medium">Aa</span>}
      </div>
      <div className="flex flex-col">
        <code className="font-mono text-caption text-ink">{name}</code>
        {value && <span className="text-caption text-ink-secondary">{value}</span>}
      </div>
    </div>
  );
}

export interface TokenRowProps {
  token: string;
  value: string;
  preview?: React.ReactNode;
}

/** Token row (type, spacing, radius, shadow) with optional preview. */
export function TokenRow({ token, value, preview }: TokenRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3 last:border-0">
      <code className="w-48 shrink-0 font-mono text-caption text-action">{token}</code>
      <span className="w-40 shrink-0 text-caption text-ink-secondary">{value}</span>
      {preview && <div className="flex-1">{preview}</div>}
    </div>
  );
}
