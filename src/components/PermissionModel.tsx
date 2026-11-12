import { StackedFeatures } from '@/components/StackedFeatures'
import { themeVars, brandVars } from '@/lib/theme-colors'

// The three tiers are rows of `StackedFeatures`. Each `color` names a step on
// the risk scale (green runs freely, amber asks first, red is highest risk),
// and the row's badge is drawn in it.
const TIERS = [
  {
    title: 'Read-only (file reads, grep, glob)',
    description: 'No approval needed. Claude can read any file in your working directory freely.',
    badge: 'No Approval',
    color: '#078708',
  },
  {
    title: 'Bash commands (shell execution)',
    description: (
      <>
        Requires approval. Once approved, permission persists{' '}
        <strong>for the entire project</strong> (permanent per command pattern).
      </>
    ),
    badge: 'Permanent / Project',
    color: '#E23523',
  },
  {
    title: 'File modifications (create, edit, delete)',
    description: (
      <>
        Requires approval. Permission lasts <strong>until session end</strong>{' '}
        only — must re-approve next session.
      </>
    ),
    badge: 'Session Only',
    color: '#ECB801',
  },
]

const RULE_EXAMPLES: Array<{ rule: string; note: string }> = [
  { rule: 'Bash(npm run *)', note: 'allow npm scripts' },
  { rule: 'Read(./.env)', note: 'control env file reads' },
  { rule: 'Edit(/src/**/*.ts)', note: 'scope to TS files' },
]

/** The site's one card surface. */
const cardStyle: React.CSSProperties = {
  border: '1px solid var(--surface-border)',
  borderRadius: 'var(--radius-card)',
  backgroundColor: themeVars.cardBg,
  padding: '1.25rem 1.5rem',
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 700,
  color: themeVars.heading,
  marginBottom: '0.6rem',
}

export function PermissionModel({ headingLevel }: { headingLevel?: number | string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <StackedFeatures features={TIERS} headingLevel={headingLevel} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Permission Rule Syntax</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {RULE_EXAMPLES.map((ex) => (
              <div
                key={ex.rule}
                style={{ fontSize: '0.8125rem', color: themeVars.text, lineHeight: 1.5 }}
              >
                <code>{ex.rule}</code>: {ex.note}
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitleStyle}>Precedence Order</div>
          <div
            style={{
              fontSize: '0.9375rem',
              color: themeVars.text,
              lineHeight: 1.6,
              marginBottom: '0.35rem',
            }}
          >
            <strong style={{ color: brandVars.red.text }}>deny</strong>{' '}
            <span style={{ color: themeVars.textMuted }}>&gt;</span>{' '}
            <strong style={{ color: brandVars.amber.text }}>ask</strong>{' '}
            <span style={{ color: themeVars.textMuted }}>&gt;</span>{' '}
            <strong style={{ color: brandVars.green.text }}>allow</strong>
          </div>
          <div style={{ fontSize: '0.8125rem', color: themeVars.text, lineHeight: 1.5 }}>
            A deny rule always wins, regardless of where it appears.
          </div>
        </div>
      </div>
    </div>
  )
}
