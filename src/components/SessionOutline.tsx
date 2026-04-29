'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { focusRing } from '@/lib/focusRing'

interface OutlineItem {
  href: string
  title: string
  description: string
}

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const easeOutQuart = [0.25, 1, 0.5, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutQuart },
  },
}

export function SessionOutline({ items }: { items: OutlineItem[] }) {
  return (
    <nav className="not-prose" aria-label="Session outline">
      <motion.ol
        initial="hidden"
        animate="visible"
        variants={listVariants}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
        }}
      >
        {items.map((item, i) => (
          <motion.li key={item.href} variants={itemVariants}>
            <Link
              href={item.href}
              className={focusRing}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                margin: '0 -0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-card-bg)'
                const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement
                if (arrow) {
                  arrow.style.opacity = '1'
                  arrow.style.transform = 'translateX(0)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement
                if (arrow) {
                  arrow.style.opacity = '0'
                  arrow.style.transform = 'translateX(-4px)'
                }
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: '1.5rem',
                  height: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  backgroundColor: 'var(--surface-deep-purple)',
                  color: '#fff',
                  position: 'relative',
                  top: '0.0625rem',
                }}
              >
                {i + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, color: 'var(--theme-heading)' }}>
                  {item.title}
                </span>
                <span style={{ color: 'var(--theme-text-muted)' }}>
                  {' — '}
                  {item.description}
                </span>
              </span>
              <span
                data-arrow
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  opacity: 0,
                  transform: 'translateX(-4px)',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                  color: 'var(--theme-text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                &rarr;
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ol>
    </nav>
  )
}
