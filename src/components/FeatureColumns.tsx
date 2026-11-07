// Stack on phones, side by side from the `sm` breakpoint. Classes are spelled
// out so Tailwind's scanner can see them.
function gridForCount(count: number): string {
  if (count === 2) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  if (count === 4) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  return 'grid grid-cols-1 gap-4 sm:grid-cols-3 items-stretch'
}

import { themeVars, accentFill, accentText } from '@/lib/theme-colors'

interface FeatureColumn {
  title: string
  subtitle: string
  items: Array<string>
  color: string
}

export function FeatureColumns({
  columns,
}: {
  columns: Array<FeatureColumn>
}) {
  return (
    <div>
      <div className={gridForCount(columns.length)}>
        {columns.map((col) => (
          <div
            key={col.title}
            style={{
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-card)',
              backgroundColor: themeVars.cardBg,
              padding: '1.5rem 1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: 0,
                color: themeVars.heading,
              }}
            >
              {col.title}
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                margin: '0 0 0.75rem',
                color: accentText(col.color),
              }}
            >
              {col.subtitle}
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
              }}
            >
              {col.items.map((item) => (
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
                      width: 10,
                      height: 10,
                      minWidth: 10,
                      borderRadius: '50%',
                      backgroundColor: accentFill(col.color),
                      marginTop: '0.375rem',
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
