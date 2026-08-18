import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDisclosure, useEscapeKey, useOnClickOutside } from '@/lib/hooks';
import { useFieldContext } from '@/components/Field/Field';

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T> {
  id?: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** Enables filtering by typing (becomes a Combobox). */
  searchable?: boolean;
  /** Allows selecting multiple values. */
  multiple?: boolean;
  /** Text shown when no option is selected. */
  placeholder?: string;
  invalid?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Accessible Select (custom listbox). Combobox mode when `searchable`.
 * Integrates with <Field> via useFieldContext to inherit id, invalid and aria.
 *
 * Keyboard:
 *  - ArrowDown/ArrowUp: navigate between options
 *  - Enter: select the active option
 *  - Esc: close and return focus to the trigger
 *  - Typing (searchable): filter options
 */
export function Select<T extends string | number>({
  id,
  value,
  options,
  onChange,
  searchable = false,
  multiple = false,
  placeholder = 'Select…',
  invalid,
  loading = false,
  disabled = false,
  className,
}: SelectProps<T>) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const uid = useId();
  const resolvedId = id ?? field?.id ?? uid;
  const listboxId = `${resolvedId}-listbox`;

  const { open, onOpen, onClose, onToggle } = useDisclosure();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useOnClickOutside(containerRef, onClose, open);
  // Close with Esc and return focus
  useEscapeKey(
    useCallback(() => {
      if (open) {
        onClose();
        triggerRef.current?.focus();
      }
    }, [open, onClose]),
    open,
  );

  // Filter options by the search query
  const filteredOptions = searchable && query.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  // Label of the current selection
  const selectedLabel = value !== null
    ? options.find((o) => o.value === value)?.label
    : null;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    onToggle();
    setQuery('');
    setActiveIndex(-1);
    if (!open) {
      // Focus the search input or the first item on the next tick
      setTimeout(() => {
        if (searchable) {
          inputRef.current?.focus();
        }
      }, 0);
    }
  }, [disabled, open, onToggle, searchable]);

  const selectOption = useCallback(
    (opt: SelectOption<T>) => {
      if (opt.disabled) return;
      onChange(opt.value);
      if (!multiple) {
        onClose();
        triggerRef.current?.focus();
      }
      setQuery('');
    },
    [multiple, onChange, onClose],
  );

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!open) {
          onOpen();
          setQuery('');
          setActiveIndex(0);
        }
      }
    },
    [open, onOpen],
  );

  const handleListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1),
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          selectOption(filteredOptions[activeIndex]);
        }
      }
    },
    [activeIndex, filteredOptions, selectOption],
  );

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  }, []);

  const activeOptionId =
    open && activeIndex >= 0 && filteredOptions[activeIndex]
      ? `${listboxId}-opt-${activeIndex}`
      : undefined;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        id={resolvedId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-invalid={isInvalid || undefined}
        aria-required={field?.required || undefined}
        aria-describedby={field?.describedBy}
        disabled={disabled}
        onClick={handleOpen}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex h-[var(--h-field)] w-full items-center justify-between gap-2 rounded-field border bg-card px-[var(--px-field)]',
          'text-body transition-colors duration-100 ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus',
          isInvalid ? 'border-danger' : open ? 'border-focus' : 'border-border',
          disabled && 'cursor-not-allowed bg-hover opacity-70',
        )}
      >
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-left',
            selectedLabel ? 'text-ink' : 'text-ink-secondary',
          )}
        >
          {selectedLabel ?? placeholder}
        </span>

        <span aria-hidden className="inline-flex shrink-0 items-center gap-1">
          {loading ? (
            <Loader2 className="size-4 animate-spin text-ink-secondary" />
          ) : (
            <ChevronDown
              className={cn(
                'size-4 text-ink-secondary transition-transform duration-100 ease-standard',
                open && 'rotate-180',
              )}
            />
          )}
        </span>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          role="listbox"
          id={listboxId}
          aria-label="Options"
          onKeyDown={handleListKeyDown}
          className={cn(
            'absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-overlay border border-border bg-card shadow-md',
            'z-[var(--z-dropdown)]',
            'animate-[gofi-scale-in_100ms_ease-standard_both]',
          )}
        >
          {/* Search field (Combobox) */}
          {searchable && (
            <div className="border-b border-border px-3 py-2">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={handleSearchChange}
                onKeyDown={handleListKeyDown}
                placeholder="Search…"
                aria-label="Search options"
                className="w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-secondary"
              />
            </div>
          )}

          {/* Options list */}
          <ul role="presentation" className="max-h-60 overflow-y-auto py-1">
            {loading ? (
              <li className="flex items-center justify-center gap-2 px-3 py-3 text-body-sm text-ink-secondary">
                <Loader2 className="size-4 animate-spin" />
                <span>Loading…</span>
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="px-3 py-3 text-body-sm text-ink-secondary">
                {searchable && query
                  ? `No results for «${query}»`
                  : 'No options available'}
              </li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isActive = index === activeIndex;
                const optId = `${listboxId}-opt-${index}`;

                return (
                  <li
                    key={String(opt.value)}
                    id={optId}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    onClick={() => !opt.disabled && selectOption(opt)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-3 py-2.5 text-body-sm',
                      'transition-colors duration-100 ease-standard',
                      isActive ? 'bg-hover' : '',
                      isSelected ? 'text-action' : 'text-ink',
                      opt.disabled && 'cursor-not-allowed opacity-50',
                    )}
                  >
                    {/* Selected icon */}
                    <span className="inline-flex size-4 shrink-0 items-center justify-center">
                      {isSelected && <Check className="size-4" />}
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
