'use client'

import { usePathname } from 'next/navigation'
import { allPages } from '@/components/Navigation'

export function usePrevNextPage() {
  const pathname = usePathname()
  const currentIndex = allPages.findIndex((page) => page.href === pathname)

  if (currentIndex === -1) {
    return { previousPage: undefined, nextPage: undefined }
  }

  return {
    previousPage: allPages[currentIndex - 1],
    nextPage: allPages[currentIndex + 1],
  }
}
