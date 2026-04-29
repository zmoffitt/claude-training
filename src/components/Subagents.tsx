import { themeVars, brandVars } from '@/lib/theme-colors'

const SATELLITES = [
  { label: 'Explore', cx: 60, cy: 40 },
  { label: 'Plan', cx: 280, cy: 40 },
  { label: 'Research', cx: 60, cy: 240 },
  { label: 'Custom', cx: 280, cy: 240 },
]

const BULLETS: Array<React.ReactNode> = [
  <>Spawned for a <strong>specific, focused task</strong></>,
  <>Own context window — <strong>isolated</strong></>,
  <>Reports results back, then <strong>terminates</strong></>,
  <>No peer-to-peer communication</>,
  <>Lower token cost, short-lived</>,
]

export function Subagents() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 340 290"
              style={{ width: '100%', maxWidth: '340px', height: 'auto', display: 'block' }}
              aria-label="Subagent hub-and-spoke: Main Agent at center, four subagents (Explore, Plan, Research, Custom) around it. Dashed pink arrows indicate spawn; solid purple arrows indicate result."
            >
              <defs>
                <marker
                  id="sub-spawn-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: brandVars.pink.accentBar }} />
                </marker>
                <marker
                  id="sub-result-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: brandVars.purple.text }} />
                </marker>
              </defs>

              <circle
                cx={170}
                cy={140}
                r={44}
                strokeWidth={2}
                style={{ fill: brandVars.purple.badgeBg, stroke: themeVars.cardBg }}
              />
              <text
                x={170}
                y={134}
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={12}
                fontWeight={700}
              >
                Main
              </text>
              <text
                x={170}
                y={150}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={10}
              >
                Agent
              </text>

              {SATELLITES.map((sat) => {
                const dx = sat.cx > 170 ? 1 : -1
                const dy = sat.cy > 140 ? 1 : -1
                const spawnX1 = 170 + 40 * dx * 0.7
                const spawnY1 = 140 + 28 * dy
                const spawnX2 = sat.cx - 25 * dx
                const spawnY2 = sat.cy + 28 * dy
                const resultX1 = sat.cx - 25 * dx + 4 * dx
                const resultY1 = sat.cy + 28 * dy - 4 * dy
                const resultX2 = 170 + 40 * dx * 0.7 + 4 * dx
                const resultY2 = 140 + 28 * dy - 4 * dy
                return (
                  <g key={`arrows-${sat.label}`}>
                    <line
                      x1={spawnX1}
                      y1={spawnY1}
                      x2={spawnX2}
                      y2={spawnY2}
                      strokeWidth={1.5}
                      strokeDasharray="5 3"
                      markerEnd="url(#sub-spawn-arrow)"
                      style={{ stroke: brandVars.pink.accentBar }}
                    />
                    <line
                      x1={resultX1}
                      y1={resultY1}
                      x2={resultX2}
                      y2={resultY2}
                      strokeWidth={2}
                      markerEnd="url(#sub-result-arrow)"
                      style={{ stroke: brandVars.purple.text }}
                    />
                  </g>
                )
              })}

              {SATELLITES.map((sat) => (
                <g key={sat.label}>
                  <circle
                    cx={sat.cx}
                    cy={sat.cy}
                    r={32}
                    strokeWidth={1.5}
                    style={{ fill: 'var(--sa-satellite-fill)', stroke: 'var(--sa-satellite-stroke)' }}
                  />
                  <text
                    x={sat.cx}
                    y={sat.cy - 3}
                    textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                    fontSize={10}
                    fontWeight={600}
                    style={{ fill: brandVars.purple.text }}
                  >
                    {sat.label}
                  </text>
                  <text
                    x={sat.cx}
                    y={sat.cy + 10}
                    textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                    fontSize={9}
                    style={{ fill: 'var(--sa-subagent-label)' }}
                  >
                    subagent
                  </text>
                </g>
              ))}

              <line
                x1={100}
                y1={278}
                x2={130}
                y2={278}
                strokeWidth={1.5}
                strokeDasharray="5 3"
                markerEnd="url(#sub-spawn-arrow)"
                style={{ stroke: brandVars.pink.accentBar }}
              />
              <text
                x={138}
                y={282}
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={9}
                style={{ fill: themeVars.textMuted }}
              >
                spawn
              </text>
              <line
                x1={185}
                y1={278}
                x2={215}
                y2={278}
                strokeWidth={2}
                markerEnd="url(#sub-result-arrow)"
                style={{ stroke: brandVars.purple.text }}
              />
              <text
                x={223}
                y={282}
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={9}
                style={{ fill: themeVars.textMuted }}
              >
                result
              </text>
            </svg>
          </div>

          <div
            style={{
              backgroundColor: 'var(--sa-card-bg)',
              borderRadius: '8px',
              boxShadow: themeVars.shadow,
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '5px', backgroundColor: brandVars.purple.accentBar }} />
            <div style={{ padding: '1.25rem 1.4rem 1.5rem' }}>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: brandVars.purple.text,
                  marginBottom: '0.85rem',
                }}
              >
                How Subagents Work
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                }}
              >
                {BULLETS.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.9375rem',
                      color: themeVars.text,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: brandVars.purple.text,
                        marginTop: '0.5em',
                      }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--sa-callout)',
            borderRadius: '6px',
            padding: '0.875rem 1.25rem 0.875rem 1.5rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '5px',
              backgroundColor: brandVars.purple.accentBar,
            }}
          />
          <div style={{ fontSize: '0.9375rem', color: themeVars.text, lineHeight: 1.55 }}>
            <strong style={{ color: brandVars.purple.text }}>
              Think of subagents as junior colleagues you send to research
              something
            </strong>{' '}
            — they come back with an answer. You don&rsquo;t supervise every
            step; you evaluate the result.
          </div>
        </div>
      </div>
    </div>
  )
}
