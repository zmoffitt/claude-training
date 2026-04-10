const steps = [
  { number: 1, title: 'Foundations', subtitle: 'Manual', color: '#4FC3F7', textColor: '#000000' },
  { number: 2, title: 'CLI & Context', subtitle: 'Task Execution', color: '#2DB843', textColor: '#000000' },
  { number: 3, title: 'MCP & Plugins', subtitle: 'Human in Loop', color: '#7B5EED', textColor: '#FFFFFF' },
  { number: 4, title: 'Agents', subtitle: 'Human on Loop', color: '#D03AD0', textColor: '#FFFFFF' },
  { number: 5, title: 'Capstone', subtitle: 'Scaling', color: '#3B2D6B', textColor: '#FFFFFF' },
]

const BOX_W = 160
const BOX_H = 150
const GAP = 48
const ARROW_W = 16
const BADGE_H = 32
const PAD_BOTTOM = 48

export function TrainingRoadmap({ activeStep = 1 }: { activeStep?: number }) {
  const totalW = steps.length * BOX_W + (steps.length - 1) * GAP
  const totalH = BOX_H + PAD_BOTTOM

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Training roadmap showing 5 modules"
      style={{ width: '100%', maxWidth: '1050px', height: 'auto', display: 'block' }}
    >
      {steps.map((step, i) => {
        const x = i * (BOX_W + GAP)

        return (
          <g key={step.number}>
            {/* Box */}
            <rect
              x={x}
              y={0}
              width={BOX_W}
              height={BOX_H}
              rx={14}
              ry={14}
              fill={step.color}
            />

            {/* Number */}
            <text
              x={x + BOX_W / 2}
              y={46}
              textAnchor="middle"
              fill={step.textColor}
              fontSize={38}
              fontWeight={300}
              fontStyle="italic"
              fontFamily="system-ui, sans-serif"
            >
              {step.number}
            </text>

            {/* Title */}
            <text
              x={x + BOX_W / 2}
              y={82}
              textAnchor="middle"
              fill={step.textColor}
              fontSize={15}
              fontWeight={700}
              fontFamily="system-ui, sans-serif"
            >
              {step.title}
            </text>

            {/* Subtitle */}
            <text
              x={x + BOX_W / 2}
              y={104}
              textAnchor="middle"
              fill={step.textColor}
              fontSize={13}
              fontWeight={400}
              fontFamily="system-ui, sans-serif"
              opacity={0.85}
            >
              {step.subtitle}
            </text>

            {/* Arrow between boxes */}
            {i < steps.length - 1 && (
              <polygon
                points={`
                  ${x + BOX_W + (GAP - ARROW_W) / 2},${BOX_H / 2 - 8}
                  ${x + BOX_W + (GAP + ARROW_W) / 2},${BOX_H / 2}
                  ${x + BOX_W + (GAP - ARROW_W) / 2},${BOX_H / 2 + 8}
                `}
                fill="#9CA3AF"
              />
            )}

            {/* "YOU ARE HERE" badge */}
            {step.number === activeStep && (
              <g>
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
                  fontFamily="system-ui, sans-serif"
                  letterSpacing={0.5}
                >
                  YOU ARE HERE
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
