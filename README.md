# Cloud AI Training

A documentation site for Zachary Moffitt's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools including Claude, Codex, and other AI-assisted development platforms.

## Purpose

This repo serves as the single source of truth for:

- **Training materials** — Guides, walkthroughs, and notes from training sessions
- **Best practices** — Proven patterns and workflows for using AI coding tools effectively
- **Configuration references** — Shared configs, prompts, and tool settings
- **Tips and tricks** — Hands-on knowledge for getting the most out of AI assistants

## Tech Stack

- [Next.js 15](https://nextjs.org/) (static export)
- [React 19](https://react.dev/)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/typography`
- MDX with `remark-gfm` and `rehype-slug`
- [Framer Motion](https://motion.dev/)
- [pnpm](https://pnpm.io/) (package manager)

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 — install via `corepack enable` or `npm install -g pnpm`

## Getting Started

```bash
# Clone the repo
git clone git@github.com:zmoffitt/claude-training.git
cd claude-training

# Install dependencies
pnpm install

# Start the dev server (http://localhost:3000)
pnpm dev
```

## Build & Serve

The site is a fully static export — no server-side rendering.

```bash
# Build the static site (outputs to out/)
pnpm build

# Serve the static build locally
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── docs/          # MDX documentation pages (file-based routing)
│   ├── layout.tsx     # Root layout
│   ├── page.mdx       # Home page
│   └── not-found.tsx  # 404 page
├── components/        # React components (Navigation, CodeBlock, etc.)
├── lib/               # Utilities and hooks
└── styles/            # Tailwind CSS and theme config
```

## Adding Documentation

1. Create a new MDX file at `src/app/docs/<section>/<slug>/page.mdx`
2. Add a corresponding entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GitHub Flavored Markdown (tables, strikethrough, task lists) and auto-generate heading anchor IDs.

### Page conventions

Content pages follow `# H1 → <ReadTime minutes={N} /> → one-line tagline → body → ## Where to go next`. Reuse:

- `<Callout>` — one per page, reserved for the single most important call-out
- `<ReadTime minutes={N} />` — chip under the H1 on every content page
- `<PillarCards />` / `<ProConCards />` — card-grid visualizations that stack responsively
- `<HeroPattern />` / `<TrainingRoadmap />` / `<SessionOutline />` — session landing-page primitives

See `CLAUDE.md` for the full component inventory and design conventions.

