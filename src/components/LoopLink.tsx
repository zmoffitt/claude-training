'use client'

import { useThemeMode } from '@/lib/useThemeMode'
import { themeColors } from '@/lib/theme-colors'

export function LoopLink({
  href,
  title,
}: {
  href: string
  title: string
}) {
  const mode = useThemeMode()
  const t = themeColors[mode]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        backgroundColor: t.cardBg,
        textDecoration: 'none',
        color: t.heading,
        fontSize: '0.9375rem',
        fontWeight: 600,
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        boxShadow: t.shadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = t.shadow
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Microsoft_Loop_logo.svg/3840px-Microsoft_Loop_logo.svg.png"
        alt="Microsoft Loop"
        width={24}
        height={24}
        style={{ flexShrink: 0 }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 400, color: t.textSubtle, lineHeight: 1 }}>
          Loop Component
        </span>
        <span style={{ lineHeight: 1.3 }}>{title}</span>
      </span>
    </a>
  )
}
