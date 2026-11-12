'use client'

import { useIsSm } from '@/lib/useIsSm'
import { themeVars, brandVars, tagColors, type BrandKey } from '@/lib/theme-colors'

/**
 * Each stage is drawn as a tag (tint, hairline, hue text), not a solid fill:
 * the stages are labels in a sequence, and a filled box reads as a button.
 * The one solid fill in the figure is the outcome, the DENIED bar.
 *
 * The stages are neutral except PreToolUse, the gate the walkthrough follows.
 * It is amber, the risk scale's "asks first", and the walkthrough's step for
 * it carries the same amber. Red is kept for the blocked call alone; `Stop`
 * only ends a turn, so it takes no color.
 */
interface LifecycleStage {
  label: string
  brand: BrandKey
}

const STAGES: Array<LifecycleStage> = [
  { label: 'SessionStart', brand: 'neutral' },
  { label: 'UserPromptSubmit', brand: 'neutral' },
  { label: 'PreToolUse', brand: 'amber' },
  { label: 'PostToolUse', brand: 'neutral' },
  { label: 'Stop', brand: 'neutral' },
]

interface WalkStep {
  num: number
  body: React.ReactNode
  emphasized?: boolean
}

type Token =
  | { kind: 'comment'; text: string }
  | { kind: 'punct'; text: string }
  | { kind: 'key'; text: string }
  | { kind: 'string'; text: string }
  | { kind: 'plain'; text: string }
  | { kind: 'newline' }
  | { kind: 'indent'; spaces: number }

const TOKENS_BY_LINE: Array<Array<Token>> = [
  [{ kind: 'comment', text: '// .claude/settings.json' }],
  [{ kind: 'punct', text: '{' }],
  [
    { kind: 'indent', spaces: 2 },
    { kind: 'key', text: '"hooks"' },
    { kind: 'punct', text: ': {' },
  ],
  [
    { kind: 'indent', spaces: 4 },
    { kind: 'key', text: '"PreToolUse"' },
    { kind: 'punct', text: ': [' },
  ],
  [{ kind: 'indent', spaces: 6 }, { kind: 'punct', text: '{' }],
  [
    { kind: 'indent', spaces: 8 },
    { kind: 'plain', text: '"matcher"' },
    { kind: 'punct', text: ': ' },
    { kind: 'string', text: '"Bash"' },
    { kind: 'punct', text: ',' },
  ],
  [
    { kind: 'indent', spaces: 8 },
    { kind: 'plain', text: '"hooks"' },
    { kind: 'punct', text: ': [' },
  ],
  [{ kind: 'indent', spaces: 10 }, { kind: 'punct', text: '{' }],
  [
    { kind: 'indent', spaces: 12 },
    { kind: 'plain', text: '"type"' },
    { kind: 'punct', text: ': ' },
    { kind: 'string', text: '"command"' },
    { kind: 'punct', text: ',' },
  ],
  [
    { kind: 'indent', spaces: 12 },
    { kind: 'plain', text: '"if"' },
    { kind: 'punct', text: ': ' },
    { kind: 'string', text: '"Bash(rm *)"' },
    { kind: 'punct', text: ',' },
  ],
  [
    { kind: 'indent', spaces: 12 },
    { kind: 'plain', text: '"command"' },
    { kind: 'punct', text: ': ' },
    { kind: 'string', text: '"./hooks/block-rm.sh"' },
  ],
  [{ kind: 'indent', spaces: 10 }, { kind: 'punct', text: '}' }],
  [{ kind: 'indent', spaces: 8 }, { kind: 'punct', text: ']' }],
  [{ kind: 'indent', spaces: 6 }, { kind: 'punct', text: '}' }],
  [{ kind: 'indent', spaces: 4 }, { kind: 'punct', text: ']' }],
  [{ kind: 'indent', spaces: 2 }, { kind: 'punct', text: '}' }],
  [{ kind: 'punct', text: '}' }],
]

// Colors for the terminal code block. It is dark in both themes; the tokens
// (tailwind.css) carry one set per theme so it matches the dark palette.
const tokenColor: Record<Token['kind'], string> = {
  comment: 'var(--hl-terminal-comment)',
  key: 'var(--hl-terminal-key)',
  string: 'var(--hl-terminal-string)',
  punct: 'var(--hl-terminal-fg)',
  plain: 'var(--hl-terminal-fg)',
  newline: 'var(--hl-terminal-fg)',
  indent: 'var(--hl-terminal-fg)',
}

const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.4em',
  borderRadius: '4px',
}

export function HooksLifecycle() {
  const isSm = useIsSm()

  const stages = STAGES.map((s) => ({ ...s, ...tagColors(s.brand) }))

  const walkSteps: Array<WalkStep> = [
    {
      num: 1,
      body: (
        <>
          Claude wants to run <code style={codeStyle}>rm -rf /tmp/build</code>
        </>
      ),
    },
    {
      num: 2,
      body: <>PreToolUse fires — JSON sent to hook</>,
      emphasized: true,
    },
    {
      num: 3,
      body: (
        <>
          Matcher: <code style={codeStyle}>&quot;Bash&quot;</code> ✓ &nbsp;If:{' '}
          <code style={codeStyle}>Bash(rm *)</code> ✓
        </>
      ),
    },
    {
      num: 4,
      body: (
        <>
          Script detects <code style={codeStyle}>rm -rf</code> in command
        </>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '1.5rem 0' }}>
        {/* TOP: Lifecycle flow — horizontal SVG on ≥sm, vertical fallback below */}
        {isSm ? (
        <div className="figure-scroll" tabIndex={0} role="region" aria-label="Hook lifecycle diagram">
        <svg
          viewBox="0 0 900 110"
          style={{ width: '100%', minWidth: '47.5rem', maxWidth: '900px', height: 'auto', display: 'block' }}
          aria-label="Hook lifecycle: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse with tool loop, Stop"
        >
          <defs>
            <marker
              id="hook-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: 'var(--hl-arrow)' }} />
            </marker>
          </defs>
          {stages.map((stage, i) => {
            const x = i * 175
            const w = stage.label === 'Stop' ? 90 : 130
            return (
              <g key={stage.label}>
                <rect
                  x={x}
                  y={35}
                  width={w}
                  height={50}
                  rx={6}
                  style={{ fill: stage.background, stroke: stage.border, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }}
                />
                <text
                  x={x + w / 2}
                  y={65}
                  textAnchor="middle"
                  fontFamily="var(--font-sans), system-ui, sans-serif"
                  fontSize="13"
                  fontWeight={600}
                  style={{ fill: stage.text }}
                >
                  {stage.label}
                </text>
                {i < stages.length - 1 && (
                  <line
                    x1={x + w + 5}
                    y1={60}
                    x2={x + 170}
                    y2={60}
                    strokeWidth={2}
                    markerEnd="url(#hook-arrow)"
                    style={{ stroke: 'var(--hl-arrow)' }}
                  />
                )}
              </g>
            )
          })}
          <path
            d="M 575 35 C 575 10, 405 10, 405 35"
            strokeWidth={1.5}
            fill="none"
            strokeDasharray="4 3"
            markerEnd="url(#hook-arrow)"
            style={{ stroke: 'var(--hl-arrow)' }}
          />
          <text
            x={490}
            y={18}
            textAnchor="middle"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="13"
            fontStyle="italic"
            style={{ fill: 'var(--hl-arrow)' }}
          >
            tool loop
          </text>
        </svg>
        </div>
        ) : (
        // On a phone the stages stack as a column of tags joined by a thin
        // line, left-aligned like the text around them. The line runs dashed
        // where the tool loop runs between PreToolUse and PostToolUse.
        <ol
          role="list"
          aria-label="Hook lifecycle stages"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {stages.map((stage, i) => (
            <li key={stage.label}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: stage.background,
                  border: `1px solid ${stage.border}`,
                  borderRadius: 'var(--radius-chip)',
                  color: stage.text,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  lineHeight: 1.25,
                  padding: '0.375rem 0.75rem',
                }}
              >
                {stage.label}
              </span>
              {i < stages.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '1.25rem',
                    marginLeft: '1rem',
                    paddingLeft: '0.625rem',
                    borderLeft: `1px ${stage.label === 'PreToolUse' ? 'dashed' : 'solid'} var(--hl-arrow)`,
                    color: 'var(--hl-arrow)',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}
                >
                  {stage.label === 'PreToolUse' ? '↕ tool loop' : null}
                </div>
              )}
            </li>
          ))}
        </ol>
        )}

        {/* TWO COLUMNS: walkthrough + config */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: themeVars.heading }}>
              Walkthrough: blocking <code style={codeStyle}>rm -rf</code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {walkSteps.map((step) => (
                <div key={step.num}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: step.emphasized ? 'var(--hl-step-bg-active)' : 'var(--hl-step-bg)',
                      border: `1px solid ${step.emphasized ? 'var(--hl-step-border-active)' : 'var(--hl-step-border)'}`,
                      borderRadius: '6px',
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        fontWeight: 700,
                        color: step.emphasized ? brandVars.amber.text : themeVars.textMuted,
                        fontSize: '0.85rem',
                      }}
                    >
                      {step.num}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: themeVars.text, lineHeight: 1.5 }}>
                      {step.body}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    style={{
                      textAlign: 'center',
                      color: 'var(--hl-arrow)',
                      fontSize: '0.9rem',
                      lineHeight: 1,
                      marginTop: '0.25rem',
                    }}
                  >
                    ↓
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem 1rem',
                  backgroundColor: brandVars.red.badgeBg,
                  color: 'var(--on-accent)',
                  fontWeight: 700,
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  marginTop: '0.1rem',
                }}
              >
                ✗ DENIED — Tool call blocked
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: themeVars.heading }}>
              Hook config in <code style={codeStyle}>.claude/settings.json</code>
            </div>

            <pre
              style={{
                margin: 0,
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--hl-terminal-bg)',
                color: 'var(--hl-terminal-fg)',
                fontFamily: '"SF Mono", Menlo, Consolas, monospace',
                fontSize: '0.8125rem',
                lineHeight: 1.55,
                borderRadius: '8px',
                overflowX: 'auto',
              }}
            >
              {TOKENS_BY_LINE.map((line, i) => (
                <span key={i} style={{ display: 'block', whiteSpace: 'pre' }}>
                  {line.map((tok, j) => {
                    if (tok.kind === 'indent') {
                      return <span key={j}>{' '.repeat(tok.spaces)}</span>
                    }
                    if (tok.kind === 'newline') return <span key={j}>{'\n'}</span>
                    return (
                      <span key={j} style={{ color: tokenColor[tok.kind] }}>
                        {tok.text}
                      </span>
                    )
                  })}
                </span>
              ))}
            </pre>

            <div style={{ fontSize: '0.8125rem', color: themeVars.textMuted, lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: themeVars.heading }}>Exit codes:</strong>{' '}
                <code style={codeStyle}>0</code> = allow ·{' '}
                <code style={codeStyle}>2</code> = block · other = warn but
                continue
              </div>
              <div style={{ marginTop: '0.2rem' }}>
                <strong style={{ color: themeVars.heading }}>Hook types:</strong>{' '}
                command, http, prompt, agent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
