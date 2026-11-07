import Link from 'next/link'

import { glossary } from '@/lib/glossary'

/**
 * The glossary page body: every term from `glossary.ts` with its definition
 * and a link to the page that teaches it. Each entry carries the term's id,
 * which is what a <Term> chip links to.
 */
export function Glossary() {
  const entries = Object.entries(glossary).sort(([, a], [, b]) =>
    a.label.localeCompare(b.label),
  )
  return (
    <dl className="not-prose divide-y divide-zinc-900/10 dark:divide-white/10">
      {entries.map(([id, entry]) => (
        <div key={id} id={id} className="grid scroll-mt-24 gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <dt className="font-display text-base font-semibold text-zinc-900 dark:text-white">
            {entry.label}
          </dt>
          <dd className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {entry.definition}{' '}
            <Link
              href={entry.href}
              className="whitespace-nowrap font-medium text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Taught here →
            </Link>
          </dd>
        </div>
      ))}
    </dl>
  )
}
