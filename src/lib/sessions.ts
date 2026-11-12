/**
 * The sessions of each training track, named once. The sidebar, the roadmap,
 * the track landing pages, and the 404 page all read from here, so a session
 * has the same name wherever it appears. A session landing page may extend
 * its name in the headline ("Foundations & Getting Oriented") but should not
 * replace it. The Start Here page is MDX and repeats these names by hand.
 */
export type Track = 'claude' | 'codex'

export interface Session {
  number: number
  /** The session's name on every surface. */
  title: string
  /** The roadmap's second line: the working mode or outcome the session reaches. */
  mode: string
  /** Topics, as a short list that can follow a dash or stand alone. */
  covers: string
  /** Absent until the session has pages. */
  href?: string
}

export const claudeSessions: Array<Session> = [
  {
    number: 1,
    title: 'Foundations',
    mode: 'Manual',
    covers: 'what Claude is, how context works, models and effort, plan mode',
    href: '/docs/training/claude-code/session-1',
  },
  {
    number: 2,
    title: 'CLI Workflows & Project Context',
    mode: 'Task Execution',
    covers: 'permissions, CLAUDE.md, hooks, subagents',
    href: '/docs/training/claude-code/session-2',
  },
  {
    number: 3,
    title: 'Extending Claude',
    mode: 'Human in Loop',
    covers: 'skills, plugins, MCP, connectors, scheduled tasks',
    href: '/docs/training/claude-code/session-3',
  },
  { number: 4, title: 'Agents', mode: 'Human on Loop', covers: 'agents' },
  { number: 5, title: 'Capstone', mode: 'Scaling', covers: 'capstone' },
]

export const codexSessions: Array<Session> = [
  {
    number: 1,
    title: 'Foundations & ChatGPT',
    mode: 'ChatGPT & verification',
    covers: 'context, projects, model selection, and evidence-based verification',
    href: '/docs/training/codex-chatgpt/session-1',
  },
  {
    number: 2,
    title: 'Codex Workflows & Project Context',
    mode: 'Verified repository work',
    covers: 'setup, AGENTS.md, permissions, implementation, and review',
    href: '/docs/training/codex-chatgpt/session-2',
  },
  {
    number: 3,
    title: 'Skills, Connections & Automation',
    mode: 'Reusable workflows',
    covers: 'reusable skills, MCP, plugins, scheduled tasks, and evaluation',
    href: '/docs/training/codex-chatgpt/session-3',
  },
]

export const sessionsByTrack: Record<Track, Array<Session>> = {
  claude: claudeSessions,
  codex: codexSessions,
}

/** "Session 2: CLI Workflows & Project Context", the form the sidebar and cross-links use. */
export function sessionLabel(session: Session): string {
  return `Session ${session.number}: ${session.title}`
}

/** The sessions that have pages, as items for `SessionOutline`. */
export function sessionOutline(track: Track) {
  return sessionsByTrack[track]
    .filter((s): s is Session & { href: string } => Boolean(s.href))
    .map((s) => ({
      href: s.href,
      title: sessionLabel(s),
      description: s.covers.charAt(0).toUpperCase() + s.covers.slice(1),
    }))
}

/** Which track and session a pathname belongs to, if any. */
export function sessionOfPath(pathname: string): { track: Track; number: number } | null {
  const match = pathname.match(/^\/docs\/training\/(claude-code|codex-chatgpt)\/session-(\d+)(?:\/|$)/)
  if (!match) return null
  return { track: match[1] === 'claude-code' ? 'claude' : 'codex', number: Number(match[2]) }
}
