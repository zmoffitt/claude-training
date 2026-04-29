'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { focusRing } from '@/lib/focusRing'
import { remToPx } from '@/lib/remToPx'

export interface NavLinkItem {
  title: string
  href: string
  children?: Array<NavLinkItem>
}

export interface NavGroup {
  title: string
  icon?: React.ReactNode
  links: Array<NavLinkItem>
}

function flattenLinks(links: Array<NavLinkItem>): Array<{ title: string; href: string }> {
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
        'flex min-w-0 flex-1 justify-between gap-2 rounded py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
        focusRing,
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
  let childListId = useId()

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
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={childListId}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${link.title}`}
          className={clsx(
            'flex shrink-0 items-center rounded pr-3',
            focusRing,
          )}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
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
            id={childListId}
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
  let groupContentId = useId()

  let isOpen = isActiveGroup || isExpanded

  let measure = useCallback(() => {
    if (!containerRef.current) return
    let activeEl = containerRef.current.querySelector<HTMLElement>('[aria-current="page"]')
    if (!activeEl) return
    let containerRect = containerRef.current.getBoundingClientRect()
    let activeRect = activeEl.getBoundingClientRect()
    if (activeRect.height === 0) return
    setActiveCenter(activeRect.top - containerRect.top + activeRect.height / 2)
  }, [])

  useEffect(() => {
    let container = containerRef.current
    if (!container || !isActiveGroup) return

    // Measure immediately for in-group navigations (no animation fires);
    // layout-animation completions are handled via onLayoutAnimationComplete
    // on the expanding container, which catches the post-settle state that
    // ResizeObserver misses when child items use `layout="position"`.
    measure()
    let observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [pathname, isActiveGroup, measure])

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="font-semibold text-zinc-900 dark:text-white"
        style={{ fontSize: '0.875rem' }}
      >
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={groupContentId}
          className={clsx(
            'flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded text-left',
            focusRing,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {group.icon && <span className="shrink-0 text-violet-500 dark:text-violet-400" aria-hidden="true">{group.icon}</span>}
            <span className="truncate">{group.title}</span>
          </span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </motion.svg>
        </button>
      </motion.h2>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={groupContentId}
            ref={containerRef}
            className="relative mt-3 pl-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={measure}
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

const iconClass = 'h-4 w-4'

function BookIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06V3.94a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 2.866a9.006 9.006 0 0 0-4.25 1.063v12.89ZM9.25 4.93A9.006 9.006 0 0 0 5 2.866 9.006 9.006 0 0 0 2.546 3.22.75.75 0 0 0 2 3.94v11.12a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.93Z" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.564 2 12.163 2 7c0-.54.035-1.07.104-1.59a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.75Zm4.196 5.954a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
  )
}

function CogIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.993 6.993 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .75-.75v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z" />
    </svg>
  )
}

export const navigation: Array<NavGroup> = [
  {
    title: 'Training Materials',
    icon: <BookIcon />,
    links: [
      {
        title: 'Claude Code', href: '/docs/training/claude-code',
        children: [
          {
            title: 'Session 1: Foundations',
            href: '/docs/training/claude-code/session-1',
            children: [
              { title: 'AI Fluency Framework', href: '/docs/training/claude-code/session-1/ai-fluency-framework' },
              { title: 'Slope Over Snapshot', href: '/docs/training/claude-code/session-1/slope-over-snapshot' },
              { title: 'Three Eras', href: '/docs/training/claude-code/session-1/three-eras' },
              { title: "What Claude Is (and Isn't)", href: '/docs/training/claude-code/session-1/what-claude-is' },
              { title: 'Claude Everywhere', href: '/docs/training/claude-code/session-1/claude-everywhere' },
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
                title: "Hands-On Exercise",
                href: '/docs/training/claude-code/session-1/hands-on-exercise',
                children: [
                  { title: 'Verification Pattern', href: '/docs/training/claude-code/session-1/verification-pattern' },
                  { title: 'Practice Assignment', href: '/docs/training/claude-code/session-1/practice-assignment' },
                ],
              },
            ],
          },
          {
            title: 'Session 2: CLI Workflows & Context',
            href: '/docs/training/claude-code/session-2',
            children: [
              {
                title: 'Your Claude, Three Ways',
                href: '/docs/training/claude-code/session-2/your-claude-three-ways',
              },
              {
                title: 'Permissions Deep Dive',
                href: '/docs/training/claude-code/session-2/permissions-deep-dive',
                children: [
                  { title: 'Permission Modes & Settings', href: '/docs/training/claude-code/session-2/permission-modes-settings' },
                  { title: 'Working Directories & Scope', href: '/docs/training/claude-code/session-2/working-directories-scope' },
                ],
              },
              {
                title: 'Context & Session Management',
                href: '/docs/training/claude-code/session-2/context-session-management',
              },
              {
                title: 'CLAUDE.md',
                href: '/docs/training/claude-code/session-2/claude-md',
                children: [
                  { title: 'What to Put in CLAUDE.md', href: '/docs/training/claude-code/session-2/what-to-put-in-claude-md' },
                  { title: 'CLAUDE.md Examples', href: '/docs/training/claude-code/session-2/claude-md-examples' },
                  { title: 'The .claude/ Directory', href: '/docs/training/claude-code/session-2/dot-claude-directory' },
                ],
              },
              {
                title: 'Hooks: Lifecycle & Control',
                href: '/docs/training/claude-code/session-2/hooks-lifecycle-control',
              },
              {
                title: 'Skills, Plugins & Connectors',
                href: '/docs/training/claude-code/session-2/skills-plugins',
                children: [
                  { title: 'Subagents: Focused Delegation', href: '/docs/training/claude-code/session-2/subagents-focused-delegation' },
                  { title: 'Agent Teams: Coordinated Work', href: '/docs/training/claude-code/session-2/agent-teams-coordinated-work' },
                ],
              },
              {
                title: 'Live Demo: The Full Loop',
                href: '/docs/training/claude-code/session-2/live-demo-full-loop',
              },
              {
                title: 'Practice Assignment',
                href: '/docs/training/claude-code/session-2/practice-assignment',
              },
            ],
          },
          {
            title: 'Session 3: Extending Claude',
            href: '/docs/training/claude-code/session-3',
            children: [
              {
                title: 'Why Extend Claude?',
                href: '/docs/training/claude-code/session-3/why-extend-claude',
              },
              {
                title: 'Tool Priority Ladder',
                href: '/docs/training/claude-code/session-3/tool-priority-ladder',
                children: [
                  { title: 'Two Ways to Drive Chrome', href: '/docs/training/claude-code/session-3/two-ways-to-drive-chrome' },
                ],
              },
              {
                title: 'MCP Architecture',
                href: '/docs/training/claude-code/session-3/mcp-architecture',
              },
              {
                title: 'Built-in Connectors',
                href: '/docs/training/claude-code/session-3/built-in-connectors',
              },
              {
                title: 'Cloud Routines',
                href: '/docs/training/claude-code/session-3/cloud-routines',
              },
              {
                title: 'Automation Primitives',
                href: '/docs/training/claude-code/session-3/automation-primitives',
              },
              {
                title: 'Plugins & Marketplaces',
                href: '/docs/training/claude-code/session-3/plugins-marketplaces',
              },
              {
                title: 'Skills Deep Dive',
                href: '/docs/training/claude-code/session-3/skills-deep-dive',
                children: [
                  { title: 'SKILL.md Examples', href: '/docs/training/claude-code/session-3/skill-md-examples' },
                ],
              },
              {
                title: 'Decision Guide',
                href: '/docs/training/claude-code/session-3/decision-guide',
              },
              {
                title: 'Security & Scoping',
                href: '/docs/training/claude-code/session-3/security-scoping',
              },
              {
                title: 'Insights',
                href: '/docs/training/claude-code/session-3/insights',
              },
              {
                title: 'Live Demo: Bug Triage Routine',
                href: '/docs/training/claude-code/session-3/live-demo-bug-triage',
              },
              {
                title: 'Practice Assignment',
                href: '/docs/training/claude-code/session-3/practice-assignment',
              },
            ],
          },
        ],
      },

      { title: 'GitHub Copilot', href: '/docs/training/github-copilot' },
      { title: 'Prompt Engineering', href: '/docs/training/prompt-engineering' },
    ],
  },
  {
    title: 'Best Practices',
    icon: <ShieldCheckIcon />,
    links: [
      { title: 'AI-Assisted Code Review', href: '/docs/best-practices/code-review' },
      { title: 'Security Considerations', href: '/docs/best-practices/security' },
      { title: 'Workflow Integration', href: '/docs/best-practices/workflow-integration' },
    ],
  },
  {
    title: 'Configuration',
    icon: <CogIcon />,
    links: [
      { title: 'CLAUDE.md Files', href: '/docs/configuration/claude-md' },
      { title: 'Editor Setup', href: '/docs/configuration/editor-setup' },
      { title: 'Team Configurations', href: '/docs/configuration/team-configs' },
    ],
  },
  {
    title: 'Tips & Tricks',
    icon: <LightbulbIcon />,
    links: [
      { title: 'Effective Prompts', href: '/docs/tips/effective-prompts' },
      { title: 'Productivity Shortcuts', href: '/docs/tips/productivity-shortcuts' },
      { title: 'Common Pitfalls', href: '/docs/tips/common-pitfalls' },
    ],
  },
]

export const allPages = navigation.flatMap((group) => flattenLinks(group.links))

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
