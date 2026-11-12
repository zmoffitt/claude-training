import { themeVars } from '@/lib/theme-colors'

type AutonomyLevel = 1 | 2 | 3

interface TaskRow {
  task: string
  level: AutonomyLevel
}

const LEVELS: Array<{ level: AutonomyLevel; name: string }> = [
  { level: 1, name: 'Task Execution' },
  { level: 2, name: 'Human in the Loop' },
  { level: 3, name: 'Human on the Loop' },
]

/**
 * Tasks against the three autonomy levels, one mark per row. It renders the
 * same markup the MDX pipeline gives a markdown table (the scroll region and
 * a bare table element), so it takes the house styling for tables and adds
 * only what markdown cannot: two-line column heads and a spoken yes or no in
 * every cell.
 */
export function TaskAutonomyMatrix({ rows }: { rows: Array<TaskRow> }) {
  return (
    <div className="max-w-2xl lg:max-w-3xl">
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Scrollable table: tasks by autonomy level"
      >
        <table>
          <caption className="sr-only">
            Sample decision matrix: common DevOps and IAM tasks, each placed at one of
            three autonomy levels.
          </caption>
          <thead>
            <tr>
              <th scope="col">Task</th>
              {LEVELS.map(({ level, name }) => (
                // The level name may wrap, unlike other column heads, so the
                // three level columns stay narrow enough for a phone.
                <th key={level} scope="col" style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                  <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Level {level}</span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      color: themeVars.textMuted,
                    }}
                  >
                    {name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.task}>
                <td style={{ fontWeight: 600, color: themeVars.heading }}>{row.task}</td>
                {LEVELS.map(({ level }) => {
                  const match = row.level === level
                  return (
                    <td key={level} style={{ textAlign: 'center' }}>
                      <span
                        aria-hidden="true"
                        style={
                          match
                            ? { fontWeight: 700, color: 'var(--session-hue, var(--brand-purple-text))' }
                            : { color: themeVars.textSubtle }
                        }
                      >
                        {match ? '✓' : '—'}
                      </span>
                      <span className="sr-only">{match ? 'Yes' : 'No'}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
