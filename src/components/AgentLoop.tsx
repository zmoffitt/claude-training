import { brandVars, themeVars, type BrandKey } from '@/lib/theme-colors'

/**
 * The agent loop for Session 4: four beats drawn clockwise around the agent,
 * beside the points where a human steps in. Each beat has its own hue and the
 * dots in the list repeat it, so the list doubles as the legend. The hues
 * belong to this diagram and mean nothing outside it.
 */
const FONT = 'var(--font-sans), system-ui, sans-serif'
const BOX_HEIGHT = 56

interface Beat {
  label: string
  sub: string
  hue: BrandKey
  x: number
  y: number
  width: number
}

const BEATS: Array<Beat> = [
  { label: '1. Observe', sub: 'read state, logs, context', hue: 'blue', x: 118, y: 14, width: 164 },
  { label: '2. Plan', sub: 'choose the next step', hue: 'purple', x: 258, y: 142, width: 140 },
  { label: '3. Act', sub: 'call a tool, write code', hue: 'green', x: 118, y: 270, width: 164 },
  { label: '4. Evaluate', sub: 'did it work? what now?', hue: 'pink', x: 2, y: 142, width: 140 },
]

// Observe to Plan, Plan to Act, Act to Evaluate, Evaluate back to Observe.
// Each stops 6 units short of its target so the arrowhead meets the edge.
const ARROWS = [
  'M 282 42 Q 328 42 328 136',
  'M 328 198 Q 328 298 288 298',
  'M 118 298 Q 72 298 72 204',
  'M 72 142 Q 72 42 112 42',
]

const CHECKPOINTS: Array<{ hue: BrandKey; lead: string; body: React.ReactNode }> = [
  {
    hue: 'blue',
    lead: 'Before observe:',
    body: <>&ldquo;here&rsquo;s the trigger and the goal&rdquo;</>,
  },
  { hue: 'purple', lead: 'After plan:', body: 'approve the step (Manual permission mode)' },
  { hue: 'green', lead: 'After act:', body: 'approve before destructive writes' },
  { hue: 'pink', lead: 'After evaluate:', body: 'handle escalations and final review' },
  {
    hue: 'neutral',
    lead: 'Human on the loop:',
    body: 'only the last beat; the rest runs free inside guardrails',
  },
]

export function AgentLoop() {
  return (
    // The root is a plain block so it takes the figure width like any other
    // diagram; its two halves opt out of article styles themselves. The two
    // columns appear only at that full width, measured on the figure's own
    // box: beside the sidebar a column would be too narrow for the drawing.
    <div className="@container">
    <div className="grid grid-cols-1 items-center gap-6 @3xl:grid-cols-2">
      {/* Below about 420px the drawing would shrink its labels under 11px,
          so it keeps a minimum width and this region scrolls sideways. */}
      <div className="figure-scroll not-prose" tabIndex={0} role="region" aria-label="Agent loop diagram">
        <svg
          viewBox="0 0 400 340"
          role="img"
          aria-label="Agent loop: Claude, the agent, sits at the center of four beats that run clockwise. 1, Observe: read state, logs, context. 2, Plan: choose the next step. 3, Act: call a tool, write code. 4, Evaluate: did it work, what now. Evaluate leads back to Observe."
          style={{
            width: '100%',
            minWidth: '380px',
            maxWidth: '400px',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
          }}
        >
          <defs>
            <marker
              id="agent-loop-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: themeVars.textSubtle }} />
            </marker>
          </defs>

          {ARROWS.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              strokeWidth={1.5}
              markerEnd="url(#agent-loop-arrow)"
              style={{ stroke: themeVars.textSubtle }}
            />
          ))}

          <circle
            cx={200}
            cy={170}
            r={38}
            strokeWidth={1.5}
            style={{ fill: 'var(--tint-neutral)', stroke: 'var(--surface-border)' }}
          />
          <text
            x={200}
            y={167}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={14}
            fontWeight={700}
            style={{ fill: themeVars.heading }}
          >
            Agent
          </text>
          <text
            x={200}
            y={183}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={12}
            style={{ fill: themeVars.textMuted }}
          >
            Claude
          </text>

          {BEATS.map((beat) => {
            const center = beat.x + beat.width / 2
            return (
              <g key={beat.label}>
                <rect
                  x={beat.x}
                  y={beat.y}
                  width={beat.width}
                  height={BOX_HEIGHT}
                  rx={10}
                  strokeWidth={1.5}
                  style={{ fill: themeVars.cardBgWhite, stroke: brandVars[beat.hue].accentBar }}
                />
                <text
                  x={center}
                  y={beat.y + 24}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={14}
                  fontWeight={700}
                  style={{ fill: brandVars[beat.hue].text }}
                >
                  {beat.label}
                </text>
                <text
                  x={center}
                  y={beat.y + 42}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={12}
                  style={{ fill: themeVars.textMuted }}
                >
                  {beat.sub}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div
        className="not-prose"
        style={{
          backgroundColor: 'var(--tint-raised)',
          border: '1px solid var(--surface-border)',
          borderRadius: 'var(--radius-card)',
          padding: '1.25rem 1.4rem 1.5rem',
        }}
      >
        <p className="text-base font-bold" style={{ color: themeVars.heading }}>
          Where humans intervene
        </p>
        <p className="mt-1 mb-4 text-[0.8125rem]" style={{ color: themeVars.textMuted }}>
          Each dot matches its beat in the diagram.
        </p>
        <ul role="list" className="flex flex-col gap-2.5">
          {CHECKPOINTS.map((point) => (
            <li
              key={point.lead}
              className="flex items-start gap-2.5 text-[0.9375rem] leading-normal"
              style={{ color: themeVars.text }}
            >
              <span
                aria-hidden="true"
                className="mt-[0.5em] size-2 shrink-0 rounded-full"
                style={{ backgroundColor: brandVars[point.hue].text }}
              />
              <span>
                <strong className="font-semibold" style={{ color: themeVars.heading }}>
                  {point.lead}
                </strong>{' '}
                {point.body}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  )
}
