// Stack on phones, side by side from the `sm` breakpoint. Classes are spelled
// out so Tailwind's scanner can see them.
function gridForCount(count: number): string {
  if (count === 2) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  if (count === 4) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  return 'grid grid-cols-1 gap-4 sm:grid-cols-3 items-stretch'
}

import { themeVars, accentText, wcagBadgeBg } from '@/lib/theme-colors'

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
}: {
  cards: Array<ComparisonCard>
}) {
  return (
    <div>
      <div className={gridForCount(cards.length)}>
        {cards.map((card) => {
          const safeTextColor = accentText(card.color)
          const safeBadgeBg = wcagBadgeBg(card.badgeColor)
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
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: safeBadgeBg,
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    padding: '0.375rem 1.25rem',
                    borderRadius: 'var(--radius-chip)',
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
