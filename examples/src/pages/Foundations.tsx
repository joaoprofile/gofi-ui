import { Grid, Stack, Inline } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardTitle } from '@/components/Card';
import { useTheme } from '@/theme/ThemeProvider';
import { DocPage, DocSection, Prose, Callout, Swatch, TokenRow, CodeBlock } from '../components';

/* ───────────────────────── Tokens ───────────────────────── */
export function TokensPage() {
  return (
    <DocPage
      group="Get started"
      title="Tokens"
      lead="The single source of design values. Two layers: primitives (raw palette) and semantics (the role the UI consumes)."
      source="knowledge/ui/design-tokens.md"
    >
      <DocSection title="Spacing" description="4/8 scale — no loose values. Utilities: p-4, gap-3, etc.">
        <Stack gap={0}>
          {[
            ['--space-1 / p-1', '4px'],
            ['--space-2 / p-2', '8px'],
            ['--space-3 / p-3', '12px'],
            ['--space-4 / p-4', '16px'],
            ['--space-6 / p-6', '24px'],
            ['--space-8 / p-8', '32px'],
            ['--space-12 / p-12', '48px'],
          ].map(([t, v]) => (
            <TokenRow
              key={t}
              token={t}
              value={v}
              preview={<div className="h-4 rounded-sm bg-action" style={{ width: v }} />}
            />
          ))}
        </Stack>
      </DocSection>

      <DocSection title="Radius" description="Rounded and generous geometry.">
        <Grid min="160px" gap={4}>
          {[
            ['rounded-sm', '8px'],
            ['rounded-md', '12px'],
            ['rounded-lg', '16px'],
            ['rounded-xl', '24px'],
            ['rounded-pill', '999px'],
          ].map(([cls, v]) => (
            <Stack key={cls} gap={2} align="center">
              <div className={`size-20 border border-border bg-brand ${cls}`} />
              <code className="font-mono text-caption text-ink">{cls}</code>
              <span className="text-caption text-ink-secondary">{v}</span>
            </Stack>
          ))}
        </Grid>
      </DocSection>

      <DocSection title="Elevation" description="Depth through soft shadow, not heavy border.">
        <Grid min="200px" gap={6}>
          {['shadow-sm', 'shadow-md', 'shadow-lg'].map((cls) => (
            <Stack key={cls} gap={2} align="center">
              <div className={`grid h-24 w-full place-items-center rounded-lg bg-card ${cls}`}>
                <code className="font-mono text-caption text-ink">{cls}</code>
              </div>
            </Stack>
          ))}
        </Grid>
      </DocSection>
    </DocPage>
  );
}

/* ───────────────────────── Colors ───────────────────────── */
export function CoresPage() {
  return (
    <DocPage
      group="Get started"
      title="Colors"
      lead="The dual role of blue: the brand is surface; the action is affordance. Color is never the only channel of meaning."
      source="foundations/color.md"
    >
      <Callout tone="warning">
        <strong>Non-negotiable rule:</strong> never white text on <code>bg-brand</code> (#AAD7FF fails
        AA). On the brand, text is navy (<code>text-on-brand</code>). Affordances on white use
        <code> bg-action</code> (#1B72D8).
      </Callout>

      <DocSection title="Brand, action and accent">
        <Grid min="200px" gap={4}>
          <Swatch bg="bg-brand" name="bg-brand" value="primary-200 #AAD7FF" textClass="text-on-brand" />
          <Swatch bg="bg-action" name="bg-action" value="primary-600 #1B72D8" textClass="text-white" />
          <Swatch bg="bg-action-hover" name="bg-action-hover" value="primary-700 #1259AE" textClass="text-white" />
          <Swatch bg="bg-accent" name="bg-accent" value="accent-500 #6172F3" textClass="text-white" />
        </Grid>
      </DocSection>

      <DocSection title="Surfaces & text" description="Swap values between light and dark.">
        <Grid min="200px" gap={4}>
          <Swatch bg="bg-page" name="bg-page" value="--surface-page" textClass="text-ink" />
          <Swatch bg="bg-card" name="bg-card" value="--surface-card" textClass="text-ink" />
          <Swatch bg="bg-hover" name="bg-hover" value="--surface-hover" textClass="text-ink" />
          <Swatch bg="bg-sunken" name="bg-sunken" value="--surface-sunken" textClass="text-ink" />
        </Grid>
      </DocSection>

      <DocSection title="Status - semantic, not decorative" description="Always pair with icon + text, never color alone.">
        <Grid min="180px" gap={4}>
          <Swatch bg="bg-success-bg" name="success" value="--success #12B76A" textClass="text-success" />
          <Swatch bg="bg-warning-bg" name="warning" value="--warning #F79009" textClass="text-warning" />
          <Swatch bg="bg-danger-bg" name="danger" value="--danger #F04438" textClass="text-danger" />
          <Swatch bg="bg-info-bg" name="info" value="--info #2E90FA" textClass="text-info" />
        </Grid>
      </DocSection>
    </DocPage>
  );
}

/* ───────────────────────── Typography ───────────────────────── */
const TYPE_SCALE: Array<[string, string, string]> = [
  ['text-display', '36 / 44 · 700', 'Brand title / hero'],
  ['text-h1', '28 / 36 · 700', 'Page title'],
  ['text-h2', '22 / 30 · 600', 'Section'],
  ['text-h3', '18 / 26 · 600', 'Card / sub-section title'],
  ['text-body', '16 / 24 · 400', 'Default body'],
  ['text-body-sm', '14 / 20 · 400', 'Labels, support'],
  ['text-caption', '12 / 16 · 500', 'Captions, badges'],
];

export function TipografiaPage() {
  return (
    <DocPage
      group="Get started"
      title="Typography"
      lead="Modular scale with hierarchy by size and weight — not by color. Secondary text uses text-ink-secondary."
      source="foundations/typography.md"
    >
      <DocSection title="Scale">
        <Card>
          <Stack gap={5}>
            {TYPE_SCALE.map(([cls, meta, use]) => (
              <div key={cls} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0">
                <span className={`${cls} text-ink`}>Aa — The quick brown fox</span>
                <div className="flex flex-wrap items-center gap-3">
                  <code className="font-mono text-caption text-action">{cls}</code>
                  <span className="text-caption text-ink-secondary">{meta}</span>
                  <span className="text-caption text-ink-secondary">· {use}</span>
                </div>
              </div>
            ))}
          </Stack>
        </Card>
      </DocSection>

      <DocSection title="Rules">
        <Prose>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li>Exactly one <code>&lt;h1&gt;</code> per page; never skip a level (h1 → h2 → h3).</li>
            <li>Line length 45–75 characters in body text (<code>max-w-[65ch]</code>).</li>
            <li>Tabular numbers in tables/values (<code>tabular-nums</code>).</li>
            <li>Minimum legible body size: 16px; resize up to 200% without breaking.</li>
          </ul>
        </Prose>
      </DocSection>
    </DocPage>
  );
}

/* ───────────────────────── Theme & Dark mode ───────────────────────── */
const BRAND_PREVIEW = [
  { id: 'blue' as const, label: 'Blue', swatch: '#aad7ff' },
  { id: 'violet' as const, label: 'Violet', swatch: '#c3c9ff' },
  { id: 'green' as const, label: 'Green', swatch: '#a6f4c5' },
  { id: 'salesforce' as const, label: 'Salesforce', swatch: '#1b96ff' },
];

export function TemaPage() {
  const { theme, toggleTheme, brand, setBrand } = useTheme();
  return (
    <DocPage
      group="Get started"
      title="Theme & Dark mode"
      lead="Light and dark come from the same tokens. The theme is set once at the root; swapping data-theme re-themes everything."
      source="foundations/tokens-web.md"
    >
      <DocSection title="Try it">
        <Card>
          <Inline justify="between">
            <Stack gap={1}>
              <CardTitle>Current theme: {theme === 'dark' ? 'dark' : 'light'}</CardTitle>
              <p className="text-body-sm text-ink-secondary">
                The same card, the same tokens — only the semantic values change.
              </p>
            </Stack>
            <Button onClick={toggleTheme}>Toggle theme</Button>
          </Inline>
        </Card>
      </DocSection>

      <DocSection
        title="Brand colors"
        description="See the system in other brands — live preview, combinable with dark mode. Blue #AAD7FF is the default."
      >
        <Card>
          <Inline gap={3}>
            {BRAND_PREVIEW.map((b) => {
              const on = brand === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBrand(b.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-pill border px-4 py-2 text-body-sm transition-colors ${
                    on ? 'border-action bg-hover text-ink' : 'border-border text-ink-secondary hover:bg-hover'
                  }`}
                >
                  <span className="size-4 rounded-pill border border-border" style={{ background: b.swatch }} />
                  {b.label}
                </button>
              );
            })}
          </Inline>
          <Inline gap={3} className="pt-2">
            <Button variant="primary">Action</Button>
            <Button variant="brand">Brand</Button>
            <Button variant="secondary">Alternative</Button>
          </Inline>
        </Card>
        <Callout tone="info">
          Each brand derives an accessible scale: the <strong>brand</strong> is the light surface
          (navy/dark text), the <strong>action</strong> is a shade with ≥ 4.5:1 on white. The rule
          doesn't change — only the values.
        </Callout>
      </DocSection>

      <DocSection
        title="Salesforce — a full skin, not just a color"
        description="The Lightning look: pale blue canvas, white cards, navy text and #0070D2 links."
      >
        <Card>
          <Inline justify="between">
            <Stack gap={1}>
              <CardTitle>
                {brand === 'salesforce' ? 'Salesforce theme active' : 'Salesforce theme'}
              </CardTitle>
              <p className="text-body-sm text-ink-secondary">
                Blue, violet and green swap color only. Salesforce also swaps geometry, density,
                type scale, elevation and easing — everything on this page re-skins live.
              </p>
            </Stack>
            <Button
              variant={brand === 'salesforce' ? 'secondary' : 'primary'}
              onClick={() => setBrand(brand === 'salesforce' ? 'blue' : 'salesforce')}
            >
              {brand === 'salesforce' ? 'Back to Blue' : 'Apply Salesforce'}
            </Button>
          </Inline>
        </Card>

        <Grid cols={4} gap={4}>
          <Swatch bg="bg-action" name="--action" value="blue-60 #1B96FF" textClass="text-on-secondary" />
          <Swatch bg="bg-action-hover" name="--action-hover" value="#0070D2 brandAccessible" textClass="text-on-secondary" />
          <Swatch bg="bg-brand" name="--brand" value="cloud-blue-90 #CFE9FE" textClass="text-on-brand" />
          <Swatch bg="bg-page" name="--sf-page" value="cloud-blue-95 #EAF5FE" textClass="text-ink" />
        </Grid>

        <Grid cols={4} gap={4}>
          <Swatch bg="bg-card" name="--tx-ink" value="#16325C colorTextDefault" textClass="text-ink" />
          <Swatch bg="bg-card" name="--tx-ink-2" value="#54698D colorTextLabel" textClass="text-ink-secondary" />
          <Swatch bg="bg-sunken" name="--sf-sunken" value="#F4F6F9 colorBackground" textClass="text-ink" />
          <Swatch bg="bg-card" name="--sf-border" value="#D8DDE6 colorBorder" textClass="text-ink-secondary" />
        </Grid>

        <Grid cols={4} gap={4}>
          <Swatch bg="bg-success-bg" name="success" value="#04844B" textClass="text-success" />
          <Swatch bg="bg-warning-bg" name="warning" value="#8C4B02" textClass="text-warning" />
          <Swatch bg="bg-danger-bg" name="danger" value="#C23934" textClass="text-danger" />
          <Swatch bg="bg-info-bg" name="info" value="#0B5CAB" textClass="text-info" />
        </Grid>

        <Prose>
          <p>What the theme changes beyond color:</p>
        </Prose>
        <div className="rounded-surface border border-border bg-card px-4">
          <TokenRow token="rounded-control" value="pill → 0.25rem" preview={<span className="text-caption text-ink-secondary">.slds-button</span>} />
          <TokenRow token="rounded-field" value="8px → 0.25rem" preview={<span className="text-caption text-ink-secondary">.slds-input</span>} />
          <TokenRow token="rounded-surface" value="16px → 0.25rem" preview={<span className="text-caption text-ink-secondary">.slds-card</span>} />
          <TokenRow token="rounded-badge" value="pill → 15rem" preview={<span className="text-caption text-ink-secondary">.slds-badge stays a pill</span>} />
          <TokenRow token="rounded-chip" value="pill → 0.25rem" preview={<span className="text-caption text-ink-secondary">.slds-pill is a rectangle</span>} />
          <TokenRow token="--h-field" value="2.75rem → 2rem" preview={<span className="text-caption text-ink-secondary">heightInput 1.875rem + border</span>} />
          <TokenRow token="--h-control-md" value="2.5rem → 2rem" preview={<span className="text-caption text-ink-secondary">lineHeightButton</span>} />
          <TokenRow token="--bw-tab" value="2px → 3px" preview={<span className="text-caption text-ink-secondary">active tab underline</span>} />
          <TokenRow token="text-body" value="16px → 13px" preview={<span className="text-caption text-ink-secondary">fontSizeTextSmall</span>} />
          <TokenRow token="--ff-heading" value="Inter → Roboto" preview={<span className="text-caption text-ink-secondary">headings can use their own family</span>} />
          <TokenRow token="text-h1 weight" value="700 → 500" preview={<span className="text-caption text-ink-secondary">Roboto Medium at 28px</span>} />
          <TokenRow token="shadow-sm" value="soft → navy-tinted diffuse" preview={<span className="text-caption text-ink-secondary">cards float on the blue canvas</span>} />
          <TokenRow token="ease-standard" value="cubic-bezier → linear" preview={<span className="text-caption text-ink-secondary">SLDS transitions are 0.1s linear</span>} />
        </div>

        <Callout tone="warning">
          <strong>The primary blue is the one in the reference screens</strong>, not the darker
          accessible one. That was the explicit brief, and it costs contrast: white on{' '}
          <code>#1B96FF</code> and that same blue as link text both land at{' '}
          <strong>3.06:1</strong> — over the 3:1 floor for large text and UI parts, under the 4.5:1
          AA bar for body-size text. This is as light as the blue can go: one step further
          (<code>#2BA5FF</code>, the <code>accent</code>) falls to 2.65:1 and breaks even that
          floor. Pointing <code>--action</code> at <code>--color-lx-link</code>{' '}
          (<code>#0070D2</code>) in <code>theme.css</code> puts the theme back at AA. Everything
          else in the theme, focus ring included, already clears it.
        </Callout>
        <Callout tone="info">
          Column headers and tab labels go <strong>uppercase and letter-spaced</strong> under this
          theme — a Lightning habit the token layer can't express, so it ships as a rule scoped to{' '}
          <code>[data-brand=&quot;salesforce&quot;]</code> inside <code>@layer components</code>.
        </Callout>
        <Callout tone="warning">
          <strong>Salesforce Sans is licensed and not bundled.</strong> The theme declares it first
          and falls back to the exact <code>$font-family</code> chain from the SDK, so it renders
          correctly without the font and picks it up automatically where it is installed.
        </Callout>
        <Callout tone="info">
          SLDS ships no dark palette. The dark variant is built on the official inverse surfaces
          (<code>#032D60</code> / <code>#001639</code>) rather than a neutral grey, so it keeps the
          Lightning identity, and lightens the action until every pair clears 4.5:1.
        </Callout>
      </DocSection>

      <DocSection title="How it works" description="Swappable semantic tokens + Tailwind's @theme inline.">
        <CodeBlock
          language="css"
          code={`:root            { --action: var(--color-primary-600); --sf-card: #fff; }
[data-theme=dark]{ --action: var(--color-primary-500); --sf-card: #161B26; }

@theme inline {
  --color-action: var(--action);   /* the bg-action utility follows the live token */
  --color-card:   var(--sf-card);
}`}
        />
        <Callout tone="info">
          The brand (<code>#AAD7FF</code>) is intentionally stable in both modes — it's the identity.
          In dark mode, the <strong>action</strong> lightens one step to keep contrast.
        </Callout>
      </DocSection>

      <DocSection title="Provider">
        <CodeBlock
          code={`<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>

// anywhere:
const { theme, toggleTheme, setTheme } = useTheme();`}
        />
      </DocSection>
    </DocPage>
  );
}
