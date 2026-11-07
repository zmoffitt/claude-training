'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { appPath, navigateWithTransition, settlePathname } from '@/lib/pageTransition'

/**
 * Routes in-site link clicks through `navigateWithTransition` and tells the
 * transition when the new page has rendered. Listens in the capture phase so
 * it runs before Next's Link handler; `preventDefault` makes Link stand down
 * while any `onClick` on the link (closing the mobile drawer) still runs.
 * Links marked `data-transition="none"` keep their own behavior.
 */
export function PageTransitions() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    settlePathname(pathname)
    // A new page closes the phone drawer; nothing else does on navigation.
    useMobileNavigationStore.getState().close()
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const target = e.target as Element | null
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download') || anchor.dataset.transition === 'none') return

      const url = new URL(anchor.href, location.href)
      if (url.origin !== location.origin) return
      const next = appPath(url.pathname)
      const current = appPath(location.pathname)
      if (next === current) return // same page, or a hash jump
      if (url.hash) return // deep links keep the browser's own scroll handling

      e.preventDefault()
      navigateWithTransition(router, next + url.search)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  return null
}
