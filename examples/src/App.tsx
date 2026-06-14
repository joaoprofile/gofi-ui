import { useState } from 'react';
import { Menu as MenuIcon, Moon, Sun, X } from 'lucide-react';
import { useTheme, type BrandMode } from '@/theme/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import { IconButton } from '@/components/Button';
import { cn } from '@/lib/cn';
import { useScrollLock } from '@/lib/hooks';
import { useHashRoute } from './useHashRoute';
import { Sidebar } from './Sidebar';
import { pages } from './pages';

const BRANDS: Array<{ id: BrandMode; label: string; swatch: string }> = [
  { id: 'blue', label: 'Blue (#AAD7FF)', swatch: '#aad7ff' },
  { id: 'violet', label: 'Violet', swatch: '#c3c9ff' },
  { id: 'green', label: 'Green', swatch: '#a6f4c5' },
];

/** Brand color selector — live preview in other colors. */
function BrandSwitcher() {
  const { brand, setBrand } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Brand color"
      className="flex items-center gap-1 rounded-pill border border-border bg-card p-1"
    >
      {BRANDS.map((b) => {
        const active = brand === b.id;
        return (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={b.label}
            title={b.label}
            onClick={() => setBrand(b.id)}
            className={cn(
              'size-6 rounded-pill border-2 transition-transform duration-100',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
              active ? 'border-action scale-110' : 'border-transparent hover:scale-105',
            )}
            style={{ background: b.swatch }}
          />
        );
      })}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton
      variant="outline"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </IconButton>
  );
}

export function App() {
  const [route, navigate] = useHashRoute();
  const [drawerOpen, setDrawerOpen] = useState(false);
  useScrollLock(drawerOpen);

  const go = (id: string) => {
    navigate(id);
    setDrawerOpen(false);
  };

  const Page = pages[route] ?? pages['introducao'];

  return (
    <ToastProvider>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-toast)] focus:rounded-md focus:bg-action focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <header className="sticky top-0 z-[var(--z-sticky)] flex h-16 items-center justify-between gap-4 border-b border-border bg-card/90 px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <IconButton
            variant="ghost"
            aria-label="Open navigation"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon className="size-5" />
          </IconButton>
          <button
            type="button"
            onClick={() => go('introducao')}
            className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span className="grid size-8 place-items-center rounded-md bg-brand text-on-brand font-bold">
              G
            </span>
            <span className="text-h3 font-bold text-ink">Gofi-UI</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#/showcase"
            onClick={(e) => {
              e.preventDefault();
              go('showcase');
            }}
            className="hidden rounded-pill px-3 py-2 text-body-sm text-ink-secondary hover:text-ink sm:inline-block"
          >
            Showcase
          </a>
          <span className="hidden sm:block"><BrandSwitcher /></span>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Sidebar desktop */}
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-hidden border-r border-border px-4 py-6 lg:block">
          <Sidebar current={route} onNavigate={go} />
        </aside>

        {/* Sidebar drawer mobile */}
        {drawerOpen && (
          <div className="fixed inset-0 z-[var(--z-modal)] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <div className="absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col gap-4 bg-card p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-h3 font-bold text-ink">Navigation</span>
                <IconButton variant="ghost" aria-label="Close navigation" onClick={() => setDrawerOpen(false)}>
                  <X className="size-5" />
                </IconButton>
              </div>
              <Sidebar current={route} onNavigate={go} />
            </div>
          </div>
        )}

        {/* Content */}
        <main id="content" className={cn('min-w-0 px-4 py-8 md:px-8 lg:px-12')}>
          <div className="mx-auto max-w-4xl">
            <Page />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
