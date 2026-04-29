import { themeVars, brandVars } from '@/lib/theme-colors'

const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.85em',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.45em',
  borderRadius: '4px',
}

interface Step {
  num: number
  body: React.ReactNode
}

const STEPS: Array<Step> = [
  {
    num: 1,
    body: (
      <>
        Create a <code style={codeStyle}>CLAUDE.md</code> with conventions and
        guardrails — 7 lines is enough
      </>
    ),
  },
  {
    num: 2,
    body: (
      <>
        Launch Claude Code and ask: &ldquo;What conventions does this project
        follow?&rdquo;
      </>
    ),
  },
  {
    num: 3,
    body: (
      <>
        Test a guardrail — ask Claude to violate a convention and watch it
        refuse
      </>
    ),
  },
  {
    num: 4,
    body: (
      <>
        Enter plan mode (<strong>Shift+Tab</strong>) — describe a change,
        review the plan, give feedback
      </>
    ),
  },
  {
    num: 5,
    body: (
      <>Approve and execute — verify Claude respected CLAUDE.md in its output</>
    ),
  },
  {
    num: 6,
    body: (
      <>
        The loop:{' '}
        <strong>
          define conventions → plan → review → feedback → execute → refine
        </strong>
      </>
    ),
  },
]

export function LiveDemoSteps() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          margin: '1.5rem 0',
        }}
      >
        {STEPS.map((step) => (
          <div
            key={step.num}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              fontSize: '0.9375rem',
              color: themeVars.text,
              lineHeight: 1.55,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: brandVars.green.badgeBg,
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: 700,
                lineHeight: 1,
                marginTop: '0.1em',
              }}
            >
              {step.num}
            </span>
            <span style={{ flex: 1, paddingTop: '0.35em' }}>
              {step.body}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
