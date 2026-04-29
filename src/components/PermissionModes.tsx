import { themeVars, brandVars, type BrandKey } from '@/lib/theme-colors'

interface Mode {
  title: string
  setting?: string
  tagline: string
  bullets: Array<string>
  brand: BrandKey
}

const MODES: Array<Mode> = [
  {
    title: 'Ask Every Time',
    tagline: 'Default • Maximum control',
    bullets: [
      'Permission prompt for every write and command',
      'Best for learning, unfamiliar repos',
      'Production-adjacent work',
    ],
    brand: 'blue',
  },
  {
    title: 'Auto-Approve',
    setting: 'acceptEdits',
    tagline: 'Best balance',
    bullets: [
      'Allow specific categories (reads, safe commands)',
      'Best for daily dev in trusted repos',
      'Still asks for risky operations',
    ],
    brand: 'green',
  },
  {
    title: 'Bypass All',
    setting: 'bypassPermissions',
    tagline: 'Use with caution',
    bullets: [
      'Executes everything without asking',
      'Maximum speed, minimum guardrails',
      'Isolated, low-risk environments only',
    ],
    brand: 'pink',
  },
]

const HIERARCHY: Array<{ label: string; code?: string }> = [
  { label: 'Managed policy' },
  { label: 'CLI arguments' },
  { label: 'Local project', code: 'settings.local.json' },
  { label: 'Shared project', code: 'settings.json' },
  { label: 'User', code: '~/.claude/settings.json' },
]

const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.45em',
  borderRadius: '4px',
}

export function PermissionModes() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            alignItems: 'stretch',
          }}
        >
          {MODES.map((m) => {
            const b = brandVars[m.brand]
            return (
              <div
                key={m.title}
                style={{
                  backgroundColor: themeVars.cardBg,
                  borderRadius: '6px',
                  boxShadow: themeVars.shadow,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '5px', backgroundColor: b.accentBar }} />
                <div
                  style={{
                    padding: '1.25rem 1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: b.text,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: themeVars.textMuted,
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {m.setting && (
                      <>
                        <code style={codeStyle}>{m.setting}</code>{' '}
                        <span style={{ color: themeVars.textSubtle }}>•</span>{' '}
                      </>
                    )}
                    {m.tagline}
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: '0.25rem 0 0',
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {m.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.55rem',
                          fontSize: '0.875rem',
                          color: themeVars.text,
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: b.text,
                            marginTop: '0.5em',
                          }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--pm-modes-callout)',
            borderRadius: '6px',
            padding: '0.875rem 1.25rem 0.875rem 1.5rem',
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
              marginBottom: '0.5rem',
            }}
          >
            Settings Hierarchy (highest wins)
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: themeVars.text,
              lineHeight: 1.7,
              marginBottom: '0.4rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              alignItems: 'center',
            }}
          >
            {HIERARCHY.map((step, i) => (
              <span
                key={step.label}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>
                  <strong style={{ color: themeVars.heading }}>{step.label}</strong>
                  {step.code && (
                    <>
                      {' ('}
                      <code style={codeStyle}>{step.code}</code>
                      {')'}
                    </>
                  )}
                </span>
                {i < HIERARCHY.length - 1 && (
                  <span style={{ color: themeVars.textSubtle }}>→</span>
                )}
              </span>
            ))}
          </div>
          <div style={{ fontSize: '0.875rem', color: themeVars.text, lineHeight: 1.5 }}>
            A <strong style={{ color: brandVars.pink.text }}>deny</strong> at any level
            cannot be overridden by a lower level. Start strict, relax
            selectively.
          </div>
        </div>
      </div>
    </div>
  )
}
