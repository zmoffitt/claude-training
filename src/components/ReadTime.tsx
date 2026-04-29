import { themeVars } from '@/lib/theme-colors'

export function ReadTime({ minutes }: { minutes: number }) {
  return (
    <div
      style={{
        marginTop: 0,
        marginBottom: '1.25rem',
        fontSize: '0.8125rem',
        color: themeVars.textMuted,
        letterSpacing: '0.01em',
      }}
    >
      ~{minutes} min read
    </div>
  )
}
