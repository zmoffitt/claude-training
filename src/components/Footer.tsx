'use client'

import { usePagePath } from '@/lib/usePagePath'

import { Button } from '@/components/Button'
import { navigation, type NavLinkItem, type PageEntry } from '@/components/Navigation'
import { usePrevNextPage } from '@/lib/usePrevNextPage'

function findSiblingPosition(
  pathname: string,
  items: Array<NavLinkItem>,
  parent: NavLinkItem | null = null,
): { parent: NavLinkItem; index: number; total: number } | null {
  for (const item of items) {
    if (item.href === pathname && parent && parent.children) {
      const index = parent.children.findIndex((s) => s.href === pathname)
      if (index >= 0) return { parent, index, total: parent.children.length }
    }
    if (item.children) {
      const found = findSiblingPosition(pathname, item.children, item)
      if (found) return found
    }
  }
  return null
}

function ProgressIndicator() {
  const pathname = usePagePath()
  const allLinks: Array<NavLinkItem> = navigation.flatMap((g) => g.links)
  const found = findSiblingPosition(pathname, allLinks)
  if (!found || found.total < 3) return null
  return (
    <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
      {found.parent.title} &middot; Page {found.index + 1} of {found.total}
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
      <span
        aria-hidden="true"
        className="text-base font-semibold text-zinc-900 dark:text-white"
      >
        {page.title}
      </span>
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
