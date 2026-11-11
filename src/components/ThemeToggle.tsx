'use client'

import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { focusRing } from '@/lib/focusRing'
import { switchThemeWithTransition } from '@/lib/themeTransition'

function SunIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
      <path
        strokeLinecap="round"
        d="M10 5.5v-1M13.182 6.818l.707-.707M14.5 10h1M13.182 13.182l.707.707M10 15.5v-1M6.11 13.889l.708-.707M4.5 10h1M6.11 6.111l.708.707"
      />
    </svg>
  )
}

function MoonIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z" />
    </svg>
  )
}

export function ThemeToggle() {
  let { resolvedTheme, setTheme } = useTheme()
  let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  let [mounted, setMounted] = useState(false)
  // The incoming icon turns in only after a click, never on page load.
  // next-themes suppresses transitions while the theme flips, so this is a
  // keyframe animation; the key remounts the icon so it replays each time.
  // The page itself crossfades between themes (lib/themeTransition.ts).
  let [toggled, setToggled] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const iconClass = clsx('h-5 w-5', toggled && 'animate-icon-in')

  return (
    <button
      type="button"
      className={clsx(
        'flex size-11 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5',
        focusRing,
      )}
      aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
      onClick={() => {
        setToggled(true)
        switchThemeWithTransition(() => setTheme(otherTheme))
      }}
    >
      <span key={mounted ? resolvedTheme : 'ssr'} className="contents">
        <SunIcon className={clsx(iconClass, 'stroke-zinc-900 dark:hidden')} />
        <MoonIcon className={clsx(iconClass, 'hidden stroke-white dark:block')} />
      </span>
    </button>
  )
}
