'use client'

import { motion } from 'framer-motion'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Footer } from '@/components/Footer'
import { KeyboardNav } from '@/components/KeyboardNav'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { ScrollProgress } from '@/components/ScrollProgress'
import { SearchDialog } from '@/components/SearchDialog'
import { SidebarResizeHandle } from '@/components/SidebarResizeHandle'
import { TableOfContents } from '@/components/TableOfContents'
import { useSidebarStore } from '@/lib/useSidebarStore'
import { useIsLg } from '@/lib/useIsLg'

export function Layout({ children }: { children: React.ReactNode }) {
  const { width, isCollapsed } = useSidebarStore()
  const isLg = useIsLg()

  // `isLg` is false during SSR and the first client render. Tailwind's
  // responsive classes (`lg:w-80`, `lg:ml-80`) provide a correct CSS fallback
  // so the layout is stable before hydration. Once the media-query hook fires,
  // inline styles take over with the user's persisted width.
  const hydrated = isLg // true only after useEffect runs on the client
  const effectiveWidth = hydrated ? (isCollapsed ? 0 : width) : undefined

  return (
    <div
      className="h-full lg:ml-80 xl:ml-88"
      style={hydrated ? { marginLeft: effectiveWidth } : undefined}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:bg-zinc-900 dark:focus:text-white dark:focus:ring-offset-zinc-900"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <motion.header
        layoutScroll
        className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
      >
        {/* Desktop sidebar — unmounted when collapsed */}
        {!(hydrated && isCollapsed) && (
          <div
            className="contents lg:pointer-events-auto lg:block lg:w-80 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-14 lg:pb-8 xl:w-88 lg:dark:border-white/10"
            style={{
              width: hydrated ? width : undefined,
              position: hydrated ? 'relative' : undefined,
            }}
          >
            <Header />
            <Navigation className="hidden lg:block" />
            {hydrated && <SidebarResizeHandle />}
          </div>
        )}
        {/* When collapsed on desktop, render Header outside the sidebar
            but give it pointer-events-auto so the burger is clickable
            through the pointer-events-none parent. */}
        {hydrated && isCollapsed && (
          <div className="lg:pointer-events-auto">
            <Header />
          </div>
        )}
      </motion.header>
      <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
        <main id="main-content" tabIndex={-1} className="flex-auto focus:outline-none">
          <article data-pagefind-body className="flex h-full flex-col pt-16 pb-10">
            <Prose className="flex-auto">
              <Breadcrumbs />
              {children}
            </Prose>
          </article>
        </main>
        <TableOfContents />
        <Footer />
      </div>
      <SearchDialog />
      <KeyboardNav />
    </div>
  )
}
