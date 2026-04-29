'use client'

import { useIsSm } from '@/lib/useIsSm'
import { themeVars, brandVars, type BrandKey } from '@/lib/theme-colors'

interface LifecycleStage {
  label: string
  brand: BrandKey | 'neutral'
}

const STAGES: Array<LifecycleStage> = [
  { label: 'SessionStart', brand: 'blue' },
  { label: 'UserPrompt', brand: 'neutral' },
  { label: 'PreToolUse', brand: 'purple' },
  { label: 'PostToolUse', brand: 'green' },
  { label: 'Stop', brand: 'red' },
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

// Colors for the dark terminal code block — always dark, so fixed hex is fine.
const tokenColor: Record<Token['kind'], string> = {
  comment: '#A3A4A4',
  key: '#858DF8',
  string: '#9CE390',
  punct: '#DFE0DF',
  plain: '#DFE0DF',
  newline: '#DFE0DF',
  indent: '#DFE0DF',
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

  const stages = STAGES.map((s) => ({
    ...s,
    color: s.brand === 'neutral' ? '#444443' : brandVars[s.brand].badgeBg,
  }))

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
        <svg
          viewBox="0 0 900 110"
          style={{ width: '100%', maxWidth: '900px', height: 'auto' }}
          aria-label="Hook lifecycle: SessionStart, UserPrompt, PreToolUse, PostToolUse with tool loop, Stop"
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
                <rect x={x} y={35} width={w} height={50} rx={8} style={{ fill: stage.color }} />
                <text
                  x={x + w / 2}
                  y={65}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                  fontSize="13"
                  fontWeight={700}
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
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="11"
            fontStyle="italic"
            style={{ fill: 'var(--hl-arrow)' }}
          >
            tool loop
          </text>
        </svg>
        ) : (
        <ol
          role="list"
          aria-label="Hook lifecycle stages"
          style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
        >
          {stages.map((stage, i) => (
            <li key={stage.label}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  backgroundColor: stage.color,
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {stage.label}
              </div>
              {i < stages.length - 1 && (
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
                  {stage.label === 'PreToolUse' ? '↕ tool loop' : '↓'}
                </div>
              )}
            </li>
          ))}
        </ol>
        )}

        {/* TWO COLUMNS: walkthrough + config */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                      border: '1px solid var(--hl-step-border)',
                      borderRadius: '6px',
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        fontWeight: 700,
                        color: brandVars.purple.text,
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
                  color: '#ffffff',
                  fontWeight: 800,
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
                color: '#EBEDEC',
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
