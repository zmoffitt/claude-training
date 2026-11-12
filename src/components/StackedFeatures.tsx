import { themeVars, wcagBadgeBg, safeSurface } from '@/lib/theme-colors'

interface StackedFeature {
  title: string
  description: React.ReactNode
  badge: string
  color: string
}

export function StackedFeatures({
  features,
}: {
  features: Array<StackedFeature>
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {features.map((feature) => (
        // The badge carries the row's color. When the row is too narrow for
        // both, the badge drops below the text.
        <div
          key={feature.title}
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-card)',
            backgroundColor: themeVars.cardBg,
            padding: '1.25rem 1.5rem',
          }}
        >
          <div style={{ flex: '1 1 14rem', minWidth: 0 }}>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                margin: 0,
                color: themeVars.text,
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                margin: '0.25rem 0 0',
                color: themeVars.textSubtle,
              }}
            >
              {feature.description}
            </p>
          </div>
          <span
            style={{
              flexShrink: 0,
              // A deep surface holds white text in both themes; a badge fill
              // takes the theme's on-accent color.
              backgroundColor: safeSurface(feature.color) !== feature.color ? safeSurface(feature.color) : wcagBadgeBg(feature.color),
              color: safeSurface(feature.color) !== feature.color ? '#ffffff' : 'var(--on-accent)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-chip)',
              whiteSpace: 'nowrap',
            }}
          >
            {feature.badge}
          </span>
        </div>
      ))}
    </div>
  )
}
