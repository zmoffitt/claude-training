# AGENTS.md

This file provides guidance to Codex and other coding agents when working with code in this repository. `CLAUDE.md` is the same guidance for Claude Code; change both together.

## What This Is

Documentation site for Zachary Moffitt's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools. Claude is the primary training program; Codex/ChatGPT is a secondary training track.

## Prerequisites

Node.js >= 20.9 (the Next.js 16 minimum; CI builds on Node 22), pnpm >= 10 (install via `corepack enable` or `npm install -g pnpm`; `packageManager` pins `pnpm@10.33.0`).

## Commands

```bash
pnpm dev        # Dev server at http://localhost:3000/claude-training/ (`/` is a 404 because of basePath)
pnpm build      # Static export to out/, then Pagefind indexes it into out/pagefind/
pnpm start      # Serve out/ at http://localhost:3000/claude-training/ (`scripts/preview.mjs`, not `next start`)
pnpm clean      # Remove .next, out, .wrangler, and tsconfig.tsbuildinfo
```

There are no lint or test commands configured. `pnpm build` is the only check; `python3 -I scripts/color-audit.py` prints the contrast ratio of every text token on every tint.

**`pnpm start`** — `scripts/preview.mjs` is a dependency-free static server that mounts `out/` under the `basePath` read from `next.config.mjs`, the way GitHub Pages serves it. It needs a prior `pnpm build`, serves `out/404.html` for misses, and takes `PORT` to change the port. A generic static server at the root (`serve out`) does not work: every asset URL in the export carries the base path.

## Tech Stack

Next.js 16 (static export via `output: 'export'`, Turbopack), React 19, TypeScript, Tailwind CSS v4 with `@tailwindcss/typography`, Headless UI, Framer Motion, MDX (`remark-gfm` + `rehype-slug`), next-themes, Zustand, Pagefind (search index, built after the export), pnpm.

## Architecture

**Static export only** — `next.config.mjs` sets `output: 'export'`, `trailingSlash: true` (so GitHub Pages resolves both `/path` and `/path/`), and `images: { unoptimized: true }`. No server-side features (no API routes, no SSR, no ISR). The build outputs to `out/`.

**Deployed via GitHub Pages** — A GitHub Actions workflow (`deploy-pages.yml`) builds the site and uploads `out/` as a Pages artifact on push to `main`. The current `next.config.mjs` sets `basePath` and `assetPrefix` to `/claude-training` (the configured Pages URL is `https://zmoffitt.github.io/claude-training/`), and `NEXT_PUBLIC_BASE_PATH` is exposed for runtime asset paths (e.g. the Pagefind loader in `SearchDialog.tsx`). A `.nojekyll` file in `public/` prevents Jekyll from stripping `_next/` directories.

**Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`). TypeScript strict mode is **off**.

### MDX Pipeline

Content flows through: `next.config.mjs` (configures remark-gfm + rehype-slug) → `mdx-components.tsx` (root-level, maps fenced code blocks to `CodeBlock`, wraps every markdown table in a focusable `.table-scroll` region for narrow-viewport scroll) → `CodeBlock.tsx` (theme-aware syntax highlighting via react-syntax-highlighter with oneLight/oneDark themes).

Internal root-relative Markdown links are rendered with Next.js `Link`, which applies the configured base path. Write `/docs/...` links without hard-coding the deployment prefix; external and fragment links remain ordinary anchors.

All documentation pages are `.mdx` files at `src/app/docs/**/page.mdx`, using Next.js App Router file-based routing.

### Training Tracks

Keep Claude first in the homepage, Start Here, and training navigation. Use the filled primary CTA and homepage roadmap for Claude; keep Codex/ChatGPT discoverable as a secondary option.

- **Claude**: `src/app/docs/training/claude-code/`; five-session roadmap with the first three sessions developed (sessions 4 and 5 show as upcoming on the roadmap and have no pages).
- **Codex & ChatGPT**: `src/app/docs/training/codex-chatgpt/`; three complete sessions covering foundations, repository workflows, and extensions. 26 pages including demos and practice assignments.
- **Standalone pages**: `training/github-copilot` and `training/prompt-engineering` sit beside the two tracks in the Training Materials group, not inside either.
- Use `<TrainingRoadmap track="codex" activeStep={N} />` for Codex sessions. The default track is `claude`; use `activeStep={0}` for an overview without a current-step marker.
- Keep the homepage, Start Here, sidebar, and session outlines aligned when changing the curriculum. Preserve existing routes when retitling lessons.
- Product-specific guidance must link to official sources. Date model/pricing snapshots, distinguish API token pricing from ChatGPT subscription usage, and distinguish API context capacity from client defaults.
- The Codex model lesson is at `session-1/models-and-planning/page.mdx` and reuses `ModelTierCards` from the Claude track.

### MDX Page Conventions

Every page exports a `metadata` object for the document title:

```tsx
export const metadata = { title: "Page Title" };
```

**Page rhythm** — content pages follow `H1 → <ReadTime /> (3+ min pages only) → one-line tagline → body → "## Where to go next"`. Components get their vertical rhythm from the `.prose` rules in `tailwind.css`; never add `<br />` spacers. Landing pages follow `<PageHero eyebrow title subtitle /> → SessionOutline → <TrainingRoadmap />` (no ReadTime, no hero gradient).

**One Callout per page max** — reserve `<Callout>` for one moment of real punctuation per page. Use bold lead-in inline emphasis (`**Key idea.** Sentence...`) for secondary points instead of stacking Callout boxes.

**Page archetypes** — content pages cast into one of three rhythms so the visual sequence varies:
- *Table-led*: focal markdown table wrapped in `<div className="max-w-2xl lg:max-w-3xl">` to match Callout width.
- *Comparison-led*: `PillarCards` or `ProConCards` as the focal element.
- *Narrative-led*: example, code block, or numbered walkthrough as the focal element.

Fenced code blocks are automatically routed to `CodeBlock` — no import needed. Custom components must be explicitly imported. Key reusable components:

- **`Callout`** — Alert box with `variant` (`error` | `warning` | `info` | `success`), `title`, and `align` props
- **`ReadTime`** — `<ReadTime minutes={N} />` chip placed directly under the H1 on content pages of three minutes or more (shorter pages, landing pages, practice assignments, and live demos omit it)
- **`PageHero`** / **`TrainingRoadmap`** / **`SessionOutline`** — Used on the home page and session landing pages (eyebrow + display headline; no gradient hero)
- **`PillarCards`** / **`ProConCards`** — Card-grid visualizations; both stack on mobile and restore N columns at `sm:` (4-card layouts step through 2×2 at `sm:` before going 4-across at `lg:`)
- Other visualization components (`ModelTierCards`, `ComparisonCards`, `PermissionModel`, `HooksLifecycle`, etc.) are typically one-per-page
- **`Term`** — glossary chip: `<Term id="opusplan">…</Term>` on the first use of a program term before its defining page; links to `/docs/glossary#id` (data in `src/lib/glossary.ts`, page body from `Glossary`)
- **`SessionComplete`** — `<SessionComplete session={N}>handoff line</SessionComplete>` directly above "Where to go next" on each Practice Assignment; the check draws itself in the session hue
- **`Lead`** — run-in label on the risk scale (`<Lead tone="red">The problem:</Lead>`) for problem/fix style pages

### Search & 404

**Search** — `SearchDialog.tsx` opens via `⌘K` / `Ctrl+K` / `/`. Backed by [Pagefind](https://pagefind.app) (built into the static export at `out/pagefind/`, indexing only `index.html` and `docs/**` so the 404 page stays out of results); falls back to navigation-title scoring if the runtime can't load the Pagefind index. The index only exists after `pnpm build`, so `pnpm dev` always runs on the fallback; use `pnpm start` to exercise real Pagefind results. Empty state shows suggested queries; no-results offers a "broader term, or browse the sidebar" prompt.

**404** — `src/app/not-found.tsx` shows `NotFoundSuggestions` (up to three "did you mean" links scored against `allPages`; renders nothing when no page comes close), lists the three developed Claude sessions with descriptions, surfaces the `⌘K` shortcut inline, and provides "Go home" / "Browse docs" CTAs. Use this pattern (recovery + starting points + search hint) when adding other error pages. `src/app/error.tsx` is the runtime error boundary ("Try again" / "Go home").

### Layout & Navigation

`Layout.tsx` renders the page shell: fixed sidebar (desktop, `lg:` breakpoint) with `Navigation` + a sticky `Header` + `Footer`. All pages share this layout via `layout.tsx`.

**Navigation is data-driven** — the `navigation` array exported from `Navigation.tsx` defines all sidebar links. It supports arbitrarily nested collapsible groups (see `NavLinkItem.children`). To add a new page, create the `.mdx` file **and** add its entry to this array.

**Mobile navigation** uses a Zustand store (`useMobileNavigationStore` in `MobileNavigation.tsx`) for open/close state, rendered as a Headless UI `Dialog`. Both desktop sidebar and mobile drawer render the same `<Navigation>` component.

### Page Transitions

`src/lib/pageTransition.ts` wraps page changes in the View Transitions API. `PageTransitions` (mounted in `Layout`) intercepts in-site link clicks in the capture phase and `KeyboardNav` calls the same `navigateWithTransition`; both fall back to `router.push` without the API, under reduced motion, or while a transition is running. Named groups: `sidebar` (holds still), `nav-marker` / `nav-highlight` (glide; the framer `layout` animation stands down via `useTransitionActive` so the snapshot shows the settled row), `breadcrumbs` (crossfade), `article` (fade-through with a slide in the direction of travel, from the page order in `allPages`). Rules live under "Page transitions" in `tailwind.css`. Mark a link `data-transition="none"` to keep its own click handling.

### Theming

next-themes with `attribute="class"` (dark mode via `.dark` class on `<html>`). A blocking script in `src/app/layout.tsx` sets the theme class before first paint to prevent FOLM (flash of light mode) per component. `src/app/providers.tsx` wraps the app with `ThemeProvider`, `ThemeWatcher` (syncs with system preference), and `ConsoleGreeting` (one-time dev-console branded greeting).

- **CSS theming**: Custom violet palette and design tokens defined in `src/styles/tailwind.css` under `:root` and `.dark`
- **Typography**: Extensive prose styling in root-level `typography.ts`, imported by Tailwind via `@config` directive
- **Theme-aware inline styles**: Use `themeVars` and `brandVars` from `lib/theme-colors.ts` (CSS variable references like `var(--theme-card-bg)`), or use the native CSS `light-dark()` function directly for one-off color pairs. Both resolve correctly on the first paint because `.dark` is set before the body renders.
- **Reduced motion**: `MotionConfig reducedMotion="user"` is set globally — every Framer Motion animation respects `prefers-reduced-motion: reduce` automatically.

### Component Pattern

All interactive/themed components are `'use client'` and use `themeVars` / `brandVars` (CSS-var-backed) or `light-dark()` for dual-theme styling. **Do not** use `useThemeMode()` to index a `themeColors[mode]` object — that pattern causes a per-component flash during hydration and the hook has been removed. New visualization components should follow the CSS-var pattern.

### Responsive

- **Sidebar**: `Layout.tsx` collapses below `lg:` (1024px); the same `<Navigation>` renders inside a Headless UI `Dialog` for mobile.
- **TableOfContents**: visible from 1366px (narrow rail, `w-44 right-3`), expands at `min-[1440px]:` to `w-56 right-6`. Hidden below 1366 to avoid overlap with the left-aligned Prose.
- **Tables**: every markdown table is auto-wrapped by `mdx-components.tsx` in a focusable `.table-scroll` region; dense tables scroll horizontally on narrow viewports rather than compressing every cell.
- **Cards**: `PillarCards` / `ProConCards` / `HomeSections` all stack at mobile and step through breakpoints (see component source for the exact pattern).

## Adding Documentation

1. Create `src/app/docs/<section>/<slug>/page.mdx`
2. Add the entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GFM (tables, strikethrough, task lists) and auto-generate heading IDs via rehype-slug.

## Design Context

Full context lives in `.impeccable.md` at repo root (this section plus the color rules and typefaces, in the format the design skills read). `CLAUDE.md` carries the same section; change all three together. Load it before any design, UI, or frontend work.

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
