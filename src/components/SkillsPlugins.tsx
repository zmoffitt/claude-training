import { themeVars, brandVars, type BrandKey } from '@/lib/theme-colors'

const codeStyle: React.CSSProperties = {
  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  backgroundColor: 'var(--tint-code)',
  color: themeVars.heading,
  padding: '0.15em 0.4em',
  borderRadius: '4px',
}

function Code({ children }: { children: React.ReactNode }) {
  return <code style={codeStyle}>{children}</code>
}

interface Topic {
  title: string
  tagline: string
  bullets: Array<React.ReactNode>
  brand: BrandKey
}

const TOPICS: Array<Topic> = [
  {
    title: 'Skills',
    tagline: 'Structured instructions for specific tasks',
    bullets: [
      <>Defined in <Code>SKILL.md</Code> files</>,
      <>Invoked with <Code>/skill-name</Code></>,
      <>Can include reference docs</>,
      <>Team-shareable via plugins</>,
    ],
    brand: 'green',
  },
  {
    title: 'Hooks',
    tagline: 'Automated triggers in settings.json',
    bullets: [
      <>Before/after lifecycle events</>,
      <>Shell commands on triggers</>,
      <>Lint, test, validate on save</>,
      <>Deterministic, not AI</>,
    ],
    brand: 'purple',
  },
  {
    title: 'Plugins',
    tagline: 'Bundled skills + agents + MCP servers',
    bullets: [
      <>Install from marketplaces</>,
      <>Bundle related capabilities</>,
      <>Include agents &amp; MCP servers</>,
      <>Version-controlled, shareable</>,
    ],
    brand: 'blue',
  },
]

interface BottomCallout {
  title: string
  body: React.ReactNode
  brand: 'green' | 'purple' | 'blue' | 'pink'
}

export function SkillsPlugins() {
  const callouts: Array<BottomCallout> = [
    {
      title: 'GitHub Actions Autofix',
      brand: 'green',
      body: (
        <>
          <code style={codeStyle}>@claude</code> in any PR or issue → Claude
          analyzes code, fixes CI failures, responds to review comments, and
          pushes fixes. Runs headlessly on GitHub runners. Setup:{' '}
          <code style={codeStyle}>/install-github-app</code>
        </>
      ),
    },
    {
      title: 'Monitor Tool',
      brand: 'purple',
      body: (
        <>
          Say{' '}
          <code style={codeStyle}>&ldquo;monitor my CI pipeline&rdquo;</code>{' '}
          or{' '}
          <code style={codeStyle}>
            &ldquo;tail the app log and flag errors&rdquo;
          </code>{' '}
          — Claude writes a watch script, runs it in the background, and
          interjects when something happens. You keep working in the same
          session.
        </>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            alignItems: 'stretch',
          }}
        >
          {TOPICS.map((topic) => {
            const b = brandVars[topic.brand]
            return (
              <div
                key={topic.title}
                style={{
                  backgroundColor: themeVars.cardBg,
                  borderRadius: '6px',
                  boxShadow: themeVars.shadow,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '5px', backgroundColor: b.accentBar }} />
                <div
                  style={{
                    padding: '1.25rem 1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: b.text,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {topic.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: themeVars.textMuted,
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    {topic.tagline}
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: '0.25rem 0 0',
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {topic.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.55rem',
                          fontSize: '0.875rem',
                          color: themeVars.text,
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: b.text,
                            marginTop: '0.5em',
                          }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {callouts.map((c) => {
            const b = brandVars[c.brand]
            return (
              <div
                key={c.title}
                style={{
                  position: 'relative',
                  backgroundColor: `var(--sp-callout-${c.brand})`,
                  borderRadius: '6px',
                  padding: '0.85rem 1rem 0.85rem 1.2rem',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: b.accentBar,
                  }}
                />
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: themeVars.heading,
                    marginBottom: '0.25rem',
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: themeVars.text, lineHeight: 1.55 }}>
                  {c.body}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
