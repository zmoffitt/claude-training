'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'

import { allPages, type PageEntry } from '@/components/Navigation'

const subscribeNever = () => () => {}

/** Words that appear in most paths and say nothing about the page. */
const NOISE = new Set(['docs', 'training', 'claude', 'code', 'and', 'the', 'session'])

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !NOISE.has(t))
}

/** How well a page matches the broken path: shared words between the path's
 * last segment and the page's slug or title, with a bonus for a whole-slug
 * substring either way (a renamed page keeps most of its old name). */
function score(page: PageEntry, pathTokens: string[], lastSegment: string) {
  const slug = page.href.split('/').filter(Boolean).pop() ?? ''
  const pageTokens = new Set([...tokens(slug), ...tokens(page.title)])
  let hits = 0
  for (const t of pathTokens) if (pageTokens.has(t)) hits++
  let s = hits / Math.max(1, pathTokens.length)
  if (lastSegment.length >= 5 && (slug.includes(lastSegment) || lastSegment.includes(slug))) s += 0.5
  return s
}

/**
 * "Did you mean" links on the 404 page: the three pages whose slug or title
 * shares the most with the path that failed. Renders nothing when no page
 * comes close, so the session list below stays the fallback.
 */
export function NotFoundSuggestions() {
  const pathname = usePathname()
  // The export prerenders one 404.html for every missing path, so the server
  // HTML can't know which page was asked for. Wait for hydration to finish
  // before rendering anything that depends on the real path.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false)
  if (!hydrated) return null

  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] ?? ''
  const pathTokens = tokens(lastSegment)
  if (pathTokens.length === 0) return null

  const matches = allPages
    .map((page) => ({ page, s: score(page, pathTokens, lastSegment) }))
    .filter(({ s }) => s >= 0.34)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)

  if (matches.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
        Did you mean
      </p>
      <ul className="flex flex-col gap-1.5">
        {matches.map(({ page }) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              {page.title}
            </Link>
            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{page.group}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
