import { themeVars, brandVars } from '@/lib/theme-colors'

interface TreeRow {
  indent: number
  name: string
  kind: 'dir' | 'file'
  brand?: 'pink' | 'blue' | 'purple'
  description?: string
}

const TREE: Array<TreeRow> = [
  { indent: 0, name: 'your-repo/', kind: 'dir', brand: 'pink' },
  { indent: 1, name: 'CLAUDE.md', kind: 'file', description: 'project instructions (shared via git)' },
  { indent: 1, name: 'CLAUDE.local.md', kind: 'file', description: 'personal overrides (gitignored)' },
  { indent: 1, name: '.claude/', kind: 'dir', brand: 'pink' },
  { indent: 2, name: 'CLAUDE.md', kind: 'file', description: 'alternative location for project instructions' },
  { indent: 2, name: 'settings.json', kind: 'file', description: 'hooks, permissions (shared)' },
  { indent: 2, name: 'settings.local.json', kind: 'file', description: 'local overrides (gitignored)' },
  { indent: 2, name: 'rules/', kind: 'dir', brand: 'blue', description: 'modular instructions by concern' },
  { indent: 2, name: 'commands/', kind: 'dir', brand: 'blue', description: 'custom /project:name slash commands' },
]

interface WhatRow {
  name: string
  body: React.ReactNode
}

const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.4em',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
}

const monoStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.875rem',
}

export function ProjectConfig() {
  const whatRows: Array<WhatRow> = [
    {
      name: 'CLAUDE.md',
      body: (
        <>
          conventions, architecture, guardrails. Committed to git — whole team
          benefits.
        </>
      ),
    },
    {
      name: 'settings.json',
      body: <>hooks, permission rules, automated behaviors. Committed to git.</>,
    },
    {
      name: 'rules/',
      body: (
        <>
          split instructions by concern (<code style={codeStyle}>code-style.md</code>,{' '}
          <code style={codeStyle}>testing.md</code>). Supports path-scoped activation.
        </>
      ),
    },
    {
      name: '*.local.*',
      body: <>personal overrides, env IDs, secrets. Always gitignored.</>,
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              backgroundColor: themeVars.cardBg,
              borderRadius: '6px',
              boxShadow: themeVars.shadow,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '5px', backgroundColor: themeVars.heading }} />
            <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: themeVars.heading,
                  marginBottom: '0.85rem',
                }}
              >
                Repo Root
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {TREE.map((row, i) => {
                  const isDir = row.kind === 'dir'
                  const dirColor = row.brand ? brandVars[row.brand].text : undefined
                  return (
                    <div
                      key={`${row.name}-${i}`}
                      style={{
                        ...monoStyle,
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.5rem',
                        paddingLeft: `${row.indent * 1.25}rem`,
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          color: isDir ? dirColor ?? themeVars.heading : themeVars.text,
                          fontWeight: isDir ? 700 : 500,
                          flexShrink: 0,
                        }}
                      >
                        {row.name}
                      </span>
                      {row.description && (
                        <span
                          style={{
                            fontFamily: 'inherit',
                            fontSize: '0.8125rem',
                            color: themeVars.textMuted,
                          }}
                        >
                          <span style={{ color: themeVars.textSubtle, marginRight: '0.25rem' }}>←</span>
                          {row.description}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: themeVars.cardBg,
              borderRadius: '6px',
              boxShadow: themeVars.shadow,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '5px', backgroundColor: brandVars.blue.accentBar }} />
            <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: themeVars.heading,
                  marginBottom: '0.85rem',
                }}
              >
                What Goes Where
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                {whatRows.map((row) => (
                  <li
                    key={row.name}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.875rem',
                      color: themeVars.text,
                      lineHeight: 1.55,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: brandVars.blue.text,
                        marginTop: '0.5em',
                      }}
                    />
                    <span>
                      <strong style={{ color: themeVars.heading }}>
                        <code style={codeStyle}>{row.name}</code>
                      </strong>{' '}
                      — {row.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--pc-callout)',
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
              backgroundColor: themeVars.heading,
            }}
          />
          <div style={{ fontSize: '0.875rem', color: themeVars.text, lineHeight: 1.55 }}>
            <strong>
              <code style={codeStyle}>claude init</code>
            </strong>{' '}
            bootstraps your CLAUDE.md — scans the repo, proposes conventions.
            Memory lives in <code style={codeStyle}>~/.claude/projects/</code>{' '}
            (global, per-project) and persists architecture decisions between
            sessions.
          </div>
        </div>
      </div>
    </div>
  )
}
