'use client'

import { useThemeMode } from '@/lib/useThemeMode'
import { themeColors } from '@/lib/theme-colors'

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
  const mode = useThemeMode()
  const t = themeColors[mode]

  return (
    <div style={{ maxWidth: 'none' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {columns.map((col) => (
          <div
            key={col.title}
            style={{
              borderTop: `5px solid ${col.color}`,
              borderRadius: '0.5rem',
              backgroundColor: t.cardBg,
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
                color: col.color,
                textAlign: 'center',
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
                    color: t.text,
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
