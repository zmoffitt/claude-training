import { brandKey, tagStyle, themeVars } from '@/lib/theme-colors'
import { titleLevel } from '@/lib/headingLevel'

interface StackedFeature {
  title: string
  description: React.ReactNode
  badge: string
  color: string
}

export function StackedFeatures({
  features,
  headingLevel,
}: {
  features: Array<StackedFeature>
  /** The titles' level in the page outline; set by the build, see `lib/headingLevel`. */
  headingLevel?: number | string
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
        // The tag carries the row's color as a tint, hairline, and text, not
        // a solid fill, so it reads as a label. When the row is too narrow for
        // both, the tag drops below the text.
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
              aria-level={titleLevel(headingLevel)}
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
              ...tagStyle(brandKey(feature.color)),
              flexShrink: 0,
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1.25,
              padding: '0.25rem 0.625rem',
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
