'use client'

import { useThemeMode } from '@/lib/useThemeMode'
import { themeColors } from '@/lib/theme-colors'

interface PillarCard {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  href?: string
}

export function PillarCards({
  cards,
  quote,
  quoteColor = '#3B2D6B',
}: {
  cards: Array<PillarCard>
  quote?: string
  quoteColor?: string
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
        }}
      >
        {cards.map((card) => {
          const Wrapper = card.href ? 'a' : 'div'
          const wrapperProps = card.href
            ? { href: card.href, target: '_blank' as const, rel: 'noopener noreferrer' }
            : {}

          return (
            <Wrapper
              key={card.title}
              {...wrapperProps}
              style={{
                borderTop: `4px solid ${card.color}`,
                borderRadius: '0.5rem',
                backgroundColor: t.cardBgWhite,
                boxShadow: t.shadow,
                padding: '1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                ...(card.href ? { cursor: 'pointer' } : {}),
              }}
              onMouseEnter={card.href ? (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              } : undefined}
              onMouseLeave={card.href ? (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = t.shadow
              } : undefined}
            >
              <div style={{ color: card.color, width: 36, height: 36 }}>
                {card.icon}
              </div>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  margin: 0,
                  color: t.heading,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  margin: 0,
                  color: t.textMuted,
                }}
              >
                {card.description}
              </p>
            </Wrapper>
          )
        })}
      </div>
      {quote && (
        <div
          style={{
            marginTop: '1rem',
            backgroundColor: quoteColor,
            borderRadius: '0.5rem',
            padding: '1rem 1.5rem',
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        >
          {quote}
        </div>
      )}
    </div>
  )
}

/* ── Reusable SVG icons ── */

export function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M9 21h6" />
      <path d="M9 18h6" />
      <path d="M10 18V15.4C10 14.2 9.2 13.1 8.2 12.4A5 5 0 1 1 15.8 12.4C14.8 13.1 14 14.2 14 15.4V18" />
    </svg>
  )
}

export function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

export function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  )
}

export function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  )
}

export function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export function LaptopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
    </svg>
  )
}

export function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}

export function PuzzleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.618 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" />
    </svg>
  )
}
