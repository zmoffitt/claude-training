'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrevNextPage } from '@/lib/usePrevNextPage'

export function KeyboardNav() {
  const router = useRouter()
  const { previousPage, nextPage } = usePrevNextPage()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return

      const target = e.target as HTMLElement
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target?.isContentEditable) return
      if (target?.closest('[role="dialog"], [data-headlessui-state]')) return

      if (e.key === 'ArrowLeft' && previousPage) {
        e.preventDefault()
        router.push(previousPage.href)
      } else if (e.key === 'ArrowRight' && nextPage) {
        e.preventDefault()
        router.push(nextPage.href)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, previousPage, nextPage])

  return null
}
