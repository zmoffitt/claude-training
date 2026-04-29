# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Documentation site for Zachary Moffitt's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools.

## Prerequisites

Node.js >= 18, pnpm >= 10 (install via `corepack enable` or `npm install -g pnpm`).

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

**Deployed via Cloudflare Pages** — A GitHub Actions workflow (`deploy-pages.yml`) builds the site and deploys to Cloudflare Pages using Wrangler on push to `main`. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets in the repo.

**Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`). TypeScript strict mode is **off**.

### MDX Pipeline

Content flows through: `next.config.mjs` (configures remark-gfm + rehype-slug) → `mdx-components.tsx` (root-level, maps fenced code blocks to `CodeBlock`, wraps every markdown table in `<div className="overflow-x-auto">` for narrow-viewport scroll) → `CodeBlock.tsx` (theme-aware syntax highlighting via react-syntax-highlighter with oneLight/oneDark themes).

All documentation pages are `.mdx` files at `src/app/docs/**/page.mdx`, using Next.js App Router file-based routing.

### MDX Page Conventions

Every page exports a `metadata` object for the document title:

```tsx
export const metadata = { title: "Page Title" };
```

**Page rhythm** — content pages follow `H1 → <ReadTime /> → one-line tagline → body → "## Where to go next"`. Landing pages follow `<HeroPattern /> → H1 → <ReadTime /> → tagline → SessionOutline → <TrainingRoadmap />`.

**One Callout per page max** — reserve `<Callout>` for one moment of real punctuation per page. Use bold lead-in inline emphasis (`**Key idea.** Sentence...`) for secondary points instead of stacking Callout boxes.

**Page archetypes** — content pages cast into one of three rhythms so the visual sequence varies:
- *Table-led*: focal markdown table wrapped in `<div className="max-w-2xl lg:max-w-3xl">` to match Callout width.
- *Comparison-led*: `PillarCards` or `ProConCards` as the focal element.
- *Narrative-led*: example, code block, or numbered walkthrough as the focal element.

Fenced code blocks are automatically routed to `CodeBlock` — no import needed. Custom components must be explicitly imported. Key reusable components:

- **`Callout`** — Alert box with `variant` (`error` | `warning` | `info` | `success`), `title`, and `align` props
- **`ReadTime`** — `<ReadTime minutes={N} />` chip placed directly under the H1 on every content page (excludes practice assignments and live demos)
- **`HeroPattern`** / **`TrainingRoadmap`** / **`SessionOutline`** — Used on session landing pages
- **`PillarCards`** / **`ProConCards`** — Card-grid visualizations; both stack on mobile and restore N columns at `sm:` (4-card layouts step through 2×2 at `sm:` before going 4-across at `lg:`)
- Other visualization components (`ModelTierCards`, `ComparisonCards`, `PermissionModel`, `HooksLifecycle`, etc.) are typically one-per-page

### Search & 404

**Search** — `SearchDialog.tsx` opens via `⌘K` / `Ctrl+K` / `/`. Backed by [Pagefind](https://pagefind.app) (built into the static export at `out/pagefind/`); falls back to navigation-title scoring if the runtime can't load the Pagefind index. Empty state shows suggested queries; no-results offers a "broader term, or browse the sidebar" prompt.

**404** — `src/app/not-found.tsx` lists the three sessions with descriptions, surfaces the `⌘K` shortcut inline, and provides "Go home" / "Browse docs" CTAs. Use this pattern (recovery + starting points + search hint) when adding other error pages.

### Layout & Navigation

`Layout.tsx` renders the page shell: fixed sidebar (desktop, `lg:` breakpoint) with `Navigation` + a sticky `Header` + `Footer`. All pages share this layout via `layout.tsx`.

**Navigation is data-driven** — the `navigation` array exported from `Navigation.tsx` defines all sidebar links. It supports arbitrarily nested collapsible groups (see `NavLinkItem.children`). To add a new page, create the `.mdx` file **and** add its entry to this array.

**Mobile navigation** uses a Zustand store (`useMobileNavigationStore` in `MobileNavigation.tsx`) for open/close state, rendered as a Headless UI `Dialog`. Both desktop sidebar and mobile drawer render the same `<Navigation>` component.

### Theming

next-themes with `attribute="class"` (dark mode via `.dark` class on `<html>`). A blocking script in `src/app/layout.tsx` sets the theme class before first paint to prevent FOLM (flash of light mode) per component. `Providers.tsx` wraps the app with `ThemeProvider`, `ThemeWatcher` (syncs with system preference), and `ConsoleGreeting` (one-time dev-console branded greeting).

- **CSS theming**: Custom violet palette and design tokens defined in `src/styles/tailwind.css` under `:root` and `.dark`
- **Typography**: Extensive prose styling in root-level `typography.ts`, imported by Tailwind via `@config` directive
- **Theme-aware inline styles**: Use `themeVars` and `brandVars` from `lib/theme-colors.ts` (CSS variable references like `var(--theme-card-bg)`), or use the native CSS `light-dark()` function directly for one-off color pairs. Both resolve correctly on the first paint because `.dark` is set before the body renders.
- **Reduced motion**: `MotionConfig reducedMotion="user"` is set globally — every Framer Motion animation respects `prefers-reduced-motion: reduce` automatically.

### Component Pattern

All interactive/themed components are `'use client'` and use `themeVars` / `brandVars` (CSS-var-backed) or `light-dark()` for dual-theme styling. **Do not** use `useThemeMode()` to index a `themeColors[mode]` object — that pattern causes a per-component flash during hydration and the hook has been removed. New visualization components should follow the CSS-var pattern.

### Responsive

- **Sidebar**: `Layout.tsx` collapses below `lg:` (1024px); the same `<Navigation>` renders inside a Headless UI `Dialog` for mobile.
- **TableOfContents**: visible from 1366px (narrow rail, `w-44 right-3`), expands at `min-[1440px]:` to `w-56 right-6`. Hidden below 1366 to avoid overlap with the left-aligned Prose.
- **Tables**: every markdown table is auto-wrapped by `mdx-components.tsx` in `overflow-x-auto`; dense tables scroll horizontally on narrow viewports rather than compressing every cell.
- **Cards**: `PillarCards` / `ProConCards` / `HomeSections` all stack at mobile and step through breakpoints (see component source for the exact pattern).

## Adding Documentation

1. Create `src/app/docs/<section>/<slug>/page.mdx`
2. Add the entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GFM (tables, strikethrough, task lists) and auto-generate heading IDs via rehype-slug.

## Design Context

Full context lives in `.impeccable.md` at repo root. Load it before any design, UI, or frontend work.

### Users
Engineers using the site in two overlapping modes: **learning** (going through training sessions linearly) and **reference** (jumping in mid-task to look up a pattern or setting). Design must serve both: structured enough to read end-to-end, scannable enough to land cold on any page.

### Brand Personality
Three words: **confident, crafted, program**. Voice is direct, technical, mildly opinionated — written by engineers for engineers. Not marketing copy, not corporate, not whimsical.

### Aesthetic Direction
**Bold training brand built on docs-grade structure.** Identity-forward like a course microsite (Josh Comeau, Epic Web), organized like Stripe / Tailwind / Linear docs. Violet (`violet-500` #6240e8) is the primary brand signal and should stay dominant. Light and dark modes are **both first-class** — neither is the reference.

**Explicitly avoid**: generic AI-startup aesthetic (purple-gradient-on-white heros, glassmorphism, dark-mode-first with glowing accents), corporate-enterprise blandness, whimsy without purpose.

### Design Principles
1. **Docs-grade bones, program-grade skin.** Scannability and nav predictability come first; identity shows through typography and purposeful violet on top of that skeleton.
2. **Earn every decoration.** Borders, shadows, gradients, motion must serve comprehension, hierarchy, or brand — never filler.
3. **Violet with restraint.** Reserve violet for real primary moments (active nav, primary CTA, key callouts). Semantic brand accents (blue/green/pink/purple) only inside visualization components.
4. **Both themes, equal care.** Review every surface in both light and dark; neither is an afterthought.
5. **Write like an engineer talking to an engineer.** Specific nouns over vague adjectives, no exclamation marks, humor only when precise.
