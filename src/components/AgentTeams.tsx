'use client'

import { useIsSm } from '@/lib/useIsSm'
import { themeVars, brandVars } from '@/lib/theme-colors'

export function AgentTeams() {
  const isSm = useIsSm()

  const LEAD = { cx: 180, cy: 40, r: 32 }
  const TASK_LIST = { x: 110, y: 110, w: 140, h: 70 }
  const TEAMMATES = [
    { label: 'Security', cx: 60, cy: 250, r: 30 },
    { label: 'Perf', cx: 180, cy: 265, r: 30 },
    { label: 'Tests', cx: 300, cy: 250, r: 30 },
  ]

  const tableCellStyle: React.CSSProperties = {
    padding: '0.65rem 1rem',
    borderBottom: '1px solid var(--at-row-border)',
    verticalAlign: 'top',
    lineHeight: 1.45,
    fontSize: '0.875rem',
    color: themeVars.text,
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* LEFT: SVG diagram on ≥sm, text summary on mobile */}
          {isSm ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 360 310"
              style={{ width: '100%', maxWidth: '360px', height: 'auto', display: 'block' }}
              aria-label="Agent team architecture: Lead at top coordinates a Shared Task List in the middle. Three teammates (Security, Perf, Tests) at bottom claim tasks via dashed arrows and exchange peer-to-peer messages via green arrows."
            >
              <defs>
                <marker
                  id="team-peer-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: brandVars.green.text }} />
                </marker>
              </defs>

              <rect
                x={TASK_LIST.x}
                y={TASK_LIST.y}
                width={TASK_LIST.w}
                height={TASK_LIST.h}
                rx={8}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                style={{ fill: 'var(--at-task-list-fill)', stroke: 'var(--at-task-list-stroke)' }}
              />
              <text
                x={TASK_LIST.x + TASK_LIST.w / 2}
                y={TASK_LIST.y + 22}
                textAnchor="middle"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={11}
                fontWeight={700}
                style={{ fill: brandVars.blue.text }}
              >
                Shared Task List
              </text>
              <text
                x={TASK_LIST.x + TASK_LIST.w / 2}
                y={TASK_LIST.y + 42}
                textAnchor="middle"
                fontFamily="'SF Mono', monospace"
                fontSize={9}
                style={{ fill: themeVars.textMuted }}
              >
                ☐ task-1   ☐ task-2
              </text>
              <text
                x={TASK_LIST.x + TASK_LIST.w / 2}
                y={TASK_LIST.y + 56}
                textAnchor="middle"
                fontFamily="'SF Mono', monospace"
                fontSize={9}
                style={{ fill: themeVars.textMuted }}
              >
                ☑ task-3   ☐ task-4
              </text>

              <line
                x1={LEAD.cx}
                y1={LEAD.cy + LEAD.r}
                x2={TASK_LIST.x + TASK_LIST.w / 2}
                y2={TASK_LIST.y}
                strokeWidth={1.5}
                style={{ stroke: brandVars.blue.text }}
              />

              <circle
                cx={LEAD.cx}
                cy={LEAD.cy}
                r={LEAD.r}
                strokeWidth={2}
                style={{ fill: brandVars.blue.badgeBg, stroke: themeVars.cardBg }}
              />
              <text
                x={LEAD.cx}
                y={LEAD.cy - 3}
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={11}
                fontWeight={700}
              >
                Lead
              </text>
              <text
                x={LEAD.cx}
                y={LEAD.cy + 11}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={9}
              >
                coordinates
              </text>

              {TEAMMATES.map((tm) => {
                const x1 = tm.cx + (tm.cx < 180 ? 18 : tm.cx > 180 ? -18 : 0)
                const y1 = tm.cy - 24
                const targetX =
                  tm.cx < 180
                    ? TASK_LIST.x + 30
                    : tm.cx > 180
                      ? TASK_LIST.x + TASK_LIST.w - 30
                      : TASK_LIST.x + TASK_LIST.w / 2
                const targetY = TASK_LIST.y + TASK_LIST.h
                return (
                  <line
                    key={`claim-${tm.label}`}
                    x1={x1}
                    y1={y1}
                    x2={targetX}
                    y2={targetY}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    style={{ stroke: brandVars.blue.text }}
                  />
                )
              })}

              <path
                d={`M ${TEAMMATES[0].cx + 26} ${TEAMMATES[0].cy + 6}
                    L ${TEAMMATES[1].cx - 26} ${TEAMMATES[1].cy - 4}`}
                strokeWidth={2}
                fill="none"
                markerEnd="url(#team-peer-arrow)"
                style={{ stroke: brandVars.green.text }}
              />
              <path
                d={`M ${TEAMMATES[1].cx - 26} ${TEAMMATES[1].cy + 8}
                    L ${TEAMMATES[0].cx + 26} ${TEAMMATES[0].cy - 2}`}
                strokeWidth={2}
                fill="none"
                markerEnd="url(#team-peer-arrow)"
                style={{ stroke: brandVars.green.text }}
              />
              <path
                d={`M ${TEAMMATES[1].cx + 26} ${TEAMMATES[1].cy - 2}
                    L ${TEAMMATES[2].cx - 26} ${TEAMMATES[2].cy - 6}`}
                strokeWidth={2}
                fill="none"
                markerEnd="url(#team-peer-arrow)"
                style={{ stroke: brandVars.green.text }}
              />
              <path
                d={`M ${TEAMMATES[2].cx - 26} ${TEAMMATES[2].cy + 6}
                    L ${TEAMMATES[1].cx + 26} ${TEAMMATES[1].cy + 10}`}
                strokeWidth={2}
                fill="none"
                markerEnd="url(#team-peer-arrow)"
                style={{ stroke: brandVars.green.text }}
              />

              {TEAMMATES.map((tm) => (
                <g key={tm.label}>
                  <circle
                    cx={tm.cx}
                    cy={tm.cy}
                    r={tm.r}
                    strokeWidth={1.5}
                    style={{ fill: 'var(--at-teammate-fill)', stroke: 'var(--at-teammate-stroke)' }}
                  />
                  <text
                    x={tm.cx}
                    y={tm.cy - 3}
                    textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                    fontSize={10}
                    fontWeight={600}
                    style={{ fill: brandVars.blue.text }}
                  >
                    {tm.label}
                  </text>
                  <text
                    x={tm.cx}
                    y={tm.cy + 9}
                    textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                    fontSize={9}
                    style={{ fill: 'var(--at-teammate-label)' }}
                  >
                    teammate
                  </text>
                </g>
              ))}

              <line
                x1={70}
                y1={300}
                x2={95}
                y2={300}
                strokeWidth={1}
                strokeDasharray="3 3"
                style={{ stroke: brandVars.blue.text }}
              />
              <text
                x={100}
                y={303}
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={9}
                style={{ fill: themeVars.textMuted }}
              >
                claim tasks
              </text>
              <line
                x1={170}
                y1={300}
                x2={195}
                y2={300}
                strokeWidth={2}
                markerEnd="url(#team-peer-arrow)"
                style={{ stroke: brandVars.green.text }}
              />
              <text
                x={200}
                y={303}
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize={9}
                style={{ fill: themeVars.textMuted }}
              >
                peer messaging
              </text>
            </svg>
          </div>
          ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              padding: '0.9rem 1rem',
              backgroundColor: 'var(--at-card-bg)',
              borderRadius: '8px',
              boxShadow: themeVars.shadow,
              fontSize: '0.875rem',
              color: themeVars.text,
              lineHeight: 1.5,
            }}
          >
            <div>
              <strong style={{ color: brandVars.blue.text }}>Lead</strong>{' '}
              coordinates the team.
            </div>
            <div>
              <strong style={{ color: brandVars.blue.text }}>Shared Task List</strong>
              <span style={{ display: 'block', fontFamily: "'SF Mono', monospace", fontSize: '0.8125rem', color: themeVars.textMuted, marginTop: '0.15rem' }}>
                ☐ task-1&nbsp;&nbsp;☐ task-2&nbsp;&nbsp;☑ task-3&nbsp;&nbsp;☐ task-4
              </span>
            </div>
            <div>
              <strong style={{ color: brandVars.blue.text }}>Teammates:</strong>{' '}
              Security, Perf, Tests — each claims tasks from the list and
              messages the others peer-to-peer.
            </div>
          </div>
          )}

          {/* RIGHT: Comparison table */}
          <div
            style={{
              backgroundColor: 'var(--at-card-bg)',
              borderRadius: '8px',
              boxShadow: themeVars.shadow,
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: 'var(--at-header-neutral-bg)',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                    }}
                  />
                  <th
                    style={{
                      backgroundColor: 'var(--at-header-sub-bg)',
                      color: '#ffffff',
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Subagents
                  </th>
                  <th
                    style={{
                      backgroundColor: 'var(--at-header-team-bg)',
                      color: '#ffffff',
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Agent Teams
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: themeVars.heading }}>
                    Communication
                  </td>
                  <td style={tableCellStyle}>Report back to parent</td>
                  <td style={tableCellStyle}>Peer-to-peer messaging</td>
                </tr>
                <tr>
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: themeVars.heading }}>
                    Coordination
                  </td>
                  <td style={tableCellStyle}>Parent manages all</td>
                  <td style={tableCellStyle}>Shared task list + self-claim</td>
                </tr>
                <tr>
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: themeVars.heading }}>
                    Best For
                  </td>
                  <td style={tableCellStyle}>Focused, independent</td>
                  <td style={tableCellStyle}>Complex, collaborative</td>
                </tr>
                <tr>
                  <td
                    style={{
                      ...tableCellStyle,
                      borderBottom: 'none',
                      fontWeight: 700,
                      color: themeVars.heading,
                    }}
                  >
                    Tokens
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                      borderBottom: 'none',
                      color: brandVars.green.text,
                      fontWeight: 600,
                    }}
                  >
                    Lower
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                      borderBottom: 'none',
                      color: brandVars.pink.text,
                      fontWeight: 600,
                    }}
                  >
                    Higher
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom callout */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--at-callout)',
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
              backgroundColor: brandVars.blue.accentBar,
            }}
          />
          <div style={{ fontSize: '0.9375rem', color: themeVars.text, lineHeight: 1.55 }}>
            <strong style={{ color: brandVars.blue.text }}>
              Subagents when only the result matters.
            </strong>{' '}
            Agent teams when teammates need to discuss, challenge each other,
            and coordinate. Teams share a task list and claim work
            independently.
          </div>
        </div>
      </div>
    </div>
  )
}
