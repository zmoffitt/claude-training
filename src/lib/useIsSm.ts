import { useEffect, useState } from 'react'

/**
 * Returns `true` when the viewport is ≥ 640px (Tailwind `sm:` breakpoint).
 *
 * Initial state is `true` so SSR and the first client render emit the
 * desktop variant — desktop users experience no flash, mobile users see
 * the desktop variant for one render before it swaps to the mobile variant.
 * This tradeoff exists because a static export can't know the viewport
 * at build time.
 */
export function useIsSm() {
  const [isSm, setIsSm] = useState(true)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    setIsSm(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsSm(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isSm
}
