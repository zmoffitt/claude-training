'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { RowArrow } from '@/components/RowArrow'
import { focusRing } from '@/lib/focusRing'

interface OutlineItem {
  href: string
  title: string
  description: string
}

const listVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const },
  },
}

/**
 * What a session covers, as numbered link rows. The number chip takes the
 * session hue; each row ends in the shared `RowArrow`, and hover or keyboard
 * focus lays the card surface under it.
 */
export function SessionOutline({ items }: { items: OutlineItem[] }) {
  return (
    <nav className="not-prose" aria-label="Session outline">
      <motion.ol
        initial="hidden"
        animate="visible"
        variants={listVariants}
        className="m-0 flex list-none flex-col gap-0.5 p-0"
      >
        {items.map((item, i) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                'group -mx-3 flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-(--theme-card-bg) focus-visible:bg-(--theme-card-bg)',
                focusRing,
              )}
            >
              <span
                aria-hidden="true"
                className="relative top-px inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-bold tabular-nums"
                style={{
                  backgroundColor:
                    'color-mix(in oklch, var(--session-hue, var(--surface-deep-purple)) 14%, transparent)',
                  color: 'var(--session-hue, var(--brand-purple-text))',
                }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-semibold text-(--theme-heading)">{item.title}:</span>{' '}
                <span className="text-(--theme-text-muted)">{item.description}</span>
              </span>
              <RowArrow className="text-sm" />
            </Link>
          </li>
        ))}
      </motion.ol>
    </nav>
  )
}
