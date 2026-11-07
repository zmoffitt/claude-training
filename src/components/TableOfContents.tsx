'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { focusRing } from '@/lib/focusRing'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Collects h2/h3 elements with rehype-slug-generated IDs from the current
 * article on mount and on every pathname change. Shared by the right-rail
 * and the inline disclosure so both show the same outline.
 */
function useArticleHeadings(): Array<Heading> {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Array<Heading>>([])

  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) {
      setHeadings([])
      return
    }
    const nodes = Array.from(
      article.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'),
    )
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent?.trim() ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      })),
    )
  }, [pathname])

  return headings
}

/**
 * In-page table of contents, rendered as a sticky right-rail.
 *
 * - ≥1366px: narrow rail (w-44, right-3) — common 13"-15" laptop width
 * - ≥1440px: full rail (w-56, right-6) — desktop breakpoint
 * - Below 1366px: hidden, since the left-aligned Prose layout would force
 *   overlap. `InlineTableOfContents` covers those widths instead.
 *
 * Active section tracked via IntersectionObserver.
 */
/** Sections worth an outline entry: H2s other than the closing "Where to go next". */
function jumpableSections(headings: ReturnType<typeof useArticleHeadings>) {
  return headings.filter((h) => h.level === 2 && h.id !== 'where-to-go-next')
}

export function TableOfContents() {
  const headings = useArticleHeadings()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setActiveId(headings[0]?.id ?? null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
          setActiveId(top.target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  // Same rule as the inline outline: two real sections, or no rail. A lone
  // "Where to go next" is the page's ending, not an outline.
  if (jumpableSections(headings).length < 2) return null

  return (
    <aside
      aria-label="On this page"
      className="pointer-events-none fixed top-24 right-3 hidden max-h-[calc(100vh-8rem)] w-44 overflow-y-auto min-[1366px]:block min-[1440px]:right-6 min-[1440px]:w-56"
    >
      <nav className="pointer-events-auto text-xs">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
          On this page
        </p>
        <ul className="space-y-2 border-l border-zinc-900/10 dark:border-white/10">
          {headings.map((h) => (
            <li
              key={h.id}
              style={{ paddingLeft: h.level === 3 ? '1.5rem' : '0.75rem' }}
            >
              <a
                href={`#${h.id}`}
                className={clsx(
                  'block -ml-px border-l-2 py-0.5 pl-3 transition',
                  focusRing,
                  activeId === h.id
                    ? 'border-violet-500 font-medium text-violet-500 dark:border-violet-400 dark:text-violet-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

/**
 * Compact "On this page" disclosure for viewports below 1366px, where the
 * right-rail has no room. Rendered inside the article, above the H1, so
 * reference-mode readers on laptops and phones still get the outline.
 * Only shown when a page has at least two sections worth jumping to.
 */
export function InlineTableOfContents() {
  const headings = useArticleHeadings()
  const sections = headings.filter((h) => h.level === 2)

  if (jumpableSections(headings).length < 2) return null

  return (
    <details className="not-prose group mb-6 rounded-lg border border-zinc-900/10 text-sm min-[1366px]:hidden dark:border-white/10">
      <summary
        className={clsx(
          'flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-2.5 font-medium text-zinc-700 select-none dark:text-zinc-300',
          focusRing,
        )}
      >
        <span>
          On this page
          <span className="ml-2 font-normal text-zinc-500 dark:text-zinc-400">
            {sections.length} sections
          </span>
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          className="h-3 w-3 shrink-0 text-zinc-400 transition-transform group-open:rotate-90"
        >
          <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </summary>
      <ol className="border-t border-zinc-900/10 px-4 py-3 dark:border-white/10">
        {sections.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={clsx(
                'block rounded py-1.5 text-zinc-600 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400',
                focusRing,
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  )
}
