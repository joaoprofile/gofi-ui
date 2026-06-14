import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { NAV } from './nav';

export interface SidebarProps {
  current: string;
  onNavigate: (id: string) => void;
}

/** Grouped, COLLAPSIBLE sidebar menu with search filter — popular-docs style. */
export function Sidebar({ current, onNavigate }: SidebarProps) {
  const [query, setQuery] = useState('');
  // Groups collapsed manually by the user (group id → collapsed).
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => i.label.toLowerCase().includes(q) || i.id.includes(q),
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const searching = query.trim().length > 0;

  return (
    <nav aria-label="Documentation navigation" className="flex h-full flex-col gap-5">
      <div className="flex h-11 items-center gap-2 rounded-pill border border-border bg-card px-4">
        <Search aria-hidden className="size-4 shrink-0 text-ink-secondary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search component…"
          aria-label="Search the documentation"
          className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-secondary"
        />
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pb-8">
        {groups.map((g) => {
          // While searching, keep everything expanded.
          const isOpen = searching || !collapsed[g.group];
          const hasActive = g.items.some((i) => i.id === current);
          return (
            <div key={g.group} className="flex flex-col">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  !searching && setCollapsed((c) => ({ ...c, [g.group]: !c[g.group] }))
                }
                className="flex items-center justify-between rounded-md px-3 py-1.5 text-caption font-semibold uppercase tracking-wider text-ink-secondary transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <span className={cn(hasActive && !isOpen && 'text-action')}>{g.group}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-4 transition-transform duration-150 ease-standard',
                    isOpen ? 'rotate-0' : '-rotate-90',
                  )}
                />
              </button>

              {isOpen && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {g.items.map((item) => {
                    const active = item.id === current;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'rounded-md px-3 py-2 text-left text-body-sm transition-colors duration-100',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                          active
                            ? 'bg-action font-medium text-white'
                            : 'text-ink-secondary hover:bg-hover hover:text-ink',
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {groups.length === 0 && (
          <p className="px-3 text-body-sm text-ink-secondary">
            No components for «{query}».
          </p>
        )}
      </div>
    </nav>
  );
}
