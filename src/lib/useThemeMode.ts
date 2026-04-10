'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useThemeMode() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return mounted && resolvedTheme === 'dark' ? 'dark' : 'light'
}
