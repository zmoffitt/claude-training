'use client'

import { MotionConfig } from 'framer-motion'
import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

function ConsoleGreeting() {
  const greeted = useRef(false)
  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    // Dev-facing greeting. One-time per page load; skipped if already logged.
    console.log(
      '%cZachary Moffitt × AI Training',
      'font-weight: 700; color: #6240e8; font-size: 13px; letter-spacing: 0.02em;',
    )
    console.log(
      '%cInternal docs by Zachary Moffitt for Cloud and IAM teams. Contribute via PR.',
      'color: #6F6F6F; font-size: 11px;',
    )
  }, [])
  return null
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ThemeWatcher />
      <ConsoleGreeting />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  )
}
