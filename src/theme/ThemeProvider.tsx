import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark';
/**
 * Configurable brand — live preview of alternative looks.
 *
 * `blue` | `violet` | `green` swap colour only. `salesforce` is a FULL skin of
 * the Salesforce Lightning Design System: it also swaps geometry, density,
 * type scale, elevation and easing. All four combine with `data-theme`.
 */
export type BrandMode = 'blue' | 'violet' | 'green' | 'salesforce';

const BRANDS: readonly BrandMode[] = ['blue', 'violet', 'green', 'salesforce'];

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  brand: BrandMode;
  setBrand: (brand: BrandMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'gofi-theme';
const BRAND_KEY = 'gofi-brand';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialBrand(): BrandMode {
  if (typeof window === 'undefined') return 'blue';
  const stored = window.localStorage.getItem(BRAND_KEY) as BrandMode | null;
  return stored && BRANDS.includes(stored) ? stored : 'blue';
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Forced initial theme (ignores system preference/localStorage). */
  defaultTheme?: ThemeMode;
  /** Forced initial brand. */
  defaultBrand?: BrandMode;
}

/**
 * Sets theme (light/dark) and brand ONCE at the root, via the
 * `data-theme` and `data-brand` attributes on <html>. No component manages
 * theme locally — they all consume the tokens.
 */
export function ThemeProvider({ children, defaultTheme, defaultBrand }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme ?? getInitialTheme);
  const [brand, setBrandState] = useState<BrandMode>(defaultBrand ?? getInitialBrand);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brand);
    window.localStorage.setItem(BRAND_KEY, brand);
  }, [brand]);

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'light' ? 'dark' : 'light')),
    [],
  );
  const setBrand = useCallback((b: BrandMode) => setBrandState(b), []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, brand, setBrand }),
    [theme, setTheme, toggleTheme, brand, setBrand],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return ctx;
}
