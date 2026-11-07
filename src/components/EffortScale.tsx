// Stack on phones, side by side from the `sm` breakpoint. Classes are spelled
// out so Tailwind's scanner can see them.
function gridForCount(count: number): string {
  if (count === 2) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  if (count === 4) return 'grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch'
  return 'grid grid-cols-1 gap-4 sm:grid-cols-3 items-stretch'
}

import { themeVars, accentText } from '@/lib/theme-colors'

interface EffortColumn {
  arrow: 'up' | 'down'
  title: string
  items: Array<string>
  color: string
}

export function EffortScale({
  columns,
}: {
  columns: Array<EffortColumn>
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
              gap: '1rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: 0,
                color: accentText(col.color),
              }}
            >
              {col.arrow === 'up' ? '\u2191' : '\u2193'}{' '}
              {col.title}
            </h3>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '1.25rem',
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
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    color: themeVars.text,
                  }}
                >
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
