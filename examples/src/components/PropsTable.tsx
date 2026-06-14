export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface PropsTableProps {
  rows: PropRow[];
  /** Interface name (e.g. "ButtonProps") for the header. */
  title?: string;
}

/** Typed props table — standard component documentation pattern. */
export function PropsTable({ rows, title }: PropsTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="text-h3 text-ink">Properties · {title}</h3>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-body-sm">
          <thead>
            <tr className="border-b border-border bg-sunken">
              <th scope="col" className="px-4 py-3 font-semibold text-ink">Prop</th>
              <th scope="col" className="px-4 py-3 font-semibold text-ink">Type</th>
              <th scope="col" className="px-4 py-3 font-semibold text-ink">Default</th>
              <th scope="col" className="px-4 py-3 font-semibold text-ink">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-border last:border-0 align-top">
                <td className="whitespace-nowrap px-4 py-3">
                  <code className="font-mono text-ink">{row.name}</code>
                  {row.required && (
                    <span className="ml-1 text-caption text-danger" title="Required">
                      *
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-caption text-action">{row.type}</code>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {row.default ? (
                    <code className="font-mono text-caption text-ink-secondary">{row.default}</code>
                  ) : (
                    <span className="text-ink-secondary">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-secondary">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
