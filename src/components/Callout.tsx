'use client'

import clsx from 'clsx'
import { useThemeMode } from '@/lib/useThemeMode'
import { themeColors } from '@/lib/theme-colors'

type CalloutVariant = 'error' | 'warning' | 'info' | 'success'
type CalloutAlign = 'left' | 'center' | 'right'

const variants: Record<CalloutVariant, { color: string; darkColor: string; bg: string; darkBg: string; icon: React.ReactNode }> = {
  error: {
    color: '#DC2626',
    darkColor: '#F87171',
    bg: '#FEF2F2',
    darkBg: 'rgba(220,38,38,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  warning: {
    color: '#D97706',
    darkColor: '#FBBF24',
    bg: '#FFFBEB',
    darkBg: 'rgba(217,119,6,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    color: '#2563EB',
    darkColor: '#60A5FA',
    bg: '#EFF6FF',
    darkBg: 'rgba(37,99,235,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  success: {
    color: '#16A34A',
    darkColor: '#4ADE80',
    bg: '#F0FDF4',
    darkBg: 'rgba(22,163,74,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
  },
}

const alignClasses: Record<CalloutAlign, string> = {
  left:   'mr-auto',
  center: 'mx-auto lg:mx-[calc(50%-min(50%,var(--container-lg)))]',
  right:  'ml-auto',
}

export function Callout({
  variant = 'info',
  align = 'center',
  title,
  children,
}: {
  variant?: CalloutVariant
  align?: CalloutAlign
  title?: string
  children: React.ReactNode
}) {
  const mode = useThemeMode()
  const isDark = mode === 'dark'
  const v = variants[variant]
  const accentColor = isDark ? v.darkColor : v.color

  return (
    <div
      className={clsx(
        'flex w-full max-w-2xl gap-3 rounded-lg px-5 py-4 lg:max-w-3xl',
        alignClasses[align],
      )}
      style={{
        borderLeft: `4px solid ${accentColor}`,
        backgroundColor: isDark ? v.darkBg : v.bg,
      }}
    >
      <div style={{ color: accentColor, flexShrink: 0, marginTop: '0.125rem' }}>
        {v.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        {title && (
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: '1rem',
              color: accentColor,
            }}
          >
            {title}
          </p>
        )}
        <div
          style={{
            margin: 0,
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: isDark ? themeColors.dark.text : themeColors.light.text,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
