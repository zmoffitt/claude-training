/**
 * Terms that get a glossary chip on their first use in a page that comes
 * before the page defining them. Each entry links to the defining section and
 * carries a one-line definition shown as a tooltip.
 */
export const glossary = {
  'plan-mode': {
    label: 'plan mode',
    href: '/docs/training/claude-code/session-1/plan-mode-opus',
    definition: 'A permission mode where Claude reads and proposes an approach but edits nothing until you approve the plan.',
  },
  opusplan: {
    label: 'opusplan',
    href: '/docs/training/claude-code/session-1/plan-mode-opus',
    definition: 'A model setting: Opus while planning, Sonnet once you approve the plan and execution starts.',
  },
  effort: {
    label: 'effort',
    href: '/docs/training/claude-code/session-1/thinking-effort-quotas',
    definition: 'How deeply Claude reasons before answering: low, medium, high, xhigh, or max. More effort, more tokens.',
  },
  'claude-md': {
    label: 'CLAUDE.md',
    href: '/docs/training/claude-code/session-2/claude-md',
    definition: 'A Markdown file Claude Code reads at the start of every session: conventions, commands, and guardrails for the project.',
  },
  'auto-mode': {
    label: 'auto mode',
    href: '/docs/training/claude-code/session-2/permission-modes-settings',
    definition: 'The default permission mode in the terminal: a classifier model reviews each action before it runs, so you are not asked about routine ones.',
  },
  acceptedits: {
    label: 'acceptEdits',
    href: '/docs/training/claude-code/session-2/permission-modes-settings',
    definition: 'A permission mode where file edits and safe filesystem commands run without asking; other shell commands still prompt.',
  },
  hook: {
    label: 'hook',
    href: '/docs/training/claude-code/session-2/hooks-lifecycle-control',
    definition: 'A shell command Claude Code runs at a lifecycle event, such as before a tool call. It does not go through the model, so it is deterministic.',
  },
  subagent: {
    label: 'subagent',
    href: '/docs/training/claude-code/session-2/subagents-focused-delegation',
    definition: 'A helper Claude spawns for one focused task in its own context window. It reports a result back and ends.',
  },
  mcp: {
    label: 'MCP',
    href: '/docs/training/claude-code/session-3/mcp-architecture',
    definition: 'Model Context Protocol: the open standard a Claude client uses to call tools and read data from an external server.',
  },
  connector: {
    label: 'connector',
    href: '/docs/training/claude-code/session-3/built-in-connectors',
    definition: 'An MCP server Anthropic hosts and maintains for a SaaS product, such as Microsoft 365 or GitHub, enabled in Settings.',
  },
  'scheduled-task': {
    label: 'scheduled task',
    href: '/docs/training/claude-code/session-3/cloud-routines',
    definition: 'A saved Claude Code prompt that runs on a schedule, an API call, or a GitHub event. Cloud tasks run on Anthropic infrastructure; local ones run in the Desktop app.',
  },
  'skill-md': {
    label: 'SKILL.md',
    href: '/docs/training/claude-code/session-3/skills-deep-dive',
    definition: 'The entry file of a skill: frontmatter saying when to use it, then the steps. Loaded on demand, invoked as a slash command or picked up automatically.',
  },
} as const

export type GlossaryId = keyof typeof glossary
