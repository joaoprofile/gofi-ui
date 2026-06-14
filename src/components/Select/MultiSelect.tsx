import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDisclosure, useEscapeKey, useOnClickOutside } from '@/lib/hooks';
import { useFieldContext } from '@/components/Field/Field';
import type { SelectOption } from './Select';

export interface MultiSelectProps<T> {
  id?: string;
  /** Selected values (multiple selection). */
  value: T[];
  options: SelectOption<T>[];
  onChange: (value: T[]) => void;
  /** Enables filtering by typing. */
  searchable?: boolean;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Maximum chips shown before collapsing into "+N". */
  maxTags?: number;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * **Multiple selection** Select (listbox with aria-multiselectable). The chosen
 * items appear as removable chips in the trigger; the panel stays open on each
 * choice. Integrates with <Field> via useFieldContext.
 *
 * Keyboard: ArrowDown/Up navigates · Enter toggles · Esc closes · Backspace
 * (empty search) removes the last · typing filters when `searchable`.
 */
export function MultiSelect<T extends string | number>({
  id,
  value,
  options,
  onChange,
  searchable = false,
  placeholder = 'Select…',
  maxTags = 3,
  invalid,
  disabled = false,
  className,
}: MultiSelectProps<T>) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const uid = useId();
  const resolvedId = id ?? field?.id ?? uid;
  const listboxId = `${resolvedId}-listbox`;

  const { open, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(containerRef, onClose, open);
  useEscapeKey(
    useCallback(() => {
      if (open) {
        onClose();
        triggerRef.current?.focus();
      }
    }, [open, onClose]),
    open,
  );

  const selectedSet = new Set(value);
  const selectedOptions = options.filter((o) => selectedSet.has(o.value));

  const filteredOptions =
    searchable && query.trim()
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

  const toggleValue = useCallback(
    (opt: SelectOption<T>) => {
      if (opt.disabled) return;
      onChange(
        selectedSet.has(opt.value)
          ? value.filter((v) => v !== opt.value)
          : [...value, opt.value],
      );
    },
    [onChange, selectedSet, value],
  );

  const removeValue = useCallback(
    (v: T) => onChange(value.filter((item) => item !== v)),
    [onChange, value],
  );

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (open) {
      onClose();
    } else {
      onOpen();
      setQuery('');
      setActiveIndex(0);
      if (searchable) setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [disabled, open, onOpen, onClose, searchable]);

  const handleListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((p) => Math.min(p + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((p) => Math.max(p - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = filteredOptions[activeIndex];
        if (opt) toggleValue(opt);
      } else if (e.key === 'Backspace' && query === '' && value.length > 0) {
        removeValue(value[value.length - 1]);
      }
    },
    [filteredOptions, activeIndex, toggleValue, query, value, removeValue],
  );

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  }, []);

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !open) {
        e.preventDefault();
        handleOpen();
      }
    },
    [open, handleOpen],
  );

  const visibleTags = selectedOptions.slice(0, maxTags);
  const overflow = selectedOptions.length - visibleTags.length;
  const activeOptionId =
    open && activeIndex >= 0 && filteredOptions[activeIndex]
      ? `${listboxId}-opt-${activeIndex}`
      : undefined;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
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
          'flex min-h-11 w-full items-center justify-between gap-2 rounded-sm border bg-card px-2.5 py-1.5',
          'text-body transition-colors duration-100 ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          isInvalid ? 'border-danger' : open ? 'border-action' : 'border-border',
          disabled && 'cursor-not-allowed bg-hover opacity-70',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedOptions.length === 0 && (
            <span className="px-1 text-ink-secondary">{placeholder}</span>
          )}
          {visibleTags.map((opt) => (
            <span
              key={String(opt.value)}
              className="inline-flex items-center gap-1 rounded-pill bg-action/10 py-0.5 pl-2.5 pr-1 text-caption font-medium text-action"
            >
              {opt.label}
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${opt.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeValue(opt.value);
                }}
                className="grid size-4 place-items-center rounded-pill hover:bg-action/20"
              >
                <X className="size-3" />
              </span>
            </span>
          ))}
          {overflow > 0 && (
            <span className="rounded-pill bg-hover px-2 py-0.5 text-caption font-medium text-ink-secondary">
              +{overflow}
            </span>
          )}
        </span>

        <ChevronDown
          aria-hidden
          className={cn(
            'size-4 shrink-0 text-ink-secondary transition-transform duration-100 ease-standard',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          id={listboxId}
          aria-label="Options"
          aria-multiselectable="true"
          onKeyDown={handleListKeyDown}
          className={cn(
            'absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-md border border-border bg-card shadow-md',
            'z-[var(--z-dropdown)] animate-[gofi-scale-in_100ms_ease-standard_both]',
          )}
        >
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

          {selectedOptions.length > 0 && (
            <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
              <span className="text-caption text-ink-secondary">
                {selectedOptions.length} selected
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="rounded-sm text-caption text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Clear
              </button>
            </div>
          )}

          <ul role="presentation" className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-3 text-body-sm text-ink-secondary">
                {searchable && query ? `No results for «${query}»` : 'No options available'}
              </li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = selectedSet.has(opt.value);
                const isActive = index === activeIndex;
                return (
                  <li
                    key={String(opt.value)}
                    id={`${listboxId}-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    onClick={() => toggleValue(opt)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-body-sm transition-colors duration-100',
                      isActive && 'bg-hover',
                      opt.disabled && 'cursor-not-allowed opacity-50',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'grid size-4 shrink-0 place-items-center rounded-sm border',
                        isSelected ? 'border-action bg-action text-white' : 'border-border',
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                    <span className="flex-1 truncate text-ink">{opt.label}</span>
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
