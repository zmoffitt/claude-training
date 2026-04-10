# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Documentation site for the Platform Engineering team's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools.

## Commands

```bash
pnpm dev        # Start local dev server
pnpm build      # Static export to out/
pnpm start      # Serve the static build (uses `serve out`, not `next start`)
```

There are no lint or test commands configured.

## Tech Stack

Next.js 15 (static export via `output: 'export'`), React 19, TypeScript, Tailwind CSS v4 with `@tailwindcss/typography`, Headless UI, Framer Motion, MDX (`remark-gfm` + `rehype-slug`), next-themes, Zustand, pnpm.

## Architecture

**Static export only** — `next.config.mjs` sets `output: 'export'` and `images: { unoptimized: true }`. No server-side features (no API routes, no SSR, no ISR). The build outputs to `out/`.

**Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`). TypeScript strict mode is **off**.

### MDX Pipeline

Content flows through: `next.config.mjs` (configures remark-gfm + rehype-slug) → `mdx-components.tsx` (root-level, maps fenced code blocks to `CodeBlock` component) → `CodeBlock.tsx` (theme-aware syntax highlighting via react-syntax-highlighter with oneLight/oneDark themes).

All documentation pages are `.mdx` files at `src/app/docs/**/page.mdx`, using Next.js App Router file-based routing.

### Layout & Navigation

`Layout.tsx` renders the page shell: fixed sidebar (desktop, `lg:` breakpoint) with `Navigation` + a sticky `Header` + `Footer`. All pages share this layout via `layout.tsx`.

**Navigation is data-driven** — the `navigation` array exported from `Navigation.tsx` defines all sidebar links. It supports arbitrarily nested collapsible groups (see `NavLinkItem.children`). To add a new page, create the `.mdx` file **and** add its entry to this array.

**Mobile navigation** uses a Zustand store (`useMobileNavigationStore` in `MobileNavigation.tsx`) for open/close state, rendered as a Headless UI `Dialog`. Both desktop sidebar and mobile drawer render the same `<Navigation>` component.

### Theming

next-themes with `attribute="class"` (dark mode via `.dark` class on `<html>`). `Providers.tsx` wraps the app with `ThemeProvider` and a `ThemeWatcher` that syncs with system preference.

- **CSS theming**: Custom violet palette and design tokens defined in `src/styles/tailwind.css` via `@theme`
- **Typography**: Extensive prose styling in root-level `typography.ts`, imported by Tailwind via `@config` directive
- **JS access to theme colors**: `lib/theme-colors.ts` provides light/dark color objects for components that need inline styles
- **Theme-aware hook**: `lib/useThemeMode.ts` returns the resolved `'light' | 'dark'` mode for components like `CodeBlock`

## Adding Documentation

1. Create `src/app/docs/<section>/<slug>/page.mdx`
2. Add the entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GFM (tables, strikethrough, task lists) and auto-generate heading IDs via rehype-slug.
