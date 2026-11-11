'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrevNextPage } from '@/lib/usePrevNextPage'
import { navigateWithTransition } from '@/lib/pageTransition'

/** How long the footer's kbd hint shows as pressed before the page changes. */
const PRESS_MS = 150

/**
 * True when Left / Right belong to something that scrolls sideways where the
 * focus is. The browser does that scrolling itself, so no handler calls
 * `preventDefault` for `handleKeyDown` to see: the scroll container has to be
 * recognised here.
 *
 * - A scroll container that is a tab stop by design, like the region
 *   `mdx-components.tsx` wraps every table in, keeps the keys while the focus
 *   is on it or inside it. That holds even when it has nothing to scroll at
 *   the current width, so one control never scrolls at one width and turns
 *   the page at another.
 * - A container the browser put in the tab order only because it overflows,
 *   like a code block with a long line, keeps them while it has the focus.
 */
function scrollsSideways(target: Element) {
  for (
    let el: Element | null = target;
    el && el !== document.body && el !== document.documentElement;
    el = el.parentElement
  ) {
    const { overflowX } = getComputedStyle(el)
    if (overflowX !== 'auto' && overflowX !== 'scroll') continue
    const tabStop = el instanceof HTMLElement && el.hasAttribute('tabindex') && el.tabIndex >= 0
    if (tabStop || (el === target && el.scrollWidth > el.clientWidth)) return true
  }
  return false
}

export function KeyboardNav() {
  const router = useRouter()
  const { previousPage, nextPage } = usePrevNextPage()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    function go(href: string, key: 'ArrowLeft' | 'ArrowRight') {
      // Press the matching hint in the footer so the shortcut shows itself
      // being used. If the hint is not on screen (phones), go at once.
      const hint = document.querySelector<HTMLElement>(`kbd[data-shortcut="${key}"]`)
      if (!hint || hint.offsetParent === null) {
        navigateWithTransition(router, href)
        return
      }
      hint.setAttribute('data-pressed', '')
      timer = setTimeout(() => navigateWithTransition(router, href), PRESS_MS)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      // A control that takes these keys itself, like SidebarResizeHandle,
      // calls preventDefault. Its handler has run by the time the event
      // reaches this listener on window, so paging stands down for it and
      // for any control added later that does the same.
      if (e.defaultPrevented) return
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return

      const target = e.target as HTMLElement
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target?.isContentEditable) return
      if (target?.closest('[role="dialog"], [data-headlessui-state]')) return
      if (target instanceof Element && scrollsSideways(target)) return

      if (e.key === 'ArrowLeft' && previousPage) {
        e.preventDefault()
        go(previousPage.href, 'ArrowLeft')
      } else if (e.key === 'ArrowRight' && nextPage) {
        e.preventDefault()
        go(nextPage.href, 'ArrowRight')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timer) clearTimeout(timer)
    }
  }, [router, previousPage, nextPage])

  return null
}
