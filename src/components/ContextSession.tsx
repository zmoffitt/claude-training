import { themeVars, brandVars, type BrandKey } from '@/lib/theme-colors'

interface BarSegment {
  brand: BrandKey | 'remaining'
  width: number
  legend: string
}

const BAR_SEGMENTS: Array<BarSegment> = [
  { brand: 'purple', width: 8, legend: 'System + CLAUDE.md' },
  { brand: 'blue', width: 20, legend: 'Conversation' },
  { brand: 'green', width: 45, legend: 'Tools + file reads + output' },
  { brand: 'remaining', width: 27, legend: 'Remaining' },
]

type BranchTint = 'blue' | 'green' | 'purple' | 'pink' | 'neutral'

interface BranchRow {
  brand: BrandKey
  rowTint: BranchTint
  glyph: string
  label: string
  description: string
}

const BRANCHES: Array<BranchRow> = [
  { brand: 'green',  rowTint: 'neutral', glyph: '→', label: 'Continue',  description: 'keep going in the same session' },
  { brand: 'blue',   rowTint: 'blue',    glyph: '←', label: '/rewind',   description: 'jump back, drop the failed attempt' },
  { brand: 'purple', rowTint: 'purple',  glyph: '✕', label: '/clear',    description: 'start fresh, you write what carries forward' },
  { brand: 'green',  rowTint: 'green',   glyph: '↳', label: 'Compact',   description: 'Claude summarizes the session (lossy)' },
  { brand: 'pink',   rowTint: 'pink',    glyph: '↗', label: 'Subagent',  description: 'delegate to a fresh context, get summary back' },
]

export function ContextSession() {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          margin: '1.5rem 0',
        }}
      >
        {/* LEFT: What fills your 1M context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: themeVars.heading }}>
            What Fills Your 1M Context
          </div>

          <div
            style={{
              backgroundColor: 'var(--cs-legend-tile)',
              borderRadius: '6px',
              padding: '0.875rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '36px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '0.75rem',
              }}
              role="img"
              aria-label="Stacked bar showing context budget allocation: System and CLAUDE.md 8%, Conversation 20%, Tools and file reads 45%, Remaining 27%"
            >
              {BAR_SEGMENTS.map((seg) => (
                <div
                  key={seg.legend}
                  style={{
                    width: `${seg.width}%`,
                    backgroundColor:
                      seg.brand === 'remaining'
                        ? 'transparent'
                        : brandVars[seg.brand].accentBar,
                    backgroundImage:
                      seg.brand === 'remaining'
                        ? 'repeating-linear-gradient(135deg, var(--cs-legend-tile), var(--cs-legend-tile) 4px, var(--cs-bar-track) 4px, var(--cs-bar-track) 8px)'
                        : undefined,
                    border:
                      seg.brand === 'remaining'
                        ? `1px solid ${themeVars.textSubtle}`
                        : undefined,
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem 1rem',
                marginBottom: '0.5rem',
              }}
            >
              {BAR_SEGMENTS.map((seg) => (
                <div
                  key={seg.legend}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      flexShrink: 0,
                      backgroundColor:
                        seg.brand === 'remaining'
                          ? 'transparent'
                          : brandVars[seg.brand].accentBar,
                      border:
                        seg.brand === 'remaining'
                          ? `1px solid ${themeVars.textSubtle}`
                          : undefined,
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: themeVars.textMuted }}>
                    {seg.legend}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: themeVars.textSubtle,
                borderTop: '1px solid var(--cs-bar-track)',
                paddingTop: '0.45rem',
              }}
            >
              <span>0</span>
              <span style={{ fontWeight: 700, color: themeVars.heading }}>
                1,000,000 tokens
              </span>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              backgroundColor: 'var(--cs-context-rot)',
              borderRadius: '6px',
              padding: '0.7rem 0.95rem 0.7rem 1.15rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: brandVars.pink.accentBar,
              }}
            />
            <span style={{ fontSize: '0.875rem', color: themeVars.text, lineHeight: 1.5 }}>
              <strong style={{ color: brandVars.pink.text }}>Context rot:</strong>{' '}
              as context fills, attention spreads — older, irrelevant content
              dilutes focus. More tokens ≠ better performance.
            </span>
          </div>
        </div>

        {/* RIGHT: Every Turn Is a Branching Point */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: themeVars.heading }}>
            Every Turn Is a Branching Point
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {BRANCHES.map((row) => {
              const b = brandVars[row.brand]
              return (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: `var(--cs-branch-${row.rowTint})`,
                    borderRadius: '6px',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: b.badgeBg,
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {row.glyph}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: themeVars.text, lineHeight: 1.5 }}>
                    <strong style={{ color: themeVars.heading }}>{row.label}</strong>{' '}
                    <span style={{ color: themeVars.textMuted }}>— {row.description}</span>
                  </span>
                </div>
              )
            })}
          </div>

          <div
            style={{
              position: 'relative',
              backgroundColor: 'var(--cs-top-habit)',
              borderRadius: '6px',
              padding: '0.7rem 0.95rem 0.7rem 1.15rem',
              overflow: 'hidden',
              marginTop: '0.25rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: brandVars.blue.accentBar,
              }}
            />
            <span style={{ fontSize: '0.875rem', color: themeVars.text, lineHeight: 1.5 }}>
              <strong style={{ color: brandVars.blue.text }}>Top habit:</strong>{' '}
              rewind instead of correcting. &ldquo;That didn&rsquo;t work, try
              X&rdquo; pollutes context. Rewind drops the failed attempt
              entirely.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
