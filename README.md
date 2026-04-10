# Cloud AI Training

A documentation site for the Platform Engineering team's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools including Claude, Codex, and other AI-assisted development platforms.

## Purpose

This repo serves as the single source of truth for:

- **Training materials** — Guides, walkthroughs, and session notes from team trainings
- **Best practices** — Proven patterns and workflows for using AI coding tools effectively
- **Configuration references** — Shared configs, prompts, and tool settings
- **Tips and tricks** — Team-contributed knowledge for getting the most out of AI assistants

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
git clone git@github.com:Teladoc/cloud-ai-training.git
cd cloud-ai-training

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
│   └── page.tsx       # Home page
├── components/        # React components (Navigation, CodeBlock, etc.)
├── lib/               # Utilities and hooks
└── styles/            # Tailwind CSS and theme config
```

## Adding Documentation

1. Create a new MDX file at `src/app/docs/<section>/<slug>/page.mdx`
2. Add a corresponding entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GitHub Flavored Markdown (tables, strikethrough, task lists) and auto-generate heading anchor IDs.

## Contributing

All Platform Engineering team members are encouraged to contribute.

### Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b your-name/short-description
   ```
2. **Make your changes** — add training notes, docs pages, configuration examples, or any resources that help the team level up with AI tools.
3. **Test locally** — run `pnpm dev` and verify your changes look correct.
4. **Build check** — run `pnpm build` to make sure the static export succeeds.
5. **Commit and push**:
   ```bash
   git add <files>
   git commit -m "Brief description of changes"
   git push -u origin your-name/short-description
   ```
6. **Open a Pull Request** against `main` on [GitHub](https://github.com/Teladoc/cloud-ai-training/pulls) and request a review from a teammate.
