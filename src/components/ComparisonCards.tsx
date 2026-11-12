// Stack on phones, side by side from the `sm` breakpoint. Classes are spelled
// out so Tailwind's scanner can see them.
function gridForCount(count: number): string {
  if (count === 2) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  if (count === 4) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  return 'grid grid-cols-1 gap-4 sm:grid-cols-3 items-stretch'
}

import { themeVars, accentText, brandKey, tagStyle } from '@/lib/theme-colors'
import { titleLevel } from '@/lib/headingLevel'

interface ComparisonCard {
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  color: string
  steps: string
  takeaway: string
}

export function ComparisonCards({
  cards,
  headingLevel,
}: {
  cards: Array<ComparisonCard>
  /** The titles' level in the page outline; set by the build, see `lib/headingLevel`. */
  headingLevel?: number | string
}) {
  return (
    <div>
      <div className={gridForCount(cards.length)}>
        {cards.map((card) => {
          const safeTextColor = accentText(card.color)
          return (
            <div
              key={card.title}
              style={{
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-card)',
                backgroundColor: themeVars.cardBg,
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <h3
                aria-level={titleLevel(headingLevel)}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: safeTextColor,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  margin: 0,
                  color: themeVars.textMuted,
                }}
              >
                {card.subtitle}
              </p>
              <div>
                {/* A tag, not a solid fill: the value labels the card and
                    is not a button. */}
                <span
                  style={{
                    ...tagStyle(brandKey(card.badgeColor)),
                    display: 'inline-block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    padding: '0.25rem 0.75rem',
                  }}
                >
                  {card.badge}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  margin: 0,
                  color: themeVars.textMuted,
                  flex: 1,
                }}
              >
                {card.steps}
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  margin: 0,
                  color: safeTextColor,
                }}
              >
                {card.takeaway}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
