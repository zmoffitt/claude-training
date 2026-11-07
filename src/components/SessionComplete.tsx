'use client'

import { motion, useReducedMotion } from 'framer-motion'

const easeOutQuart = [0.25, 1, 0.5, 1] as const

/**
 * Marks the end of a session's material, ahead of "Where to go next" on the
 * practice assignment page. The check draws itself once when it scrolls into
 * view, in the session hue; under reduced motion it is simply there.
 */
export function SessionComplete({
  session,
  children,
}: {
  session: number
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: '-60px' },
      }

  return (
    <div
      className="not-prose flex items-start gap-3"
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
      <p className="m-0 text-base leading-relaxed">
        <span className="font-semibold" style={{ color: 'var(--theme-heading)' }}>
          That&rsquo;s Session {session}.
        </span>{' '}
        <span style={{ color: 'var(--theme-text-muted)' }}>{children}</span>
      </p>
    </div>
  )
}
