'use client'

import { usePathname } from 'next/navigation'

/**
 * The current pathname without a trailing slash, so it matches the `href`
 * values in the navigation data. With `trailingSlash: true` the router reports
 * `/docs/foo/` while the nav links are written as `/docs/foo`.
 */
export function usePagePath(): string {
  const pathname = usePathname()
  return pathname.replace(/\/+$/, '') || '/'
}
