'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/Button'
import { sessionOfPath } from '@/lib/sessions'
import { usePagePath } from '@/lib/usePagePath'
import { useSessionProgress } from '@/lib/useSessionProgress'

const easeOutQuart = [0.25, 1, 0.5, 1] as const

/**
 * The end of a session, on its practice assignment page ahead of "Where to
 * go next": a card with the session's check, the page's closing line, how
 * much of the session this learner has opened, and one button to the next
 * session. The check draws itself once when it scrolls into view, in the
 * session hue; under reduced motion it is simply there. The progress line
 * comes from the visited pages kept in this browser, so it appears after
 * hydration and names the first page not opened yet. A track's last session
 * has no button.
 */
export function SessionComplete({
  session,
  children,
}: {
  session: number
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const track = sessionOfPath(usePagePath())?.track ?? 'claude'
  const { pages, unopened, next } = useSessionProgress(track, session)
  const opened = pages.length - unopened.length
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: '-60px' },
      }

  return (
    <section
      aria-label={`End of Session ${session}`}
      // A card, so it stops at the figure width like the site's other cards.
      className="not-prose flex items-start gap-3 rounded-(--radius-card) border border-(--surface-border) bg-(--theme-card-bg) p-5 sm:gap-4 sm:p-6 lg:max-w-3xl"
      style={{ color: 'var(--session-hue, var(--brand-purple-text))' }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mt-0.5 size-6 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          {...draw}
          transition={{ duration: 0.6, ease: easeOutQuart }}
        />
        <motion.path
          d="M7.5 12.5l3 3 6-6.5"
          {...draw}
          transition={{ duration: 0.35, delay: reduce ? 0 : 0.45, ease: easeOutQuart }}
        />
      </svg>
      <div className="flex min-w-0 flex-col items-start gap-3">
        <p className="m-0 text-base leading-relaxed">
          <span className="font-semibold text-(--theme-heading)">
            That&rsquo;s Session {session}.
          </span>{' '}
          <span className="text-(--theme-text-muted)">{children}</span>
        </p>
        {/* The line is held open before hydration, while the visited pages
            are unread, so the card does not grow under the reader. */}
        <p className="m-0 min-h-[1lh] text-sm leading-relaxed text-(--theme-text-muted)">
          {opened === 0 ? null : unopened.length === 0 ? (
            <>All {pages.length} pages of Session {session} opened.</>
          ) : (
            <>
              {opened} of {pages.length} pages opened. Not yet:{' '}
              <Link
                href={unopened[0].href}
                className="font-medium text-violet-500 underline decoration-violet-500/50 decoration-1 underline-offset-[0.2em] transition-colors hover:text-violet-700 hover:decoration-current dark:text-violet-400 dark:decoration-violet-400/50 dark:hover:text-violet-300"
              >
                {unopened[0].title}
              </Link>
              {unopened.length > 1 && <>, and {unopened.length - 1} more</>}.
            </>
          )}
        </p>
        {next && (
          <Button href={next.href} variant="filled" arrow="right">
            Start Session {next.number}
          </Button>
        )}
      </div>
    </section>
  )
}
