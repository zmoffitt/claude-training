'use client'

import clsx from 'clsx'
import Link from 'next/link'

import { focusRing } from '@/lib/focusRing'

interface Section {
  eyebrow: string
  title: string
  description: string
  href: string
  primary?: boolean
}

const sections: Section[] = [
  {
    eyebrow: 'Training',
    title: 'Claude Code',
    description:
      'Five-session program — sessions, walkthroughs, and notes from team trainings.',
    href: '/docs/training/claude-code',
    primary: true,
  },
  {
    eyebrow: 'Also available',
    title: 'Codex & ChatGPT',
    description:
      'Three complete sessions: grounded answers, verified code, and reusable engineering workflows.',
    href: '/docs/training/codex-chatgpt',
  },
  {
    eyebrow: 'Reference',
    title: 'Best Practices',
    description:
      'Proven patterns and workflows for using AI coding tools in real engineering work.',
    href: '/docs/best-practices/code-review',
  },
  {
    eyebrow: 'Reference',
    title: 'Configuration',
    description:
      'Shared configs, prompts, CLAUDE.md examples, and editor setup for the team.',
    href: '/docs/configuration/claude-md',
  },
  {
    eyebrow: 'Reference',
    title: 'Tips & Tricks',
    description:
      'Team-contributed knowledge for getting the most out of AI assistants day to day.',
    href: '/docs/tips/effective-prompts',
  },
]

export function HomeSections() {
  return (
    <ul className="flex flex-col divide-y divide-zinc-900/10 border-y border-zinc-900/10 dark:divide-white/10 dark:border-white/10">
      {sections.map((s) => (
        <li key={s.title}>
          <Link
            href={s.href}
            className={clsx(
              // Below `sm` the row is two stacked lines with the arrow beside
              // them; from `sm` it is one line of eyebrow, text, arrow.
              'group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-5 transition-colors sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-x-6 sm:gap-y-0',
              focusRing,
            )}
          >
            <span
              className={clsx(
                'col-start-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
                s.primary
                  ? 'text-violet-500 dark:text-violet-400'
                  : 'text-violet-500/60 group-hover:text-violet-500 dark:text-violet-400/60 dark:group-hover:text-violet-400',
              )}
            >
              {s.eyebrow}
            </span>
            <span className="col-start-1 flex flex-col gap-1 sm:col-start-2">
              <span
                className={clsx(
                  'font-display font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-violet-500 dark:text-white dark:group-hover:text-violet-400',
                  s.primary ? 'text-2xl' : 'text-lg',
                )}
              >
                {s.title}
              </span>
              <span className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {s.description}
              </span>
            </span>
            <span
              aria-hidden="true"
              // Shown at rest on a touch screen, where there is no hover to
              // reveal it; on a pointer device it appears on hover.
              className="col-start-2 row-span-2 row-start-1 self-center text-zinc-400 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:col-start-3 sm:row-span-1 [@media(hover:hover)]:opacity-0 dark:text-zinc-500"
            >
              &rarr;
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
