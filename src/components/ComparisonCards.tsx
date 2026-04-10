'use client'

import { useThemeMode } from '@/lib/useThemeMode'
import { themeColors } from '@/lib/theme-colors'

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
  const mode = useThemeMode()
  const t = themeColors[mode]

  return (
    <div style={{ maxWidth: 'none' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              borderTop: `5px solid ${card.color}`,
              borderRadius: '0.5rem',
              backgroundColor: t.cardBg,
              boxShadow: t.shadow,
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
                color: t.heading,
                textAlign: 'center',
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                fontStyle: 'italic',
                margin: 0,
                color: t.textMuted,
                textAlign: 'center',
              }}
            >
              {card.subtitle}
            </p>
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: card.badgeColor,
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.375rem 1.25rem',
                  borderRadius: '0.375rem',
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
                color: t.textMuted,
                flex: 1,
              }}
            >
              {card.steps}
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                fontStyle: 'italic',
                margin: 0,
                color: card.color,
              }}
            >
              {card.takeaway}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
