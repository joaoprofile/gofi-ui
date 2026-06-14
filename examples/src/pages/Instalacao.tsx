import { DocPage, DocSection, CodeBlock, Callout, Prose } from '../components';

export function InstalacaoPage() {
  return (
    <DocPage
      group="Get started"
      title="Installation"
      lead="Add gofi-ui to your React app with npm or yarn, then import the components."
    >
      <DocSection title="Install (React)" description="Install the package with your package manager of choice.">
        <CodeBlock
          language="bash"
          code={`# npm
npm install gofi-ui

# yarn
yarn add gofi-ui

# pnpm
pnpm add gofi-ui`}
        />
        <Callout tone="info">
          That's all most apps need. <code>gofi-ui</code> already bundles its small internal
          utilities (<code>clsx</code>, <code>tailwind-merge</code>,
          <code>class-variance-authority</code>, <code>lucide-react</code>) — you don't install
          those. See <strong>Dependencies</strong> below for the full picture.
        </Callout>
      </DocSection>

      <DocSection
        title="Dependencies"
        description="What ships with gofi-ui, what you provide, and what's optional."
      >
        <Prose>
          <p>
            <strong>Bundled with gofi-ui</strong> (installed automatically — don't add these):
            {' '}<code>clsx</code>, <code>tailwind-merge</code>,
            {' '}<code>class-variance-authority</code>, <code>lucide-react</code>.
          </p>
          <p>
            <strong>Peer dependencies</strong> — <code>react</code> and <code>react-dom</code> (18+).
            Any React app already has them.
          </p>
          <p>
            <strong>Styling — nothing else to install.</strong> gofi-ui ships a prebuilt
            stylesheet (<code>gofi-ui/styles.css</code>) with everything bundled — tokens and
            component styles. Import it once and you're done: no Tailwind, no config.
          </p>
          <p>
            <strong>Charts use Recharts (optional peer).</strong> Only the chart components need
            it — install it just if you render charts, so apps without charts stay lean.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          code={`# 1) the library — bundles clsx, tailwind-merge, cva, lucide-react
npm install gofi-ui            # or: yarn add gofi-ui / pnpm add gofi-ui

# 2) peer deps (you likely already have these)
npm install react react-dom    # yarn add react react-dom

# 3) optional — only if you use the Charts components
npm install recharts           # yarn add recharts`}
        />
        <Callout tone="info">
          <strong>Best practice:</strong> most apps just install <code>gofi-ui</code> and import
          <code>gofi-ui/styles.css</code> — that's the whole design system in one file. Add
          <code>recharts</code> only if you use charts.
        </Callout>
      </DocSection>

      <DocSection title="Use a component" description="Import from the public barrel and wrap the app in the ThemeProvider.">
        <CodeBlock
          code={`import { ThemeProvider, Button, Card } from 'gofi-ui';
import 'gofi-ui/styles'; // tokens + base (theme.css)

function App() {
  return (
    <ThemeProvider>
      <Card>
        <Button variant="primary">Sign in</Button>
      </Card>
    </ThemeProvider>
  );
}`}
        />
        <Callout tone="info">
          The <code>ThemeProvider</code> sets the <code>data-theme</code> attribute on <code>&lt;html&gt;</code>
          once. No component manages the theme locally — they all consume the tokens.
        </Callout>
      </DocSection>

      <DocSection
        title="CDN / plain HTML"
        description="For static pages or non-React stacks, load the stylesheet from a CDN — no build step."
      >
        <CodeBlock
          language="html"
          code={`<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <!-- tokens (CSS variables) + base styles via CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gofi-ui/dist/gofi-ui.css" />
    <style>
      /* optional: override the brand (validate contrast) */
      :root { --color-brand: #AAD7FF; --text-on-brand: #0B2942; --color-action: #1B72D8; }
    </style>
  </head>
  <body>
    <button style="background: var(--color-action); color: #fff; border: 0;
                   border-radius: var(--radius-pill); padding: .625rem 1.25rem;
                   font-weight: 600; cursor: pointer">
      Sign in
    </button>
  </body>
</html>`}
        />
        <Callout tone="info">
          The CDN stylesheet exposes the GOFI <strong>design tokens</strong> (CSS variables) and
          base styles, so any HTML page gets the look. <strong>Interactive</strong> behavior
          (modals, menus, toasts, focus trapping) lives in the React components — install the
          npm package for those.
        </Callout>
      </DocSection>

      <DocSection title="Run this repo locally" description="To browse this documentation site from source.">
        <CodeBlock
          language="bash"
          code={`# inside ds/
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build`}
        />
      </DocSection>

    </DocPage>
  );
}
