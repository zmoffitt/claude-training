'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { focusRing } from '@/lib/focusRing'

/**
 * The five-session program as a row of steps (stacked below `md:`). Each step
 * takes its session hue from `--session-N`, on text and markers only, so the
 * roadmap matches the wayfinding hue a session's pages carry. Steps with a
 * landing page link to it; the rest read as upcoming.
 */
const steps = [
  { number: 1, title: 'Foundations', subtitle: 'Manual', href: '/docs/training/claude-code/session-1' },
  { number: 2, title: 'CLI & Context', subtitle: 'Task Execution', href: '/docs/training/claude-code/session-2' },
  { number: 3, title: 'MCP & Plugins', subtitle: 'Human in Loop', href: '/docs/training/claude-code/session-3' },
  { number: 4, title: 'Agents', subtitle: 'Human on Loop' },
  { number: 5, title: 'Capstone', subtitle: 'Scaling' },
] as const

const easeOutQuart = [0.25, 1, 0.5, 1] as const

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutQuart } },
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

export function TrainingRoadmap({ activeStep = 1 }: { activeStep?: number }) {
  return (
    <motion.ol
      role="list"
      aria-label="Training roadmap: five sessions"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={listVariants}
      className="m-0 flex list-none flex-col gap-3 p-0 md:flex-row md:items-stretch md:gap-4 lg:gap-6"
    >
      {steps.map((step, i) => {
        const isActive = step.number === activeStep
        const isLast = i === steps.length - 1
        const href = 'href' in step ? step.href : undefined
        const stepStyle = { '--step-hue': `var(--session-${step.number})` } as React.CSSProperties

        const body = (
          <>
            <span
              aria-hidden="true"
              className="font-display shrink-0 text-[1.75rem] leading-none font-semibold md:text-[2rem] lg:text-[2.25rem]"
              style={{ color: href ? 'var(--step-hue)' : 'var(--theme-text-subtle)' }}
            >
              {step.number}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1">
              <span
                className="text-[0.9375rem] font-semibold"
                style={{ color: href ? 'var(--theme-heading)' : 'var(--theme-text-muted)' }}
              >
                {step.title}
              </span>
              <span className="text-[0.8125rem]" style={{ color: 'var(--theme-text-muted)' }}>
                {step.subtitle}
              </span>
            </span>
            {isActive && <Chip tone="session">You are here</Chip>}
            {!href && <Chip tone="neutral">Upcoming</Chip>}
          </>
        )

        const surface = clsx(
          'relative flex h-full items-center gap-3 rounded-(--radius-card) border px-4 py-3',
          'md:flex-col md:items-start md:gap-3 md:px-3 md:py-4 lg:px-4',
          'md:[&>span:last-child]:mt-auto',
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
                className="pointer-events-none absolute top-1/2 hidden h-4 w-4 -translate-y-1/2 md:-right-4 md:block lg:-right-5"
                style={{ color: 'var(--theme-text-subtle)' }}
              >
                <path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
