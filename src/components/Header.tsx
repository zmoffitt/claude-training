'use client'

import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { forwardRef } from 'react'

import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore,
} from '@/components/MobileNavigation'
import { MenuIcon, SidebarCollapseIcon } from '@/components/NavIcons'
import { SearchButton } from '@/components/SearchDialog'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSidebarStore } from '@/lib/useSidebarStore'
import { useIsLg } from '@/lib/useIsLg'
import { focusRing } from '@/lib/focusRing'
import { siteName } from '@/lib/site'

export const Header = forwardRef<
  React.ComponentRef<'div'>,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(function Header({ className, ...props }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let { width: sidebarWidth, isCollapsed, toggleCollapse } = useSidebarStore()
  let isLg = useIsLg()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], ['50%', '90%'])
  let bgOpacityDark = useTransform(scrollY, [0, 72], ['20%', '80%'])

  // On desktop, the header's left edge aligns with the sidebar's right edge.
  const headerLeft = isLg ? (isCollapsed ? 0 : sidebarWidth) : 0

  return (
    <motion.div
      {...props}
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-4 px-4 transition sm:px-6 lg:z-30 lg:gap-12 lg:px-8',
        !isInsideMobileNavigation && 'backdrop-blur-xs dark:backdrop-blur-sm',
        isInsideMobileNavigation
          ? 'bg-paper dark:bg-ink'
          : 'bg-paper/(--bg-opacity-light) dark:bg-ink/(--bg-opacity-dark)',
      )}
      style={
        {
          '--bg-opacity-light': bgOpacityLight,
          '--bg-opacity-dark': bgOpacityDark,
          left: headerLeft,
          transition: 'left 0.2s ease',
        } as React.CSSProperties
      }
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px transition',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            'bg-zinc-900/7.5 dark:bg-white/7.5',
        )}
      />
      {/* Toggle button — visible on all screen sizes. The negative margins
          here and on the right-hand group pull each 44px button outward by
          its own inset, so the icons, not the button boxes, line up with the
          edges of the page text below. */}
      <div className="-ml-4 flex min-w-0 items-center gap-2 lg:gap-5">
        {isLg ? (
          /* Desktop: toggle sidebar collapse */
          <button
            type="button"
            className={clsx(
              'relative flex size-11 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5',
              focusRing,
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <MenuIcon className="w-3 stroke-zinc-900 dark:stroke-white" />
            ) : (
              <SidebarCollapseIcon className="w-3 stroke-zinc-900 dark:stroke-white" />
            )}
          </button>
        ) : (
          /* Mobile: existing MobileNavigation toggle */
          <MobileNavigation />
        )}
        {/* The wordmark sits here on small screens and when the desktop
            sidebar is collapsed; otherwise the sidebar carries it. The class
            is a breakpoint rule, not a check of `isLg`, so it is right on the
            server-rendered first paint too. */}
        <Link
          href="/"
          aria-label={`${siteName} home`}
          className={clsx(
            !(isLg && isCollapsed) && 'lg:hidden',
            'min-w-0 rounded',
            focusRing,
          )}
        >
          <Logo />
        </Link>
      </div>
      <div className="-mr-3 flex items-center gap-5">
        <div className="flex gap-4">
          <SearchButton />
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  )
})
