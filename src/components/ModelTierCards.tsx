import { themeVars, accentFill, accentText } from '@/lib/theme-colors'

interface ModelTier {
  title: string
  subtitle: string
  items: Array<string>
  color: string
}

export function ModelTierCards({
  tiers,
}: {
  tiers: Array<ModelTier>
}) {
  const columns = tiers.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
  return (
    <div>
      <div
        className={`grid grid-cols-1 ${columns} items-stretch gap-4`}
      >
        {tiers.map((tier) => (
          <div
            key={tier.title}
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
                color: accentText(tier.color),
              }}
            >
              {tier.title}
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                margin: '0 0 0.75rem',
                color: themeVars.textSubtle,
              }}
            >
              {tier.subtitle}
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
              {tier.items.map((item) => (
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
                      backgroundColor: accentFill(tier.color),
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
