'use client'

import { usePathname } from 'next/navigation'

import { Button } from '@/components/Button'
import { navigation, type NavLinkItem } from '@/components/Navigation'
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
  const pathname = usePathname()
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
}: {
  label: string
  page: { href: string; title: string }
  previous?: boolean
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          href={page.href}
          aria-label={`${label}: ${page.title}`}
          aria-keyshortcuts={previous ? 'ArrowLeft' : 'ArrowRight'}
          variant="secondary"
          arrow={previous ? 'left' : 'right'}
        >
          {label}
        </Button>
        <kbd
          aria-hidden="true"
          className="hidden rounded border border-zinc-200 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-zinc-400 sm:inline dark:border-zinc-700 dark:text-zinc-500"
        >
          {previous ? '←' : '→'}
        </kbd>
      </div>
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
  const { previousPage, nextPage } = usePrevNextPage()

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className="flex">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink label="Previous" page={previousPage} previous />
        </div>
      )}
      {nextPage && (
        <div className="ml-auto flex flex-col items-end gap-3">
          <PageLink label="Next" page={nextPage} />
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
