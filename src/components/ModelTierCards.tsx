import { themeVars, wcagText } from '@/lib/theme-colors'

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
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${tiers.length}, 1fr)`,
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.title}
            style={{
              borderTop: `5px solid ${tier.color}`,
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
                color: wcagText(tier.color),
                textAlign: 'center',
              }}
            >
              {tier.title}
            </h3>
            <p
              style={{
                fontSize: '0.8125rem',
                margin: '0 0 0.75rem',
                color: themeVars.textSubtle,
                textAlign: 'center',
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
                      backgroundColor: tier.color,
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
