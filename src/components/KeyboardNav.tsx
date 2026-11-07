'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrevNextPage } from '@/lib/usePrevNextPage'

/** How long the footer's kbd hint shows as pressed before the page changes. */
const PRESS_MS = 150

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
        router.push(href)
        return
      }
      hint.setAttribute('data-pressed', '')
      timer = setTimeout(() => router.push(href), PRESS_MS)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return

      const target = e.target as HTMLElement
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target?.isContentEditable) return
      if (target?.closest('[role="dialog"], [data-headlessui-state]')) return

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
