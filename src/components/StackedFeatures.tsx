import { themeVars, wcagBadgeBg, safeAccent, safeSurface } from '@/lib/theme-colors'

interface StackedFeature {
  title: string
  description: string
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
        <div
          key={feature.title}
          style={{
            borderLeft: `5px solid ${safeAccent(feature.color)}`,
            borderRadius: '0.5rem',
            backgroundColor: themeVars.cardBg,
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
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
              backgroundColor: safeSurface(feature.color) !== feature.color ? safeSurface(feature.color) : wcagBadgeBg(feature.color),
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
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
