'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { focusRing } from '@/lib/focusRing'
import { navigation, type NavLinkItem } from '@/components/Navigation'

interface Crumb {
  title: string
  href?: string
}

function findTrail(
  pathname: string,
  items: Array<NavLinkItem>,
  trail: Array<Crumb> = [],
): Array<Crumb> | null {
  for (const item of items) {
    const next = [...trail, { title: item.title, href: item.href }]
    if (item.href === pathname) return next
    if (item.children) {
      const found = findTrail(pathname, item.children, next)
      if (found) return found
    }
  }
  return null
}

export function Breadcrumbs() {
  const pathname = usePathname()

  let trail: Array<Crumb> | null = null
  for (const group of navigation) {
    trail = findTrail(pathname, group.links)
    if (trail) break
  }
  // Skip if page isn't in nav, or trail has no ancestry (just the current page)
  if (!trail || trail.length < 2) return null

  const crumbs: Array<Crumb> = [
    { title: 'Home', href: '/' },
    ...trail.slice(0, -1),
    { title: trail[trail.length - 1].title },
  ]

  return (
    <nav aria-label="Breadcrumb" data-pagefind-ignore className="not-prose mb-2">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {crumbs.map((crumb, i) => (
          <li key={`${crumb.title}-${i}`} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-zinc-400 dark:text-zinc-600" aria-hidden="true">
                ›
              </span>
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className={clsx(
                  'rounded text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
                  focusRing,
                )}
              >
                {crumb.title}
              </Link>
            ) : (
              <span
                className="font-medium text-zinc-900 dark:text-white"
                aria-current="page"
              >
                {crumb.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
