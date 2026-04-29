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
              'group flex flex-col gap-1 py-5 transition-colors sm:grid sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-x-6 sm:gap-y-0',
              focusRing,
            )}
          >
            <span
              className={clsx(
                'text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
                s.primary
                  ? 'text-violet-500 dark:text-violet-400'
                  : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300',
              )}
            >
              {s.eyebrow}
            </span>
            <span className="flex flex-col gap-1">
              <span
                className={clsx(
                  'font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-violet-500 dark:text-white dark:group-hover:text-violet-400',
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
              className="hidden self-center text-zinc-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:block dark:text-zinc-500"
            >
              &rarr;
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
