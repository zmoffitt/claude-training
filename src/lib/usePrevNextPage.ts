'use client'

import { usePagePath } from '@/lib/usePagePath'
import { allPages } from '@/components/Navigation'

export function usePrevNextPage() {
  const pathname = usePagePath()
  const currentIndex = allPages.findIndex((page) => page.href === pathname)

  if (currentIndex === -1) {
    return { previousPage: undefined, nextPage: undefined, currentPage: undefined }
  }

  return {
    currentPage: allPages[currentIndex],
    previousPage: allPages[currentIndex - 1],
    nextPage: allPages[currentIndex + 1],
  }
}
