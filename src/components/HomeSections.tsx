'use client'

import clsx from 'clsx'
import Link from 'next/link'

import { RowArrow } from '@/components/RowArrow'
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
    // The hero and the roadmap above already offer the sessions. This row
    // goes to the setup that Session 1's hands-on exercise needs.
    eyebrow: 'Training',
    title: 'Claude Code',
    description:
      'Install the CLI and make a first run before the Session 1 hands-on exercise.',
    href: '/docs/training/claude-code#install-claude-code',
    primary: true,
  },
  {
    eyebrow: 'Second track',
    title: 'Codex & ChatGPT',
    description:
      'Three complete sessions: grounded answers, verified code, and reusable engineering workflows.',
    href: '/docs/training/codex-chatgpt',
  },
  {
    eyebrow: 'Reference',
    title: 'Best Practices',
    description:
      'Code review, security, and fitting AI tools into the workflow you already have.',
    href: '/docs/best-practices/code-review',
  },
  {
    eyebrow: 'Reference',
    title: 'Configuration',
    description:
      'The CLAUDE.md template, editor setup, and the conventions the team shares.',
    href: '/docs/configuration/claude-md',
  },
  {
    eyebrow: 'Reference',
    title: 'Tips & Tricks',
    description:
      'Prompts that work, shortcuts worth memorizing, and the pitfalls that cost people a day.',
    href: '/docs/tips/effective-prompts',
  },
]

export function HomeSections() {
  return (
    <ul className="flex flex-col divide-y divide-zinc-900/10 border-y border-zinc-900/10 dark:divide-white/10 dark:border-white/10">
      {sections.map((s, i) => {
        // Consecutive rows of one kind share a single eyebrow, on the first.
        const showEyebrow = i === 0 || sections[i - 1].eyebrow !== s.eyebrow
        return (
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
            {showEyebrow && (
            <span
              className={clsx(
                'col-start-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
                // Violet marks the Claude track; the other groups' labels take
                // the muted text color, which holds 4.5:1 in both themes.
                s.primary
                  ? 'text-violet-500 dark:text-violet-400'
                  : 'text-zinc-600 group-hover:text-violet-500 dark:text-zinc-400 dark:group-hover:text-violet-400',
              )}
            >
              {s.eyebrow}
            </span>
            )}
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
            <RowArrow className="col-start-2 row-span-2 row-start-1 self-center sm:col-start-3 sm:row-span-1" />
          </Link>
        </li>
        )
      })}
    </ul>
  )
}
