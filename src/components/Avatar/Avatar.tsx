import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* ============================================================
 * Internal utilities
 * ============================================================ */

/** Extracts the initials from the name (up to 2 letters). */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Deterministic background color derived from the name (index into a fixed palette). */
function getAvatarColor(name: string): string {
  // Palette of 8 colors (bg + text) accessible and within the semantic tokens
  const palettes = [
    { bg: 'bg-action', text: 'text-on-secondary' },
    { bg: 'bg-accent', text: 'text-on-secondary' },
    { bg: 'bg-success', text: 'text-on-secondary' },
    { bg: 'bg-warning', text: 'text-on-secondary' },
    { bg: 'bg-danger', text: 'text-on-secondary' },
    { bg: 'bg-info', text: 'text-on-secondary' },
    { bg: 'bg-brand', text: 'text-on-brand' },
    { bg: 'bg-hover', text: 'text-ink' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // int32
  }
  const index = Math.abs(hash) % palettes.length;
  return cn(palettes[index].bg, palettes[index].text);
}

/* ============================================================
 * Sizes
 * ============================================================ */

const sizeClasses = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-caption',
  md: 'size-10 text-body-sm',
  lg: 'size-12 text-body',
  xl: 'size-16 text-h3',
} as const;

const statusDotSize = {
  xs: 'size-1.5',
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3',
  xl: 'size-3.5',
} as const;

/* ============================================================
 * Avatar
 * ============================================================ */

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. If it fails, falls back to initials. */
  src?: string;
  /** Person's name — required for initials and aria-label. */
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Presence indicator. */
  status?: 'online' | 'offline';
}

/**
 * Person avatar — image with fallback to initials.
 * Online/offline status indicator in the bottom-right corner.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, name, size = 'md', status, className, ...rest }, ref) => {
    const [imgError, setImgError] = useState(false);
    const showImage = !!src && !imgError;
    const colorClasses = getAvatarColor(name);

    return (
      <span
        ref={ref}
        aria-label={name}
        className={cn('relative inline-flex shrink-0 items-center justify-center rounded-avatar', sizeClasses[size], className)}
        {...rest}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="size-full rounded-avatar object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={cn('flex size-full items-center justify-center rounded-avatar font-semibold', colorClasses)}
          >
            {getInitials(name)}
          </span>
        )}

        {status && (
          <span
            aria-label={status === 'online' ? 'Online' : 'Offline'}
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-card',
              statusDotSize[size],
              status === 'online' ? 'bg-success' : 'bg-hover',
            )}
          />
        )}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';

/* ============================================================
 * AvatarStack
 * ============================================================ */

export interface AvatarStackProps extends HTMLAttributes<HTMLSpanElement> {
  items: AvatarProps[];
  /** Maximum number of visible avatars before "+N". Default: 3. */
  max?: number;
}

/**
 * Group of avatars with negative overlap.
 * Overflow displayed as "+N" with a descriptive aria-label.
 */
export const AvatarStack = forwardRef<HTMLSpanElement, AvatarStackProps>(
  ({ items, max = 3, className, ...rest }, ref) => {
    const visible = items.slice(0, max);
    const overflow = items.length - visible.length;

    return (
      <span
        ref={ref}
        aria-label={`${items.length} people`}
        className={cn('inline-flex items-center', className)}
        {...rest}
      >
        {visible.map((item, i) => (
          <Avatar
            key={item.name + i}
            {...item}
            size={item.size ?? 'sm'}
            className={cn(
              'ring-2 ring-card',
              i > 0 && '-ml-2',
            )}
          />
        ))}
        {overflow > 0 && (
          <span
            aria-label={`${overflow} more`}
            className={cn(
              'relative -ml-2 inline-flex size-8 shrink-0 items-center justify-center',
              'rounded-avatar bg-hover text-caption font-semibold text-ink-secondary ring-2 ring-card',
            )}
          >
            +{overflow}
          </span>
        )}
      </span>
    );
  },
);
AvatarStack.displayName = 'AvatarStack';
