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
 * In-page table of contents, rendered as a sticky right-rail.
 *
 * - ≥1366px: narrow rail (w-44, right-3) — common 13"-15" laptop width
 * - ≥1440px: full rail (w-56, right-6) — desktop breakpoint
 * - Below 1366px: hidden, since the left-aligned Prose layout would force
 *   overlap (sidebar 352 + content 768 + TOC + gutters > viewport).
 *
 * Reads h2/h3 elements with rehype-slug-generated IDs from the current
 * article on mount + pathname change. Active section tracked via
 * IntersectionObserver.
 */
export function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Array<Heading>>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) {
      setHeadings([])
      return
    }
    const nodes = Array.from(
      article.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'),
    )
    const found: Array<Heading> = nodes.map((node) => ({
      id: node.id,
      text: node.textContent?.trim() ?? '',
      level: node.tagName === 'H2' ? 2 : 3,
    }))
    setHeadings(found)
    setActiveId(found[0]?.id ?? null)
  }, [pathname])

  useEffect(() => {
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

  // Hide if no headings or below the 2xl viewport where the rail has room.
  if (headings.length === 0) return null

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
