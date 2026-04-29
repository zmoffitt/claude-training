import clsx from 'clsx'

import { themeVars } from '@/lib/theme-colors'

interface ProConCard {
  icon: React.ReactNode
  title: string
  items: Array<string>
  color: string
  bulletColor: string
  bgLight: string
  bgDark: string
}

// Stack on mobile, restore N columns at sm:. 4-card layouts step through 2x2
// at sm: before going to 4-across at lg: to avoid cramped column widths
// inside the max-w-prose container.
const gridForCount: Record<number, string> = {
  2: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
  3: 'grid grid-cols-1 gap-4 sm:grid-cols-3',
  4: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
}

export function ProConCards({
  cards,
}: {
  cards: Array<ProConCard>
}) {
  const gridClass =
    gridForCount[cards.length] ?? 'grid grid-cols-1 gap-4 sm:grid-cols-2'

  return (
    <div>
      <div className={clsx(gridClass, 'items-stretch not-prose')}>
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              borderTop: `5px solid ${card.color}`,
              borderRadius: '0.5rem',
              // light-dark() reads color-scheme on <html>; our blocking script
              // sets that in <head> before first paint, so per-card bg is
              // correct on SSR + first render (no FOLM).
              backgroundColor: `light-dark(${card.bgLight}, ${card.bgDark})`,
              padding: '1.5rem 1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <div style={{ width: 44, height: 44 }}>
              {card.icon}
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: '0 0 0.75rem',
                color: themeVars.heading,
                textAlign: 'center',
              }}
            >
              {card.title}
            </h3>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
              }}
            >
              {card.items.map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    color: themeVars.text,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      minWidth: 12,
                      borderRadius: '50%',
                      backgroundColor: card.bulletColor,
                      marginTop: '0.35rem',
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Preset icons ── */

export function CheckCircleFilledIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#0FAC27" />
      <path d="M7.5 12l3 3 6-6" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function WarningTriangleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#CD000A" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.2" fill="white" />
    </svg>
  )
}
