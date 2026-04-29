import { useEffect, useState } from 'react'

/** Returns `true` when the viewport is ≥ 1024px (Tailwind `lg:` breakpoint). */
export function useIsLg() {
  const [isLg, setIsLg] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    setIsLg(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isLg
}
