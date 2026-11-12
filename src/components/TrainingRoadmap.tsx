'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { focusRing } from '@/lib/focusRing'
import { sessionsByTrack, sessionTopics, type Track } from '@/lib/sessions'

/**
 * A track's sessions as a row of steps, stacked where the row would be cramped. Each step takes
 * its session hue from `--session-N`, on text and markers only, so the roadmap
 * matches the wayfinding hue a session's pages carry. Steps with a landing
 * page link to it; the rest read as upcoming. Names and topics come from
 * `lib/sessions`.
 */
const easeOutQuart = [0.25, 1, 0.5, 1] as const

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutQuart } },
}

/**
 * The steps sit in a row only when the roadmap's own box is wide enough for
 * every step to hold its second line; below that they stack as rows, the
 * same as on a phone. The breakpoints are container widths, since the column
 * the roadmap sits in changes with the sidebar and the "On this page" rail,
 * not only with the viewport. Five steps need more room than three.
 */
const layouts = {
  roomy: {
    list: '@4xl:flex-row @4xl:items-stretch @4xl:gap-4 @5xl:gap-6',
    numeral: '@4xl:w-auto @4xl:text-[2.75rem] @5xl:text-[3.25rem]',
    text: '@4xl:gap-1',
    surface:
      '@4xl:flex-col @4xl:items-start @4xl:gap-3 @4xl:px-3 @4xl:py-4 @5xl:px-4 @4xl:[&>span:last-child]:mt-auto',
    chevron: '@4xl:-right-4 @4xl:block @5xl:-right-5',
  },
  compact: {
    list: '@2xl:flex-row @2xl:items-stretch @2xl:gap-4 @3xl:gap-6',
    numeral: '@2xl:w-auto @2xl:text-[2.75rem] @3xl:text-[3.25rem]',
    text: '@2xl:gap-1',
    surface:
      '@2xl:flex-col @2xl:items-start @2xl:gap-3 @2xl:px-3 @2xl:py-4 @3xl:px-4 @2xl:[&>span:last-child]:mt-auto',
    chevron: '@2xl:-right-4 @2xl:block @3xl:-right-5',
  },
}

function Chip({ children, tone }: { children: React.ReactNode; tone: 'session' | 'neutral' }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-(--radius-chip) px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide"
      style={
        tone === 'session'
          ? {
              backgroundColor: 'color-mix(in oklch, var(--step-hue) 14%, transparent)',
              color: 'var(--step-hue)',
            }
          : {
              backgroundColor: 'var(--tint-neutral)',
              color: 'var(--theme-text-muted)',
            }
      }
    >
      {children}
    </span>
  )
}

export function TrainingRoadmap({
  activeStep = 1,
  track = 'claude',
  activeLabel = 'You are here',
}: {
  /** The step to mark; `0` marks none. */
  activeStep?: number
  track?: Track
  /** The marked step's chip. "You are here" is only true on that session's own pages. */
  activeLabel?: string
}) {
  const trackSteps = sessionsByTrack[track]
  const layout = trackSteps.length > 3 ? layouts.roomy : layouts.compact
  // The wrapper takes the prose column's margins and keeps list styling off
  // the steps when the roadmap sits directly in a page's MDX.
  return (
    <div className="@container not-prose">
    <motion.ol
      role="list"
      aria-label={`${track === 'codex' ? 'Codex and ChatGPT' : 'Claude'} training roadmap: ${trackSteps.length} sessions`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={listVariants}
      className={clsx('flex list-none flex-col gap-3', layout.list)}
    >
      {trackSteps.map((step, i) => {
        const isActive = step.number === activeStep
        const isLast = i === trackSteps.length - 1
        const href = step.href
        const stepStyle = { '--step-hue': `var(--session-${step.number})` } as React.CSSProperties
        // The second line says what the session covers, or the outcome a track
        // names for it. A session whose only topic is its own name has none.
        const topics = step.outcome ?? sessionTopics(step)
        const detail = topics.toLowerCase() === step.title.toLowerCase() ? null : topics

        const body = (
          <>
            <span
              aria-hidden="true"
              className={clsx(
                'font-display w-9 shrink-0 text-[2.25rem] leading-none font-bold tracking-[-0.03em]',
                layout.numeral,
              )}
              style={{ color: href ? 'var(--step-hue)' : 'var(--theme-text-subtle)' }}
            >
              {step.number}
            </span>
            <span className={clsx('flex min-w-0 flex-1 flex-col gap-0.5', layout.text)}>
              <span
                className="text-[0.9375rem] leading-snug font-semibold text-balance"
                style={{ color: href ? 'var(--theme-heading)' : 'var(--theme-text-muted)' }}
              >
                {step.title}
              </span>
              {detail && (
                <span className="text-[0.8125rem] leading-snug" style={{ color: 'var(--theme-text-muted)' }}>
                  {detail}
                </span>
              )}
            </span>
            {isActive && <Chip tone="session">{activeLabel}</Chip>}
            {!href && <Chip tone="neutral">Upcoming</Chip>}
          </>
        )

        const surface = clsx(
          'relative flex h-full items-center gap-3 rounded-(--radius-card) border px-4 py-3',
          layout.surface,
        )

        return (
          <motion.li key={step.number} variants={itemVariants} className="relative flex-1" style={stepStyle}>
            {href ? (
              <Link
                href={href}
                aria-current={isActive ? 'step' : undefined}
                className={clsx(
                  surface,
                  'transition-colors duration-150 hover:border-(--step-hue)',
                  focusRing,
                )}
                style={{
                  borderColor: isActive ? 'var(--step-hue)' : 'var(--surface-border)',
                  backgroundColor: 'var(--theme-card-bg-white)',
                }}
              >
                {body}
              </Link>
            ) : (
              <div
                aria-disabled="true"
                className={clsx(surface, 'border-dashed')}
                style={{ borderColor: 'var(--surface-border)', backgroundColor: 'transparent' }}
              >
                {body}
              </div>
            )}
            {!isLast && (
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className={clsx(
                  'pointer-events-none absolute top-1/2 hidden h-4 w-4 -translate-y-1/2',
                  layout.chevron,
                )}
                style={{ color: 'var(--theme-text-subtle)' }}
              >
                <path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </motion.li>
        )
      })}
    </motion.ol>
    </div>
  )
}
