import { themeVars, brandVars, type BrandKey } from '@/lib/theme-colors'

interface Tier {
  title: string
  description: React.ReactNode
  badge: string
  brand: BrandKey
}

const TIERS: Array<Tier> = [
  {
    title: 'Read-only (file reads, grep, glob)',
    description: 'No approval needed. Claude can read any file in your working directory freely.',
    badge: 'No Approval',
    brand: 'blue',
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
    brand: 'pink',
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
    brand: 'green',
  },
]

const RULE_EXAMPLES: Array<{ rule: string; note: string }> = [
  { rule: 'Bash(npm run *)', note: 'allow npm scripts' },
  { rule: 'Read(./.env)', note: 'control env file reads' },
  { rule: 'Edit(/src/**/*.ts)', note: 'scope to TS files' },
]

const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.45em',
  borderRadius: '4px',
}

export function PermissionModel() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {TIERS.map((tier) => {
            const b = brandVars[tier.brand]
            return (
              <div
                key={tier.title}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--pm-model-row)',
                  borderRadius: '6px',
                  padding: '0.875rem 1.25rem 0.875rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '5px',
                    backgroundColor: b.accentBar,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: themeVars.heading,
                      marginBottom: '0.15rem',
                    }}
                  >
                    {tier.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: themeVars.textMuted, lineHeight: 1.5 }}>
                    {tier.description}
                  </div>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    backgroundColor: b.badgeBg,
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.badge}
                </span>
              </div>
            )
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              backgroundColor: 'var(--pm-model-purple-card)',
              borderRadius: '6px',
              padding: '1rem 1.25rem 1rem 1.5rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '5px',
                backgroundColor: brandVars.purple.accentBar,
              }}
            />
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: themeVars.heading,
                marginBottom: '0.6rem',
              }}
            >
              Permission Rule Syntax
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {RULE_EXAMPLES.map((ex) => (
                <div
                  key={ex.rule}
                  style={{
                    fontSize: '0.8125rem',
                    color: themeVars.text,
                    lineHeight: 1.5,
                  }}
                >
                  <code style={codeStyle}>{ex.rule}</code>
                  <span style={{ marginLeft: '0.5rem' }}>— {ex.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              backgroundColor: 'var(--pm-model-pink-card)',
              borderRadius: '6px',
              padding: '1rem 1.25rem 1rem 1.5rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '5px',
                backgroundColor: brandVars.pink.accentBar,
              }}
            />
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: themeVars.heading,
                marginBottom: '0.6rem',
              }}
            >
              Precedence Order
            </div>
            <div
              style={{
                fontSize: '0.9375rem',
                color: themeVars.text,
                lineHeight: 1.6,
                marginBottom: '0.35rem',
              }}
            >
              <strong style={{ color: brandVars.pink.text }}>deny</strong>{' '}
              <span style={{ color: themeVars.textMuted }}>&gt;</span>{' '}
              <strong style={{ color: themeVars.text }}>ask</strong>{' '}
              <span style={{ color: themeVars.textMuted }}>&gt;</span>{' '}
              <strong style={{ color: brandVars.green.text }}>allow</strong>
            </div>
            <div style={{ fontSize: '0.8125rem', color: themeVars.text, lineHeight: 1.5 }}>
              A deny rule always wins, regardless of where it appears.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
