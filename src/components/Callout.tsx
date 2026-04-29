import clsx from 'clsx'
import { themeVars } from '@/lib/theme-colors'

type CalloutVariant = 'error' | 'warning' | 'info' | 'success'
type CalloutAlign = 'left' | 'center' | 'right'

const variants: Record<CalloutVariant, { fg: string; bg: string; icon: React.ReactNode }> = {
  error: {
    fg: 'var(--callout-error-fg)',
    bg: 'var(--callout-error-bg)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  warning: {
    fg: 'var(--callout-warning-fg)',
    bg: 'var(--callout-warning-bg)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    fg: 'var(--callout-info-fg)',
    bg: 'var(--callout-info-bg)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  success: {
    fg: 'var(--callout-success-fg)',
    bg: 'var(--callout-success-bg)',
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
  center: 'mx-auto',
  right:  'ml-auto',
}

export function Callout({
  variant = 'info',
  align = 'left',
  title,
  children,
}: {
  variant?: CalloutVariant
  align?: CalloutAlign
  title?: string
  children: React.ReactNode
}) {
  const v = variants[variant]
  const ariaLabel = title ?? variant.charAt(0).toUpperCase() + variant.slice(1)

  return (
    <div
      role="note"
      aria-label={ariaLabel}
      className={clsx(
        'flex w-full max-w-2xl gap-3 rounded-lg px-5 py-4 lg:max-w-3xl',
        alignClasses[align],
      )}
      style={{
        borderLeft: `4px solid ${v.fg}`,
        backgroundColor: v.bg,
      }}
    >
      <div
        aria-hidden="true"
        style={{ color: v.fg, flexShrink: 0, marginTop: '0.125rem' }}
      >
        {v.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        {title && (
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: '1rem',
              color: v.fg,
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
            color: themeVars.text,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
