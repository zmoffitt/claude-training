# Cloud AI Training

A documentation site for Zachary Moffitt's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools. Claude is the primary training program; Codex and ChatGPT are a secondary track.

Live site: <https://zmoffitt.github.io/claude-training/>

## Purpose

This repo serves as the single source of truth for:

- **Training materials** — Guides, walkthroughs, and notes from training sessions
- **Best practices** — Proven patterns and workflows for using AI coding tools effectively
- **Configuration references** — Shared configs, prompts, and tool settings
- **Tips and tricks** — Hands-on knowledge for getting the most out of AI assistants

## Training Tracks

| Track | Location | Status |
| --- | --- | --- |
| Claude | `src/app/docs/training/claude-code/` | Four sessions, complete |
| Codex & ChatGPT | `src/app/docs/training/codex-chatgpt/` | Three sessions, complete |

GitHub Copilot and Prompt Engineering are standalone pages beside the two tracks.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (static export, Turbopack)
- [React 19](https://react.dev/)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/typography`
- MDX with `remark-gfm` and `rehype-slug`
- [Headless UI](https://headlessui.com/), [Framer Motion](https://motion.dev/), next-themes, Zustand
- [Pagefind](https://pagefind.app/) (static search index)
- [pnpm](https://pnpm.io/) (package manager)

## Prerequisites

- **Node.js** >= 20.9 (the Next.js 16 minimum; CI builds on Node 22)
- **pnpm** >= 10 — install via `corepack enable` (bundled with Node below 25) or `npm install -g pnpm`

## Getting Started

```bash
# Clone the repo
git clone git@github.com:zmoffitt/claude-training.git
cd claude-training

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The site is configured with the base path `/claude-training`, so the dev server answers at <http://localhost:3000/claude-training/>. The bare `http://localhost:3000/` is a 404.

## Build & Deploy

The site is a fully static export — no server-side rendering.

```bash
# Build the static site into out/, then index it with Pagefind
pnpm build

# Serve the build at http://localhost:3000/claude-training/
pnpm start

# Remove .next, out, and build caches
pnpm clean
```

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds the site and publishes `out/` to GitHub Pages.

`pnpm start` runs `scripts/preview.mjs`, a small static server that mounts `out/` under the same base path GitHub Pages uses. Set `PORT` to use a port other than 3000.

Search runs on the Pagefind index, which only exists after a build. In `pnpm dev` the search dialog falls back to matching page titles; `pnpm start` serves the real index.

## Project Structure

```
.
├── .github/workflows/     # GitHub Pages deploy (deploy-pages.yml)
├── src/
│   ├── app/
│   │   ├── docs/          # MDX documentation pages (file-based routing)
│   │   ├── layout.tsx     # Root layout
│   │   ├── providers.tsx  # Theme and motion providers
│   │   ├── page.mdx       # Home page
│   │   ├── not-found.tsx  # 404 page
│   │   └── error.tsx      # Error boundary for page content
│   ├── components/        # React components (Navigation, CodeBlock, etc.)
│   ├── lib/               # Utilities, hooks, glossary data
│   └── styles/            # Tailwind CSS and design tokens
├── mdx-components.tsx     # Maps MDX elements to components (code blocks, tables, links)
├── typography.ts          # Prose styles, loaded by Tailwind via @config
├── next.config.mjs        # Static export, base path, MDX plugins
├── scripts/
│   ├── preview.mjs        # Static server behind `pnpm start`
│   └── color-audit.py     # Contrast report for the main text tokens
└── public/                # Static files (.nojekyll)
```

## Adding Documentation

1. Create a new MDX file at `src/app/docs/<section>/<slug>/page.mdx`
2. Give it a title with `export const metadata = { title: "Page Title" };` (the browser tab title)
3. Add a corresponding entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GitHub Flavored Markdown (tables, strikethrough, task lists) and auto-generate heading anchor IDs. Write internal links as `/docs/...` without the `/claude-training` prefix; `next/link` adds the base path.

### Page conventions

Content pages follow `# H1 → <ReadTime minutes={N} /> (pages of 3+ minutes only) → one-line tagline → body → ## Where to go next`. Reuse:

- `<Callout>` — at most one per page, reserved for the single most important call-out
- `<ReadTime minutes={N} />` — chip under the H1 on content pages of three minutes or more
- `<PillarCards />` / `<ProConCards />` — card-grid visualizations that stack responsively
- `<PageHero />` / `<SessionOutline />` / `<TrainingRoadmap />` — landing-page primitives (the home page uses `PageHero` and `TrainingRoadmap` only)

`CLAUDE.md` and `AGENTS.md` list the key components and hold the architecture notes and design conventions for coding agents (Claude Code and Codex respectively); `.impeccable.md` holds the design context.
