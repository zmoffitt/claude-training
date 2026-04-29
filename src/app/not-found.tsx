import Link from 'next/link'

import { Button } from '@/components/Button'

export const metadata = {
  title: 'Page not found',
}

const startingPoints = [
  {
    href: '/docs/training/claude-code/session-1',
    title: 'Session 1',
    description: 'Foundations — models, context, planning',
  },
  {
    href: '/docs/training/claude-code/session-2',
    title: 'Session 2',
    description: 'Local Claude — CLAUDE.md, permissions, hooks',
  },
  {
    href: '/docs/training/claude-code/session-3',
    title: 'Session 3',
    description: 'Extending Claude — skills, plugins, MCP',
  },
]

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">
          404
        </p>
        <h1 className="text-balance break-words text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
          That page isn&rsquo;t here.
        </h1>
        <p className="max-w-xl text-pretty text-base text-zinc-600 dark:text-zinc-400">
          It may have moved, been renamed, or never existed. Pick a session
          below, search with{' '}
          <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-sans text-[11px] font-semibold tracking-wider text-zinc-700 ring-1 ring-zinc-900/10 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/10">
            ⌘K
          </kbd>
          , or head home.
        </p>
      </div>
      <ul className="flex flex-col divide-y divide-zinc-900/10 border-y border-zinc-900/10 dark:divide-white/10 dark:border-white/10">
        {startingPoints.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group flex items-baseline gap-3 py-3 transition hover:text-violet-500 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
            >
              <span className="font-semibold text-zinc-900 group-hover:text-violet-500 dark:text-white dark:group-hover:text-violet-400">
                {s.title}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {s.description}
              </span>
              <span
                aria-hidden="true"
                className="ml-auto translate-x-0 text-zinc-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-500"
              >
                &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <Button href="/">Go home</Button>
        <Button href="/docs" variant="secondary">
          Browse docs
        </Button>
      </div>
    </div>
  )
}
