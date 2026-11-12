'use client'

import Link from 'next/link'

import { usePagePath } from '@/lib/usePagePath'

import { Button } from '@/components/Button'
import { navigation, type NavLinkItem, type PageEntry } from '@/components/Navigation'
import { usePrevNextPage } from '@/lib/usePrevNextPage'

function pagesIn(item: NavLinkItem): Array<string> {
  return [item.href, ...(item.children ?? []).flatMap(pagesIn)]
}

/**
 * Where a page sits in its session. A session is a child of a track (a
 * top-level sidebar link) that has pages of its own; its landing page is
 * page 1 and every page under it counts, however deeply the sidebar nests
 * it, in the order the Next button walks them. Pages outside a session
 * have no sequence to report.
 */
function findSessionPosition(
  pathname: string,
): { session: NavLinkItem; index: number; total: number } | null {
  for (const group of navigation) {
    for (const track of group.links) {
      for (const session of track.children ?? []) {
        if (!session.children) continue
        const pages = pagesIn(session)
        const index = pages.indexOf(pathname)
        if (index >= 0) return { session, index, total: pages.length }
      }
    }
  }
  return null
}

function ProgressIndicator() {
  const pathname = usePagePath()
  const found = findSessionPosition(pathname)
  if (!found) return null
  return (
    <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
      {found.session.title} &middot; Page {found.index + 1} of {found.total}
    </p>
  )
}

function PageLink({
  label,
  page,
  previous = false,
  crossesGroup = false,
}: {
  label: string
  page: PageEntry
  previous?: boolean
  /** The target sits in another sidebar group: say so instead of implying a sequence. */
  crossesGroup?: boolean
}) {
  const shownLabel = crossesGroup ? `${label} section` : label
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          href={page.href}
          aria-label={`${shownLabel}: ${crossesGroup ? `${page.group}, ` : ''}${page.title}`}
          aria-keyshortcuts={previous ? 'ArrowLeft' : 'ArrowRight'}
          variant={previous ? 'secondary' : 'filled'}
          arrow={previous ? 'left' : 'right'}
          className="max-lg:min-h-11 max-lg:items-center max-lg:px-4"
        >
          {shownLabel}
        </Button>
        <kbd
          aria-hidden="true"
          data-shortcut={previous ? 'ArrowLeft' : 'ArrowRight'}
          className="kbd-hint hidden rounded border border-zinc-200 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-zinc-400 sm:inline dark:border-zinc-700 dark:text-zinc-500"
        >
          {previous ? '←' : '→'}
        </kbd>
      </div>
      {crossesGroup && (
        <span
          aria-hidden="true"
          className="-mb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          {page.group}
        </span>
      )}
      {/* The title reads as the link, so it is one. The button above carries
          the accessible name and the tab stop; this copy is for pointers. */}
      <Link
        href={page.href}
        aria-hidden="true"
        tabIndex={-1}
        className="text-base font-semibold text-zinc-900 hover:text-violet-500 max-lg:py-1 dark:text-white dark:hover:text-violet-400"
      >
        {page.title}
      </Link>
    </>
  )
}

function PageNavigation() {
  const { previousPage, nextPage, currentPage } = usePrevNextPage()

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className="flex flex-col gap-8 sm:flex-row">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink
            label="Previous"
            page={previousPage}
            previous
            crossesGroup={previousPage.group !== currentPage?.group}
          />
        </div>
      )}
      {nextPage && (
        <div className="flex flex-col items-start gap-3 sm:ml-auto sm:items-end">
          <PageLink
            label="Next"
            page={nextPage}
            crossesGroup={nextPage.group !== currentPage?.group}
          />
        </div>
      )}
    </div>
  )
}

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 sm:flex-row dark:border-white/5">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        &copy; {new Date().getFullYear()}{' '}
        <a
          href="mailto:zmoffitt@pm.me"
          className="hover:text-violet-600 dark:hover:text-violet-400"
        >
          Zachary Moffitt
        </a>
      </p>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl space-y-6 pb-16 lg:max-w-5xl">
      <ProgressIndicator />
      <PageNavigation />
      <SmallPrint />
    </footer>
  )
}
