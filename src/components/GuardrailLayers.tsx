import { themeVars } from '@/lib/theme-colors'

/**
 * The five guardrail layers of Session 4, as one numbered stack. The numerals
 * carry the session hue; the chip at the end of each row names what kind of
 * control the layer is. Other pages refer to a layer by its number here.
 */
const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.85em',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.45em',
  borderRadius: '4px',
}

const strong: React.CSSProperties = { fontWeight: 600, color: themeVars.heading }

const LAYERS: Array<{ title: string; kind: string; body: React.ReactNode }> = [
  {
    title: 'CLAUDE.md constraints',
    kind: 'Always-on rules',
    body: (
      <>
        Explicit forbidden actions, the approved tool list, the &ldquo;always ask
        before&rdquo; clauses. The agent reads them every session.
      </>
    ),
  },
  {
    title: 'Permission scoping',
    kind: 'Hard limits',
    body: (
      <>
        File reads OK, file writes scoped to the right paths,{' '}
        <code style={codeStyle}>deny</code> on destructive shell patterns.{' '}
        <strong style={strong}>Deny beats ask beats allow</strong>, always.
      </>
    ),
  },
  {
    title: 'Plan-then-execute',
    kind: 'Reasoning visible',
    body: (
      <>
        Require a written plan in the agent&rsquo;s output before any write. Skills
        can encode this: &ldquo;explain your approach in fewer than five lines,
        then act.&rdquo;
      </>
    ),
  },
  {
    title: 'Checkpoints & escalation',
    kind: 'Stop conditions',
    body: (
      <>
        &ldquo;Stop and ask&rdquo; conditions for sensitive moments: large diffs,
        prod paths, privileged role touches. Hooks block; skills require a human
        OK.
      </>
    ),
  },
  {
    title: 'Definition of done, up front',
    kind: 'Accountability',
    body: (
      <>
        Every agentic workflow defines &ldquo;success&rdquo; <em>before</em> the
        agent runs. Without it, the agent will keep going past the right answer.
      </>
    ),
  },
]

export function GuardrailLayers() {
  return (
    // The wrapper keeps the list out of the reading measure, which narrows a
    // list placed directly in the page column, so the stack matches a Callout.
    <div className="not-prose w-full max-w-2xl lg:max-w-3xl">
    <ol
      role="list"
      style={{
        backgroundColor: themeVars.cardBgWhite,
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {LAYERS.map((layer, i) => (
        <li
          key={layer.title}
          className="flex items-start gap-4 px-5 py-4"
          style={i > 0 ? { borderTop: '1px solid var(--surface-border)' } : undefined}
        >
          <span
            aria-hidden="true"
            className="font-display w-5 shrink-0 text-[1.75rem] leading-none font-bold tracking-[-0.03em]"
            style={{ color: 'var(--session-hue, var(--brand-purple-text))' }}
          >
            {i + 1}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold" style={{ color: themeVars.heading }}>
                <span className="sr-only">Layer {i + 1}: </span>
                {layer.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: themeVars.text }}>
                {layer.body}
              </p>
            </div>
            <span
              className="inline-flex shrink-0 items-center self-start rounded-(--radius-chip) px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide"
              style={{ backgroundColor: 'var(--tint-neutral)', color: themeVars.textMuted }}
            >
              {layer.kind}
            </span>
          </div>
        </li>
      ))}
    </ol>
    </div>
  )
}
