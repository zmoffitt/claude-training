import { themeVars, wcagText } from '@/lib/theme-colors'

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
                textAlign: 'center',
              }}
            >
              {col.title}
            </h3>
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                margin: '0 0 0.75rem',
                color: wcagText(col.color),
                textAlign: 'center',
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
                      backgroundColor: col.color,
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
