# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. `AGENTS.md` is the same guidance for Codex and other coding agents; change both together.

## What This Is

Documentation site for Zachary Moffitt's Cloud AI Training program — training materials, best practices, and configuration guides for AI coding tools. Claude is the primary training program; Codex/ChatGPT is a secondary training track.

## Prerequisites

Node.js >= 20.9 (the Next.js 16 minimum; CI builds on Node 22), pnpm >= 10 (install via `corepack enable`, which ships with Node below 25, or `npm install -g pnpm`; `packageManager` pins `pnpm@10.33.0`).

## Commands

```bash
pnpm dev        # Dev server at http://localhost:3000/claude-training/ (`/` is a 404 because of basePath)
pnpm build      # Static export to out/, then Pagefind indexes it into out/pagefind/
pnpm start      # Serve out/ at http://localhost:3000/claude-training/ (`scripts/preview.mjs`, not `next start`)
pnpm clean      # Remove .next, out, .wrangler, and tsconfig.tsbuildinfo
```

There are no lint or test commands configured. `pnpm build` is the only check. `python3 -I scripts/color-audit.py` reports contrast for a fixed list of text tokens (session hues, brand text, body and muted text, info and warning callout text) on the page, card, and five tint surfaces in both themes. It flags a pair under 4.5:1 with `~` and under 3:1 with `!` and always exits 0; a token or tint added later is not covered until it is added to the script.

**`pnpm start`** — `scripts/preview.mjs` is a small static server with no dependencies of its own that mounts `out/` under the `basePath` it imports from `next.config.mjs`, the way GitHub Pages serves it. It needs a prior `pnpm build`, serves `out/404.html` for misses, and takes `PORT` to change the port. A generic static server at the root (`serve out`) does not work: every asset URL in the export carries the base path.

## Tech Stack

Next.js 16 (static export via `output: 'export'`, Turbopack), React 19, TypeScript, Tailwind CSS v4 with `@tailwindcss/typography`, Headless UI, Framer Motion, MDX (`remark-gfm` + `rehype-slug`), next-themes, Zustand, Pagefind (search index, built after the export), pnpm.

## Architecture

**Static export only** — `next.config.mjs` sets `output: 'export'`, `trailingSlash: true` (so GitHub Pages resolves both `/path` and `/path/`), and `images: { unoptimized: true }`. No server-side features (no API routes, no SSR, no ISR). The build outputs to `out/`.

**Deployed via GitHub Pages** — A GitHub Actions workflow (`deploy-pages.yml`) builds the site and uploads `out/` as a Pages artifact on push to `main`. The site is served at `https://zmoffitt.github.io/claude-training/`, so `next.config.mjs` sets `basePath` and `assetPrefix` to `/claude-training`, and `NEXT_PUBLIC_BASE_PATH` is exposed for runtime asset paths (e.g. the Pagefind loader in `SearchDialog.tsx`). A `.nojekyll` file in `public/` prevents Jekyll from stripping `_next/` directories.

**Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`). TypeScript strict mode is **off**.

### MDX Pipeline

Content flows through: `next.config.mjs` (configures remark-gfm, the local `scripts/remark-page-outline.mjs` and `scripts/remark-card-heading-level.mjs`, and rehype-slug) → `mdx-components.tsx` (root-level, routes every fenced code block to `CodeBlock` from its `<pre>`, tagged or not, wraps every markdown table in a focusable `.table-scroll` region for narrow-viewport scroll, keeps inline code of 16 characters or fewer on one line) → `CodeBlock.tsx` (theme-aware syntax highlighting via react-syntax-highlighter with `codeTheme` from `lib/codeTheme.ts`, one Prism theme whose colors are the `--code-*` tokens, so a block is rendered once and follows the active theme).

Internal root-relative Markdown links are rendered with Next.js `Link`, which applies the configured base path. Write `/docs/...` links without hard-coding the deployment prefix; fragment links remain ordinary anchors. An external link opens in a new tab and ends in `NewTabMark`: a small ↗ for sighted readers and "(opens in a new tab)" for screen readers. `PillarCards` does the same for a card with an external `href`. Links in running text are underlined at rest, at half strength, and in full on hover (`a` in `typography.ts`), because the link color alone is under 3:1 from body text; glossary terms keep their dotted underline.

All documentation pages are `.mdx` files at `src/app/docs/**/page.mdx`, using Next.js App Router file-based routing.

### Training Tracks

Keep Claude first in the homepage, Start Here, and training navigation. Use the filled primary CTA and homepage roadmap for Claude; keep Codex/ChatGPT discoverable as a secondary option.

- **Claude**: `src/app/docs/training/claude-code/`; four complete sessions covering foundations, CLI workflows and project context, extending Claude, and agents. 60 pages including demos and practice assignments.
- **Codex & ChatGPT**: `src/app/docs/training/codex-chatgpt/`; three complete sessions covering foundations, repository workflows, and extensions. 26 pages including demos and practice assignments.
- **Standalone pages**: `training/github-copilot` and `training/prompt-engineering` sit beside the two tracks in the Training Materials group, not inside either.
- Use `<TrainingRoadmap track="codex" activeStep={N} />` for Codex sessions. The default track is `claude`; use `activeStep={0}` for an overview without a current-step marker. The marked step's chip reads "You are here"; pass `activeLabel` where that would not be true (the home page uses "Start here" and "Continue"). Each step's second line is the session's topics (`covers` in `lib/sessions.ts`), or its `outcome` where a track sets one, as the Codex track does.
- Session names live in `src/lib/sessions.ts`. The sidebar, the roadmap, and the 404 page read them from there; Start Here is MDX and repeats them by hand, so change it with that file. Keep the homepage, Start Here, sidebar, and session outlines aligned when changing the curriculum. Preserve existing routes when retitling lessons.
- A page's H1 may extend its sidebar label ("Decision Guide: Skill, Scheduled Task, MCP, or Plugin?") but not replace it. Search results show the H1 and the sidebar shows the label, and a reader has to recognize one from the other. Cross-links use the sidebar label.
- Product-specific guidance must link to official sources. Date model/pricing snapshots, distinguish API token pricing from ChatGPT subscription usage, and distinguish API context capacity from client defaults.
- The Codex model lesson is at `session-1/models-and-planning/page.mdx` and reuses `ModelTierCards` from the Claude track.

### MDX Page Conventions

Every page exports a `metadata` object for the document title:

```tsx
export const metadata = { title: "Page Title" };
```

**Page rhythm** — content pages follow `H1 → <ReadTime /> (3+ min pages only) → one-line tagline → body → "## Where to go next"`. Components get their vertical rhythm from the `.prose` rules in `tailwind.css`; never add `<br />` spacers. Session landing pages follow `<PageHero numeral eyebrow title subtitle /> → <SessionActions session={N} /> → SessionOutline → <TrainingRoadmap />` (`track="codex"` on the Codex track; no ReadTime, no hero gradient), and the subtitle says what a learner can do after the session rather than repeating the title. The two track landing pages are `PageHero → TrainingRoadmap` with setup notes below the roadmap, and neither has a `SessionOutline`: the roadmap already lists every session with its topics (Claude) or its outcome (Codex), so an outline would repeat it. The home page is `PageHero → HomeActions → HomeRoadmap → HomeSections`.

**Lists** — a list item that names a thing and then describes it joins the two with a colon: `**Term:** description`, `**[Page](/docs/...):** description`, `` `command`: description ``. That covers every "Where to go next" list. Keep the em dash for a break inside a sentence.

**One Callout per page max** — reserve `<Callout>` for one moment of real punctuation per page. Use bold lead-in inline emphasis (`**Key idea.** Sentence...`) for secondary points instead of stacking Callout boxes.

**Page archetypes** — content pages cast into one of three rhythms so the visual sequence varies:
- *Table-led*: focal markdown table. It takes the figure width on its own; do not wrap it in a width `div`.
- *Comparison-led*: `PillarCards` or `ProConCards` as the focal element.
- *Narrative-led*: example, code block, or numbered walkthrough as the focal element.

Fenced code blocks are routed to `CodeBlock` — no import needed. Tag every fence: `text` for plain text, `prompt` for a prompt meant to be pasted into Claude; an untagged fence still renders as a code block, labeled plain text. Custom components must be explicitly imported. Key reusable components:

- **`Callout`** — Alert box with `variant` (`error` | `warning` | `info` | `success`), `title`, and `align` props. The variant shows as a tint, an icon, and the title color, inside a hairline of the same hue on all four sides; there is no accent bar. A takeaway box inside a visualization component takes the same surface from `noteSurface()` in `lib/theme-colors.ts`
- **`ReadTime`** — `<ReadTime minutes={N} />` chip placed directly under the H1 on content pages of three minutes or more (shorter pages, landing pages, practice assignments, and live demos omit it)
- **`PageHero`** / **`TrainingRoadmap`** / **`SessionOutline`** — Landing-page primitives, used together on session and track landing pages (eyebrow + fluid display headline; no gradient hero). `numeral={N}` on a session landing page opens it with the session number in the session hue, a hairline, and the eyebrow at the far end; the home page uses `PageHero` and the roadmap without `SessionOutline`
- **`SessionActions`** — the one primary action under a session hero: "Start Session N" to the session's first page, "Continue: <page>" to the first page the learner has not opened, or "Review Session N" once every page is open. It reads `useSessionProgress` after hydration, so the export prerenders "Start"
- **`RowArrow`** — the arrow that ends a link row (`HomeSections`, `SessionOutline`, the 404 page's sessions): gray at rest, so the row reads as a link before any hover and on a touch screen, and the interaction color, a step forward, on hover and keyboard focus. A new list of link rows uses it, with `group` on each row's link
- **`HomeActions`** / **`HomeRoadmap`** (`HomeProgress.tsx`) — the home page's CTA row and roadmap. `Layout` records the last session page opened in each track (`lib/progress.ts`, `localStorage` key `training-progress`); a returning learner gets "Continue Session N" pointing at that page, and a first visit gets "Start Claude training". The stored place is read after hydration, so the export always prerenders the first-visit state
- **Card titles and the heading outline** — a card title is an `<h3>`. `scripts/remark-card-heading-level.mjs` passes each card set a `headingLevel` (one more than the nearest heading above it), and the component puts `titleLevel(headingLevel)` from `lib/headingLevel.ts` on the title as `aria-level`, so a card set directly under the page title is announced at level 2 and the outline has no gap. A new card component with heading titles takes the same prop and is added to `CARD_SETS` in that script.
- **`PillarCards`** / **`ProConCards`** — Card-grid visualizations; both stack on mobile and switch to two or three columns at `sm:` (four cards make a 2×2 at every width from `sm:` up)
- Other visualization components (`ModelTierCards`, `ComparisonCards`, `PermissionModel`, `HooksLifecycle`, etc.) are typically one-per-page
- **Tags** — a short label on a card (a permission tier's approval rule, a hook event, a duration) is a tag: `tagStyle()` / `tagColors()` in `lib/theme-colors.ts`, the hue's tint, its hairline, and its text color. A tag never takes a solid fill, which reads as a button; the one solid fill in a figure is its outcome, such as the DENIED bar in `HooksLifecycle`
- **`Term`** — glossary chip: `<Term id="opusplan">…</Term>` on the first use of a program term before its defining page; links to `/docs/glossary#id` (data in `src/lib/glossary.ts`, page body from `Glossary`)
- **`SessionComplete`** — `<SessionComplete session={N}>handoff line</SessionComplete>` directly above "Where to go next" on each Practice Assignment: a card with the check (it draws itself in the session hue), the handoff line, the learner's progress through the session after hydration ("12 of 15 pages opened" and the first page not opened yet), and a button to the next session, which a track's last session does not have
- **`Lead`** — run-in label on the risk scale (`<Lead tone="red">The problem:</Lead>`) for problem/fix style pages

### Search & 404

**Search** — `SearchDialog.tsx` opens via `⌘K` / `Ctrl+K` / `/`. Backed by [Pagefind](https://pagefind.app) (built into the static export at `out/pagefind/`, indexing only `index.html` and `docs/**` so the 404 page stays out of results); falls back to navigation-title scoring if the runtime can't load the Pagefind index. The index only exists after `pnpm build`, so `pnpm dev` always runs on the fallback; use `pnpm start` to exercise real Pagefind results. Empty state shows suggested queries; no-results says "Try a broader term, or one of these." above the same suggested queries.

**404** — `src/app/not-found.tsx` shows `NotFoundSuggestions` (recovery links chosen from the failed path, rendered after hydration because the export serves one `404.html` for every missing path: the pages inside it when the path is a section with no page of its own, such as `/docs/tips`; otherwise up to three "did you mean" links, which tolerate a plural or one typo; otherwise the nearest page above it; nothing when the path gives no lead), lists the developed Claude sessions from `lib/sessions.ts`, surfaces the `⌘K` shortcut inline, and provides "Go home" / "Browse docs" CTAs. Use this pattern (recovery + starting points + search hint) when adding other error pages. `src/app/error.tsx` is the error boundary for page content ("Try again" / "Go home"); it does not cover the shell in the root layout, and there is no `global-error.tsx`.

### Layout & Navigation

`Layout.tsx` renders the page shell: fixed sidebar (desktop, `lg:` breakpoint) with `Navigation` + a fixed `Header` + `Footer`. The desktop sidebar can be resized (240–480px, `SidebarResizeHandle`) and collapsed from the header; `useSidebarStore` keeps both in `localStorage`. Before hydration the sidebar takes its width from the `lg:w-80` / `lg:ml-80` classes; they must equal `DEFAULT_WIDTH` in `useSidebarStore`, or the sidebar changes width on every load. All pages share this layout via `layout.tsx`.

**Wordmark** — `Logo.tsx` sets the program name from `siteName` (`src/lib/site.ts`) in the display face and links home. It sits at the top of the desktop sidebar, pinned while the navigation scrolls, and moves into the `Header` below `lg:` and when the sidebar is collapsed. `siteName` also feeds the document title template and the console greeting; change the name there, not in each place.

**Favicon** — `public/icon.svg` is the favicon served at claude.dev, copied unchanged. `public/favicon.ico` is the same image drawn at 16, 32, and 48 pixels, for clients that do not take an SVG icon. It is a separate file, so replace both together. Both are declared in `metadata.icons` in `src/app/layout.tsx`, with the base path, so every page links both. Do not move them to Next's icon file names (`app/favicon.ico`, `app/icon.svg`): with both in the app root, Next 16.4 leaves the `.ico` link off the home page. There is no Apple touch icon.

**Navigation is data-driven** — the `navigation` array exported from `Navigation.tsx` defines all sidebar links. It supports arbitrarily nested collapsible groups (see `NavLinkItem.children`). To add a new page, create the `.mdx` file **and** add its entry to this array.

**Visited pages** — `Layout` also records every session page a learner opens (`visited` in the same `training-progress` entry), and the sidebar shows a small check on a row once its page and every page under it has been opened, so a collapsed session is checked only when all of it has been. The current page carries the marker and no check. `useVisitedPages()` in `lib/progress.ts` is empty on the server and during hydration, so the export prerenders the first-visit sidebar. A group is open on its own page as well as on the pages inside it, which opens Training Materials on the home page. `useSessionProgress(track, session)` in `lib/useSessionProgress.ts` turns the same store into one session's pages, the ones not opened yet, and the next session; `SessionActions` and `SessionComplete` read it.

**Active marker** — each open group positions its marker and highlight from the active link's layout offsets (`offsetTop` summed up to the group's wrapper), not from bounding rects. A rect includes the transform a row carries while a layout animation runs, so it reports a position the row is leaving.

**Pager** — `Footer.tsx` shows `Session N: Name · Page X of Y` on every page of a session. The landing page is page 1 and nested pages count in the order the Next button walks them. Pages outside a session show Previous / Next without a count.

**Mobile navigation** uses a Zustand store (`useMobileNavigationStore` in `MobileNavigation.tsx`) for open/close state, rendered as a Headless UI `Dialog`. Both desktop sidebar and mobile drawer render the same `<Navigation>` component.

### Page Transitions

`src/lib/pageTransition.ts` wraps page changes in the View Transitions API. `PageTransitions` (mounted in `Layout`) intercepts in-site link clicks in the capture phase and `KeyboardNav` (the ←/→ previous/next-page shortcut) calls the same `navigateWithTransition`; both fall back to `router.push` without the API, under reduced motion, or while a transition is running. `KeyboardNav` stands down when the event is already `defaultPrevented`, when the focus is on or inside a sideways scroll container that is a tab stop (the `.table-scroll` region, so a link inside a table keeps the keys for the table), or when it is on a container that overflows sideways (a code block with a long line). It also ignores modified keys, form fields, editable text, and dialogs. A component that uses the arrow keys calls `preventDefault` on them, and `KeyboardNav` then needs no change. Named groups: `sidebar` (holds still), `nav-marker` / `nav-highlight` (glide; the framer `layout` animation stands down via `useTransitionActive` so the snapshot shows the settled row), `breadcrumbs` (crossfade), `article` (fade-through with a slide in the direction of travel, from the page order in `allPages`). Rules live under "Page transitions" in `tailwind.css`. Mark a link `data-transition="none"` to keep its own click handling.

### Theming

next-themes with `attribute="class"` (dark mode via `.dark` class on `<html>`). A blocking script in `src/app/layout.tsx` sets the theme class before first paint to prevent FOLM (flash of light mode) per component. `src/app/providers.tsx` wraps the app with `ThemeProvider`, `ThemeWatcher` (syncs with system preference), and `ConsoleGreeting` (one-time dev-console branded greeting). `ThemeToggle` switches through `switchThemeWithTransition` (`lib/themeTransition.ts`): a view transition that crossfades the whole page between themes over 320ms, marked by `data-theme-switch` on `<html>` (rules under "Theme switch" in `tailwind.css`). It changes at once without the View Transitions API or under reduced motion; a system theme change is not animated.

- **CSS theming**: both themes are Ghostty terminal themes, declared in `src/styles/tailwind.css`: Tomorrow for light under `:root`, Vercel for dark under `.dark`. Each block declares its raw palette once as `--term-*`, maps every semantic token to it, and re-points the `zinc` and `violet` Tailwind scales at it, so shell utilities such as `text-zinc-600 dark:text-zinc-400` pick up the palette without naming it (the `violet` values in `@theme` are the original brand violet and show only if a theme block stops overriding them). Add a color by mapping a token to a `--term-*` entry, not by writing a new hex. To move a theme to another terminal theme, change its `--term-*` values and, when the hues differ, the role mapping under them, then re-run the color audit. Neither theme has all six accent hues the site names: Tomorrow has no pink, so its cyan plays the pink role; Vercel has no purple, so its blue plays the purple role, cyan the blue role, and magenta the pink role. A hex passed in page props (`color: "#6240E8"`) only names a role; `lib/theme-colors.ts` resolves it to the active theme's token
- **Typography**: Extensive prose styling in root-level `typography.ts`, imported by Tailwind via `@config` directive. The prose scale steps up by about a quarter each time: body 1rem, H3 1.25rem (Inter), H2 1.625rem and H1 2.5rem (display face). All three headings are fluid and come to 1.125rem, 1.375rem, and 1.875rem on a phone. Inline code is 0.85em of the text around it. Card titles are `<h3>` elements that set their own size
- **Theme-aware inline styles**: Use `themeVars` and `brandVars` from `lib/theme-colors.ts` (CSS variable references like `var(--theme-card-bg)`), or use the native CSS `light-dark()` function directly for one-off color pairs. Both resolve correctly on the first paint because the blocking script sets `.dark` and `color-scheme` before the body renders.
- **Reduced motion**: `MotionConfig reducedMotion="user"` is set globally. Under `prefers-reduced-motion: reduce` it makes Framer Motion's transform, size, position, and layout animations instant; opacity, color, and SVG path animations still run, so gate those with `useReducedMotion()` as `SessionComplete` does.

### Component Pattern

Add `'use client'` only when a component needs state, effects, event handlers, the router, a store, or Framer Motion; theming alone does not need it, and most visualization components are server components. Visualization components style both themes with `themeVars` / `brandVars` (CSS-var-backed) or `light-dark()` in inline styles; shell components (navigation, header, search, buttons) use Tailwind `dark:` utilities. **Do not** use `useThemeMode()` to index a `themeColors[mode]` object — that pattern causes a per-component flash during hydration and the hook has been removed. New visualization components should follow the CSS-var pattern.

### Responsive

- **Sidebar**: `Layout.tsx` collapses below `lg:` (1024px); the same `<Navigation>` renders inside a Headless UI `Dialog` for mobile. Below `lg:` its rows and carets are 44px touch targets (`max-lg:` classes in `Navigation.tsx`), as are the pager buttons; the desktop sidebar keeps the dense rows.
- **Breadcrumbs**: below `sm:` the trail is one line, the parent page as a back link (`‹ Parent`); from `sm:` it is the full trail.
- **TableOfContents**: right rail visible from 1366px (narrow, `w-44 right-3`), expanding at `min-[1440px]:` to `w-56 right-6`. Below 1366 the rail is hidden to avoid overlapping the left-aligned Prose, and `InlineTableOfContents` shows a collapsed "On this page" disclosure instead. `scripts/remark-page-outline.mjs` adds it to each MDX page at build time, below the H1 and tagline (below `PageHero` on a landing page), with the page's H2 counts as props so the summary row is in the static HTML. Both render only on pages with at least two H2 sections besides "Where to go next". From 1440px a page with the rail stops its column at the figure width, so nothing runs under the rail. The rule keys on the inline outline (`.page-outline`), which is in the static HTML, and not on the rail, which renders after hydration: keyed on the rail, the column narrowed after the first paint, a roadmap re-stacked, and a link to an `#anchor` landed short of its heading.
- **Tables**: every markdown table is auto-wrapped by `mdx-components.tsx` in a focusable `.table-scroll` region; dense tables scroll horizontally on narrow viewports rather than compressing every cell.
- **Diagrams**: an SVG drawing scales with its box, labels included, so draw every label at 11 units or more at the width the drawing renders. A drawing that cannot shrink further takes a `min-width` inside a focusable `.figure-scroll` region (the same scroll region tables use) and scrolls sideways on a narrow screen. A diagram's two-column layout is keyed to its own width (`@container` on the wrapper, `@3xl:grid-cols-2` on the grid), not the viewport, because beside the sidebar a viewport breakpoint leaves the columns too narrow.
- **Reading measure**: paragraphs, lists, and blockquotes directly inside `.prose` stop at `--measure` (38rem, about 75 characters of body text); the rule is under "Reading measure" in `tailwind.css`.
- **Figure width**: from `lg:`, every other direct child of `.prose` (a table, a code block, a card set, a diagram, a `Callout`) stops at `--container-3xl` (50rem), so a lesson page has two right edges: text and figures. Landing-page pieces marked `.not-prose` (hero, roadmap, session outline, home list) keep the full column. Wrap a figure in `<div className="wide">` to let it run the full column. The rule is under "Figure width" in `tailwind.css`; it sits in the utilities layer below single-class specificity, so a component can still set a narrower `max-w-*`.
- **Cards**: `PillarCards` / `ProConCards` stack at mobile and switch to their column grid at `sm:` (two or three columns; four cards make a 2×2). `HomeSections` is a divided list whose rows become a three-column grid at `sm:`.

## Adding Documentation

1. Create `src/app/docs/<section>/<slug>/page.mdx`
2. Add the entry to the `navigation` array in `src/components/Navigation.tsx`

MDX pages support GFM (tables, strikethrough, task lists) and auto-generate heading IDs via rehype-slug.

## Design Context

Full context lives in `.impeccable.md` at repo root, in the format the design skills read. It is the fuller statement: beyond this section it covers the product, typefaces, card surface, color rules, and page rhythm. `AGENTS.md` carries the same section; change all three together. Load it before any design, UI, or frontend work.

### Users
Engineers using the site in two overlapping modes: **learning** (going through training sessions linearly) and **reference** (jumping in mid-task to look up a pattern or setting). Design must serve both: structured enough to read end-to-end, scannable enough to land cold on any page.

### Brand Personality
Three words: **confident, crafted, program**. Voice is direct, technical, mildly opinionated — written by engineers for engineers. Not marketing copy, not corporate, not whimsical.

### Aesthetic Direction
**Bold training brand built on docs-grade structure.** Identity-forward like a course microsite (Josh Comeau, Epic Web), organized like Stripe / Tailwind / Linear docs. Both modes are Ghostty terminal themes and **both are first-class** — neither is the reference. Light is Tomorrow: white page, charcoal text (#4d4d4c), black headings. Dark is Vercel: near-black page (#101010), white text. One interaction color per theme carries the role the `violet` scale names and should stay the dominant signal: Tomorrow's purple (#8959a8) in light, Vercel's bright blue (#49aeff) in dark. The remaining ANSI hues are the accents.

**Explicitly avoid**: generic AI-startup aesthetic (purple-gradient-on-white heros, glassmorphism, dark-mode-first with glowing accents), corporate-enterprise blandness, whimsy without purpose.

### Design Principles
1. **Docs-grade bones, program-grade skin.** Scannability and nav predictability come first; identity shows through typography and purposeful violet on top of that skeleton.
2. **Earn every decoration.** Borders, shadows, gradients, motion must serve comprehension, hierarchy, or brand — never filler.
3. **Violet with restraint.** Reserve violet for real primary moments (active nav, primary CTA, key callouts). Session hues (`--session-1..4`) mark wayfinding inside a session, on text, icons, and markers only; other semantic colors stay inside the visualization component that defines them.
4. **Both themes, equal care.** Review every surface in both light and dark; neither is an afterthought.
5. **Write like an engineer talking to an engineer.** Specific nouns over vague adjectives, no exclamation marks, humor only when precise.
