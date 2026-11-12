'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'

import { allPages, type PageEntry } from '@/components/Navigation'
import { usePagePath } from '@/lib/usePagePath'

const subscribeNever = () => () => {}

/** Words that appear in most paths and say nothing about the page. */
const NOISE = new Set(['docs', 'training', 'claude', 'code', 'and', 'the', 'session'])

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !NOISE.has(t))
}

/** True when two words differ by one inserted, dropped, or changed letter. */
function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false
  const [short, long] = a.length <= b.length ? [a, b] : [b, a]
  let i = 0
  while (i < short.length && short[i] === long[i]) i++
  // Skip the differing letter in the longer word (or in both, when they are
  // the same length) and require the rest to match.
  const rest = short.length === long.length ? i + 1 : i
  return short.slice(rest) === long.slice(i + 1)
}

/**
 * Whether a word from the broken path and a word from a page are the same
 * word: equal, a singular against its plural ("hook" and "hooks"), or one
 * typo apart ("permisions" and "permissions"). Short words must match
 * exactly, since one letter changes most of them into another word.
 */
function sameWord(a: string, b: string) {
  if (a === b) return true
  const [short, long] = a.length <= b.length ? [a, b] : [b, a]
  if (short.length >= 4 && long.startsWith(short) && long.length - short.length <= 3) return true
  return short.length >= 5 && withinOneEdit(short, long)
}

function parentOf(path: string) {
  return path.slice(0, path.lastIndexOf('/'))
}

/** How well a page matches the broken path: the share of the path's last
 * segment that the page's slug or title also says, with a bonus for a slug
 * that contains the segment or the reverse (a renamed page keeps most of its
 * old name) and a smaller one for a page in the same folder. */
function score(page: PageEntry, path: string, pathTokens: string[], lastSegment: string) {
  const slug = page.href.split('/').filter(Boolean).pop() ?? ''
  const pageTokens = [...tokens(slug), ...tokens(page.title)]
  const hits = pathTokens.filter((t) => pageTokens.some((p) => sameWord(t, p))).length
  if (hits === 0) return 0
  let s = hits / pathTokens.length
  if (lastSegment.length >= 4 && (slug.includes(lastSegment) || lastSegment.includes(slug))) s += 0.5
  if (parentOf(page.href) === parentOf(path)) s += 0.2
  return s
}

interface Suggestions {
  label: string
  pages: PageEntry[]
  /** Name each page's sidebar group beside it. Pointless when they share one. */
  showGroup: boolean
}

/**
 * What to offer for a path that has no page, in order of preference:
 * the pages inside it, when the path is a section with no page of its own
 * (`/docs/tips`); the pages whose name is close to its last segment; or the
 * nearest page above it.
 */
function suggestionsFor(requested: string): Suggestions | null {
  // Page paths are lowercase; a path typed with capitals should still match.
  const path = requested.toLowerCase()
  const inside = allPages.filter((page) => page.href.startsWith(`${path}/`))
  if (inside.length > 0) {
    const depth = (page: PageEntry) => page.href.split('/').length
    const nearest = Math.min(...inside.map(depth))
    return {
      label: 'In this section',
      pages: inside.filter((p) => depth(p) === nearest).slice(0, 6),
      showGroup: false,
    }
  }

  const lastSegment = path.split('/').filter(Boolean).pop() ?? ''
  const pathTokens = tokens(lastSegment)
  if (pathTokens.length > 0) {
    const close = allPages
      .map((page) => ({ page, s: score(page, path, pathTokens, lastSegment) }))
      .filter(({ s }) => s >= 0.34)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(({ page }) => page)
    if (close.length > 0) return { label: 'Did you mean', pages: close, showGroup: true }
  }

  for (let above = parentOf(path); above.length > 1; above = parentOf(above)) {
    const page = allPages.find((p) => p.href === above)
    if (page) return { label: 'Nearest page', pages: [page], showGroup: true }
  }
  return null
}

/**
 * Recovery links on the 404 page, chosen from the path that failed. Renders
 * nothing when the path gives no lead, so the session list below stays the
 * fallback.
 */
export function NotFoundSuggestions() {
  const path = usePagePath()
  // The export prerenders one 404.html for every missing path, so the server
  // HTML can't know which page was asked for. Wait for hydration to finish
  // before rendering anything that depends on the real path.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false)
  if (!hydrated) return null

  const suggestions = suggestionsFor(path)
  if (!suggestions) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
        {suggestions.label}
      </p>
      <ul className="flex flex-col gap-1.5">
        {suggestions.pages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              {page.title}
            </Link>
            {suggestions.showGroup && (
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{page.group}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
