import { useSyncExternalStore } from 'react'

import { allPages } from '@/components/Navigation'

/**
 * Page changes run through the View Transitions API when the browser has it
 * and the reader has not asked for reduced motion. The sidebar marker glides
 * to the new row, the breadcrumb crossfades, and the article slides in from
 * the direction of travel (see the `::view-transition-*` rules in
 * tailwind.css). Everywhere else, `router.push` as before.
 */

type Direction = 'forward' | 'back' | 'none'

type Router = { push: (href: string) => void }

/** How long to hold the old frame while the next page's data arrives. Links
 * in view are prefetched, so this rarely matters; past it the transition
 * finishes on the old frame and the new page swaps in plainly when it lands,
 * which beats a frozen screen. */
const SETTLE_TIMEOUT_MS = 400

let active = false
const listeners = new Set<() => void>()

function setActive(next: boolean) {
  if (active === next) return
  active = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** True while a view transition is capturing the next page. Components that
 * animate position themselves (the sidebar marker) hand off to the transition
 * while this is set, so the snapshot shows the settled layout. */
export function useTransitionActive() {
  return useSyncExternalStore(subscribe, () => active, () => false)
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function normalizePath(pathname: string) {
  const p = pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

/** Strips the base path from a document pathname so it matches `allPages`. */
export function appPath(pathname: string) {
  const p = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname
  return normalizePath(p || '/')
}

function directionTo(from: string, to: string): Direction {
  const a = allPages.findIndex((p) => normalizePath(p.href) === from)
  const b = allPages.findIndex((p) => normalizePath(p.href) === to)
  if (a === -1 || b === -1 || a === b) return 'none'
  return b > a ? 'forward' : 'back'
}

let pending: { target: string; resolve: () => void } | null = null

/** Called by `PageTransitions` whenever the app pathname changes. */
export function settlePathname(pathname: string) {
  if (pending && normalizePath(pathname) === pending.target) {
    pending.resolve()
    pending = null
  }
}

export function navigateWithTransition(router: Router, href: string) {
  const target = normalizePath(href)
  const doc = document as Document & {
    startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> }
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!doc.startViewTransition || reduce || active) {
    router.push(href)
    return
  }

  document.documentElement.dataset.navDirection = directionTo(appPath(location.pathname), target)
  setActive(true)

  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          pending = null
          resolve()
        }, SETTLE_TIMEOUT_MS)
        pending = {
          target,
          resolve: () => {
            clearTimeout(timer)
            resolve()
          },
        }
        router.push(href)
      }),
  )

  transition.finished.finally(() => {
    setActive(false)
    delete document.documentElement.dataset.navDirection
  })
}
