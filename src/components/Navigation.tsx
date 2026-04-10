'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { remToPx } from '@/lib/remToPx'

interface NavLinkItem {
  title: string
  href: string
  children?: Array<NavLinkItem>
}

interface NavGroup {
  title: string
  links: Array<NavLinkItem>
}

export function flattenLinks(links: Array<NavLinkItem>): Array<{ title: string; href: string }> {
  let result: Array<{ title: string; href: string }> = []
  for (let link of links) {
    result.push({ title: link.title, href: link.href })
    if (link.children) {
      result.push(...flattenLinks(link.children))
    }
  }
  return result
}

function hasActiveChild(link: NavLinkItem, pathname: string): boolean {
  if (link.href === pathname) return true
  return link.children?.some((child) => hasActiveChild(child, pathname)) ?? false
}

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function NavLink({
  href,
  children,
  active = false,
  isAnchorLink = false,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  isAnchorLink?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      )}
    >
      <span className="truncate">{children}</span>
    </Link>
  )
}

function VisibleSectionHighlight({ activeCenter }: { activeCenter: number }) {
  let height = remToPx(2)
  let top = activeCenter - height / 2

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ activeCenter }: { activeCenter: number }) {
  let markerHeight = remToPx(1.5)
  let top = activeCenter - markerHeight / 2

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-violet-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NestedNavItem({
  link,
  pathname,
}: {
  link: NavLinkItem
  pathname: string
}) {
  let isActive = hasActiveChild(link, pathname)
  let [isExpanded, setIsExpanded] = useState(isActive)
  let isOpen = isActive || isExpanded

  if (!link.children) {
    return (
      <motion.li layout="position" className="relative">
        <NavLink href={link.href} active={link.href === pathname}>
          {link.title}
        </NavLink>
      </motion.li>
    )
  }

  return (
    <motion.li layout="position" className="relative">
      <div className="flex items-center">
        <NavLink href={link.href} active={link.href === pathname}>
          {link.title}
        </NavLink>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center pr-3"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 text-zinc-400 dark:text-zinc-500"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              fillRule="evenodd"
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </motion.svg>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            role="list"
            className="pl-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {link.children.map((child) => (
              <NestedNavItem key={child.href} link={child} pathname={pathname} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup
  className?: string
}) {
  let pathname = usePathname()
  let flat = flattenLinks(group.links)
  let isActiveGroup = flat.some((link) => link.href === pathname)
  let [isExpanded, setIsExpanded] = useState(isActiveGroup)
  let containerRef = useRef<HTMLDivElement>(null)
  let [activeCenter, setActiveCenter] = useState(0)

  let isOpen = isActiveGroup || isExpanded

  useEffect(() => {
    let container = containerRef.current
    if (!container || !isActiveGroup) return

    let measure = () => {
      if (!containerRef.current) return
      let activeEl = containerRef.current.querySelector<HTMLElement>('[aria-current="page"]')
      if (!activeEl) return
      let containerRect = containerRef.current.getBoundingClientRect()
      let activeRect = activeEl.getBoundingClientRect()
      if (activeRect.height === 0) return
      setActiveCenter(activeRect.top - containerRect.top + activeRect.height / 2)
    }

    measure()
    let observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [pathname, isActiveGroup])

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="flex cursor-pointer select-none items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {group.title}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3 w-3 text-zinc-400 dark:text-zinc-500"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.h2>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={containerRef}
            className="relative mt-3 pl-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <AnimatePresence initial={false}>
              {isActiveGroup && (
                <VisibleSectionHighlight activeCenter={activeCenter} />
              )}
            </AnimatePresence>
            <motion.div
              layout
              className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
            />
            <AnimatePresence initial={false}>
              {isActiveGroup && (
                <ActivePageMarker activeCenter={activeCenter} />
              )}
            </AnimatePresence>
            <ul role="list" className="border-l border-transparent">
              {group.links.map((link) => (
                <NestedNavItem key={link.href} link={link} pathname={pathname} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export const navigation: Array<NavGroup> = [
  {
    title: 'Getting Started',
    links: [
      { title: 'Introduction', href: '/docs' },
    ],
  },
  {
    title: 'Training Materials',
    links: [
      {
        title: 'Claude Code', href: '/docs/training/claude-code',
        children: [
          {
            title: 'Session 1: Foundations',
            href: '/docs/training/claude-code/session-1',
            children: [
              {
                title: "Welcome + Program Trajectory",
                href: '/docs/training/claude-code/session-1/welcome-program-trajectory',
                children: [
                  { title: 'AI Fluency Framework', href: '/docs/training/claude-code/session-1/ai-fluency-framework' },
                  { title: 'Slope Over Snapshot', href: '/docs/training/claude-code/session-1/slope-over-snapshot' },
                  { title: 'Three Eras', href: '/docs/training/claude-code/session-1/three-eras' },
                  { title: "What Claude Is (and Isn't)", href: '/docs/training/claude-code/session-1/what-claude-is' },
                  { title: 'Claude Everywhere', href: '/docs/training/claude-code/session-1/claude-everywhere' },
                ]
              },
              {
                title: "How Context Works",
                href: '/docs/training/claude-code/session-1/how-context-works',
                children: [
                  { title: 'Context Window & Tokens', href: '/docs/training/claude-code/session-1/context-window-tokens' },
                ],
              },
              {
                title: "Thinking Effort, Models, & Quotas",
                href: '/docs/training/claude-code/session-1/thinking-effort-quotas',
                children: [
                  { title: 'Choosing the Right Model', href: '/docs/training/claude-code/session-1/choosing-the-right-model' },
                  { title: 'Plan Mode & Opus', href: '/docs/training/claude-code/session-1/plan-mode-opus' },
                ],
              },

              {
                title: "Personalization & Memory",
                href: '/docs/training/claude-code/session-1/personalization-memory',
                children: [
                  { title: 'Projects: Scoped Context', href: '/docs/training/claude-code/session-1/projects-scoped-context' },
                ],
              },

              {
                title: "Hands-On, Wrap-up + Assignment",
                href: '/docs/training/claude-code/session-1/hands-on-exercise',
                children: [
                  { title: 'Verification Pattern', href: '/docs/training/claude-code/session-1/verification-pattern' },
                  { title: 'Practice Assignment', href: '/docs/training/claude-code/session-1/practice-assignment' },
                ],
              },
            ],
          },
        ]
      },
      { title: 'GitHub Copilot', href: '/docs/training/github-copilot' },
      { title: 'Prompt Engineering', href: '/docs/training/prompt-engineering' },
    ],
  },
  {
    title: 'Best Practices',
    links: [
      { title: 'AI-Assisted Code Review', href: '/docs/best-practices/code-review' },
      { title: 'Security Considerations', href: '/docs/best-practices/security' },
      { title: 'Workflow Integration', href: '/docs/best-practices/workflow-integration' },
    ],
  },
  {
    title: 'Configuration',
    links: [
      { title: 'CLAUDE.md Files', href: '/docs/configuration/claude-md' },
      { title: 'Editor Setup', href: '/docs/configuration/editor-setup' },
      { title: 'Team Configurations', href: '/docs/configuration/team-configs' },
    ],
  },
  {
    title: 'Tips & Tricks',
    links: [
      { title: 'Effective Prompts', href: '/docs/tips/effective-prompts' },
      { title: 'Productivity Shortcuts', href: '/docs/tips/productivity-shortcuts' },
      { title: 'Common Pitfalls', href: '/docs/tips/common-pitfalls' },
    ],
  },
]

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav {...props}>
      <ul role="list">
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
      </ul>
    </nav>
  )
}
