'use client'

import { motion } from 'framer-motion'
import { useIsSm } from '@/lib/useIsSm'

const steps = [
  { number: 1, title: 'Foundations', subtitle: 'Manual', color: '#00B5E2', textColor: '#000000' },
  { number: 2, title: 'CLI & Context', subtitle: 'Task Execution', color: '#0FAC27', textColor: '#000000' },
  { number: 3, title: 'MCP & Plugins', subtitle: 'Human in Loop', color: '#6B5CF5', textColor: '#FFFFFF' },
  { number: 4, title: 'Agents', subtitle: 'Human on Loop', color: '#D03AD0', textColor: '#FFFFFF' },
  { number: 5, title: 'Capstone', subtitle: 'Scaling', color: 'var(--surface-deep-purple)', textColor: '#FFFFFF' },
]

const BOX_W = 160
const BOX_H = 150
const GAP = 48
const ARROW_W = 16
const BADGE_H = 32
const PAD_BOTTOM = 48

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const easeOutQuart = [0.25, 1, 0.5, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutQuart },
  },
}

const svgItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutQuart },
  },
}

export function TrainingRoadmap({ activeStep = 1 }: { activeStep?: number }) {
  const totalW = steps.length * BOX_W + (steps.length - 1) * GAP
  const totalH = BOX_H + PAD_BOTTOM

  const isSm = useIsSm()

  if (!isSm) {
    return (
      <motion.ol
        role="list"
        aria-label="Training roadmap showing 5 modules"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={listVariants}
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        {steps.map((step) => {
          const isActive = step.number === activeStep
          return (
            <motion.li
              key={step.number}
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: step.color,
                color: step.textColor,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: '2rem',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                {step.number}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{step.title}</span>
                <span style={{ fontSize: '0.8125rem', opacity: 0.85 }}>{step.subtitle}</span>
              </span>
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    flexShrink: 0,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    animation: 'badge-pulse 2.5s ease-in-out infinite',
                  }}
                >
                  You are here
                </span>
              )}
            </motion.li>
          )
        })}
      </motion.ol>
    )
  }

  return (
    <motion.svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Training roadmap showing 5 modules"
      style={{ width: '100%', maxWidth: '1050px', height: 'auto' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={listVariants}
    >
      {steps.map((step, i) => {
        const x = i * (BOX_W + GAP)

        return (
          <motion.g key={step.number} variants={svgItemVariants}>
            <rect
              x={x}
              y={0}
              width={BOX_W}
              height={BOX_H}
              rx={14}
              ry={14}
              fill={step.color}
            />
            <text
              x={x + BOX_W / 2}
              y={46}
              textAnchor="middle"
              fill={step.textColor}
              fontSize={38}
              fontWeight={300}
              fontStyle="italic"
              fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
            >
              {step.number}
            </text>
            <text
              x={x + BOX_W / 2}
              y={82}
              textAnchor="middle"
              fill={step.textColor}
              fontSize={15}
              fontWeight={700}
              fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
            >
              {step.title}
            </text>
            <text
              x={x + BOX_W / 2}
              y={104}
              textAnchor="middle"
              fill={step.textColor}
              fontSize={13}
              fontWeight={400}
              fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
              opacity={0.85}
            >
              {step.subtitle}
            </text>
            {i < steps.length - 1 && (
              <polygon
                points={`
                  ${x + BOX_W + (GAP - ARROW_W) / 2},${BOX_H / 2 - 8}
                  ${x + BOX_W + (GAP + ARROW_W) / 2},${BOX_H / 2}
                  ${x + BOX_W + (GAP - ARROW_W) / 2},${BOX_H / 2 + 8}
                `}
                fill="#A3A4A4"
              />
            )}
            {step.number === activeStep && (
              <g style={{ animation: 'badge-pulse 2.5s ease-in-out infinite' }}>
                <rect
                  x={x + (BOX_W - 120) / 2}
                  y={BOX_H + 12}
                  width={120}
                  height={BADGE_H}
                  rx={6}
                  ry={6}
                  fill={step.color}
                />
                <text
                  x={x + BOX_W / 2}
                  y={BOX_H + 12 + BADGE_H / 2 + 5}
                  textAnchor="middle"
                  fill={step.textColor}
                  fontSize={12}
                  fontWeight={700}
                  fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
                  letterSpacing={0.5}
                >
                  YOU ARE HERE
                </text>
              </g>
            )}
          </motion.g>
        )
      })}
    </motion.svg>
  )
}
