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
  utilities (`bg-action`, `text-ink`, `rounded-pill`, `shadow-md`).
- **Light/dark theme** — the `ThemeProvider` toggles `data-theme` on `<html>` and
  everything re-themes from the same tokens.
- **3 live brand colors** — Blue `#AAD7FF` (default), Violet and Green, via
  `data-brand`, combinable with dark mode.
- **TypeScript-first** — typed props, type-safe variants with
  `class-variance-authority`, `forwardRef`, generics (`Table<T>`, `Select<T>`).
- **A11y from the start** — visible focus, keyboard nav, correct ARIA, AA
  contrast, `prefers-reduced-motion`.

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
