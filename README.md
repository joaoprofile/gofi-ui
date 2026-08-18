# Gofi-UI

`gofi-ui` is a **React + TypeScript + Tailwind v4** design system: accessibility-first.
The web counterpart of [`gofi-ui-native`](https://github.com/joaoprofile/gofi-ui-native) (React Native).

It's faithfully modeled on the visual reference of the **Student Portal Web App**:
light, rounded, airy and accessible.

It's free to use — but offered as-is, with no guarantees: no promise of fitness
for your particular purpose, no committed roadmap, and no guaranteed support.

📖 **[Live examples & docs →](https://joaoprofile.github.io/gofi-ui/)**

> **Building a mobile app?** Its sibling [`gofi-ui-native`](https://github.com/joaoprofile/gofi-ui-native)
> is the React Native port — same tokens, same brands, same look & feel.

## Install

```bash
npm install gofi-ui
```

Peer dependencies: `react` and `react-dom` (>= 18).

## Usage

```tsx
import 'gofi-ui/styles'; // precompiled tokens + utilities (no Tailwind required)
import { ThemeProvider, Button, Card } from 'gofi-ui';

export function App() {
  return (
    <ThemeProvider>
      <Card>
        <Button variant="primary">Save</Button>
      </Card>
    </ThemeProvider>
  );
}
```

`gofi-ui/styles` is a **precompiled** stylesheet — it carries the design tokens
and every utility the components use, so you do **not** need Tailwind configured
in your own project. If you *do* use Tailwind v4 and want to extend the tokens,
import the source theme instead with `@import 'gofi-ui/theme.css'`.

### Chart primitives

The wrapped charts (`AreaChart`, `BarChart`, `LineChart`, `DonutChart`) ship from
the main entry. Raw Recharts primitives live under a subpath to avoid colliding
with the design-system `Tooltip`:

```ts
import { AreaChart } from 'gofi-ui';
import { ChartContainer } from 'gofi-ui/charts';
```

## Highlights

- **Token, never literal** — color/space/radius/type come from tokens declared
  once in [`src/styles/theme.css`](src/styles/theme.css) and exposed as Tailwind
  utilities (`bg-action`, `text-ink`, `rounded-control`, `shadow-md`).
- **Light/dark theme** — the `ThemeProvider` toggles `data-theme` on `<html>` and
  everything re-themes from the same tokens.
- **4 live themes** — Blue `#AAD7FF` (default), Violet, Green and
  **Salesforce**, via `data-brand`, combinable with dark mode.
- **Shape & density are tokens too** — `rounded-control`, `rounded-field`,
  `rounded-surface`, `rounded-overlay`, `rounded-badge`, `rounded-chip`,
  `rounded-track`, `--h-field`, `--h-control-*` name a *role*, so a theme can
  restyle every component without touching one of them.
- **TypeScript-first** — typed props, type-safe variants with
  `class-variance-authority`, `forwardRef`, generics (`Table<T>`, `Select<T>`).
- **A11y from the start** — visible focus, keyboard nav, correct ARIA, AA
  contrast, `prefers-reduced-motion`.

## Salesforce theme

`data-brand="salesforce"` is a full skin of the **Salesforce Lightning Design
System**, not just a palette: it swaps colour, geometry, density, type scale,
elevation and easing together.

```tsx
<ThemeProvider defaultBrand="salesforce">
  <App />
</ThemeProvider>

// or at runtime
const { setBrand } = useTheme();
setBrand('salesforce');

// or scoped to one region — `data-brand` works on any element
<div data-brand="salesforce">…</div>
```

Colour follows the Lightning screens: a pale blue canvas, white cards, cool
borders, navy body text and the `#1B96FF` primary blue. Surfaces come from the official
cloud-blue ramp in
[`@salesforce-ux/design-system`](https://www.npmjs.com/package/@salesforce-ux/design-system)
2.264.0; text, border and link tones are the Lightning tokens
(`$colorTextDefault`, `$colorTextLabel`, `$colorBorder`, `$brandAccessible`).
Geometry and density come from the SDK's `design-tokens/dist/*.json` and the
compiled component CSS.

| Axis | gofi default | Salesforce | Source |
| --- | --- | --- | --- |
| Canvas / card | gray-50 / white | `#EAF5FE` / `#FFFFFF` | cloud-blue-95 |
| Body text / labels | gray-900 / gray-500 | `#16325C` / `#54698D` | `colorTextDefault` / `colorTextLabel` |
| Border | gray-200 | `#D8DDE6` | `colorBorder` |
| Action | `#1B72D8` | `#1B96FF` → `#0070D2` | blue-60 |
| Button, input, card radius | pill / 8px / 16px | `0.25rem` | `radius-border-2` |
| Badge radius | pill | `15rem` (stays a pill) | `.slds-badge` |
| Chip radius | pill | `0.25rem` (rectangle) | `.slds-pill` |
| Control / field height | 40px / 44px | `2rem` | `heightInput` + border |
| Body text size | 16px | `0.8125rem` | `fontSizeTextSmall` |
| Heading weight | 600–700 | `500` (display/h1/h2) | Roboto Medium |
| Active tab underline | 2px | `3px` (`--bw-tab`) | `.slds-tabs_default__item` |
| Easing | `cubic-bezier(.2,0,0,1)` | `linear` | SLDS uses `0.1s linear` |

Column headers and tab labels also go uppercase and letter-spaced — a Lightning
habit the token layer can't express, shipped as a rule scoped to
`[data-brand="salesforce"]` inside `@layer components`.

Three deliberate deviations, all documented inline in
[`theme.css`](src/styles/theme.css):

- **Status tints are derived.** The reference screens show no status tints, so
  the tones are the Lightning text tokens (`#04844B`, `#8C4B02`, `#C23934`) and
  the tints are the lightest step that keeps each pair at ≥ 4.5:1. `info` uses
  the deeper `#0B5CAB` because the `#0070D2` link blue cannot clear AA over any
  blue tint.
- **The primary blue trades contrast for fidelity.** `--action` is `#1B96FF`,
  the blue in the screens, not the darker `brandAccessible`. White on it, and
  that blue as link text, both land at 3.06:1 — over the 3:1 floor for large
  text and UI parts, under 4.5:1 for body-size text, and as light as it can go
  before breaking that floor too. Point `--action` at `--color-lx-link`
  (`#0070D2`, 4.94:1) to put the theme back at AA. The focus ring deliberately
  keeps the darker `#005FB2` (6.4:1) — a focus indicator is the one thing that
  must never be subtle.
- **`--accent` is non-text.** `#2BA5FF` is the bright app-bar and tab-underline
  blue; white on it is 2.65:1, so no component puts a label on it.
- **Dark mode is derived.** SLDS ships no dark palette, so the dark variant is
  built on the official inverse surfaces (`#032D60` / `#001639`) rather than a
  neutral grey.

Salesforce Sans is licensed and not bundled; the theme declares it first, then
**Roboto**, then the exact `$font-family` chain from the SDK. Headings drop to
weight `500` — at 28px a 700 reads as a slab, and Roboto Medium keeps the title
dominant without the density. `h3` stays at 700 because at 16px the weight is
what separates a card title from body text.

Headings take their family from `--ff-heading`, which defaults to the body font
but can be pointed at another family on its own (utility: `font-heading`).

**No webfont ships with the package** — load Roboto (or Inter, or Salesforce
Sans) in your own app, otherwise both themes fall through to `system-ui` and
headings lose their intended weight:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

## Components

- **Layout** — Layout primitives
- **Atoms** — Button, Badge, Avatar, Progress, Tooltip, Feedback (Skeleton, Spinner)
- **Forms** — Field, Input, Textarea, Select / MultiSelect, Toggle (Checkbox, Radio, Switch), SegmentedControl
- **Containers & data** — Card, List, Table, Tabs, Accordion, Stepper, Pagination, EmptyState
- **Overlay & feedback** — Modal, Toast, Banner, Menu
- **Charts** — AreaChart, BarChart, LineChart, DonutChart (Recharts wrapped in gofi-ui tokens)

## Repository layout

```
.                    # the published npm package (gofi-ui)
├── src/             # library source — components, theme, tokens
├── examples/        # docs & live examples site → GitHub Pages
└── dist/            # build output (generated)
```

## Develop

```bash
npm install                 # install the library workspace
npm install --prefix examples

npm run examples:dev        # run the examples/docs site locally
npm run build               # build the publishable library (JS + types + CSS)
npm run examples:build      # build the static examples site
```

## Publishing

```bash
npm run build               # emits dist/ (index.js, charts.js, *.d.ts, gofi-ui.css)
npm publish
```

`prepublishOnly` runs the build automatically.

## Contributing

This library is maintained on a best-effort basis, but improvements from the
community are welcome. If you'd like to contribute:

1. Open an issue first to report a bug or propose a change — it's the best place
   to discuss the idea before you write code (and avoids duplicate work).
2. Fork the repo and create a branch off `main` (e.g. `feature/my-improvement`
   or `fix/some-bug`).
3. Keep changes focused; run `npm run typecheck` and `npm run build` before
   opening the PR.
4. Open a Pull Request describing what changed and why (link the related issue).

PRs are reviewed when time allows — there's no guaranteed turnaround.

## License

MIT © João Carvalho - https://github.com/joaoprofile
