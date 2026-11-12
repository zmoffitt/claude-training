import type { CSSProperties } from 'react'

/**
 * CSS-var-backed theme tokens. Values resolve via custom properties declared
 * in `src/styles/tailwind.css` under `:root` and `.dark`. Because `.dark` is
 * applied to <html> by a blocking script in <head> before first paint,
 * components that reference these vars render the correct theme on the
 * first paint — no FOLM (flash of light mode) per component.
 *
 * Components should use `themeVars` and `brandVars` (below) in inline
 * styles. Do not read `useThemeMode()` just to index `themeColors[mode]` —
 * that pattern causes a per-component flash during hydration.
 */

export const themeVars = {
  cardBg: 'var(--theme-card-bg)',
  cardBgWhite: 'var(--theme-card-bg-white)',
  heading: 'var(--theme-heading)',
  text: 'var(--theme-text)',
  textMuted: 'var(--theme-text-muted)',
  textSubtle: 'var(--theme-text-subtle)',
  labelMuted: 'var(--theme-label-muted)',
  shadow: 'var(--theme-shadow)',
} as const

export const brandVars = {
  blue:    { accentBar: 'var(--brand-blue-accent-bar)',    text: 'var(--brand-blue-text)',    badgeBg: 'var(--brand-blue-badge-bg)',    tint: 'var(--tint-blue)' },
  green:   { accentBar: 'var(--brand-green-accent-bar)',   text: 'var(--brand-green-text)',   badgeBg: 'var(--brand-green-badge-bg)',   tint: 'var(--tint-green)' },
  pink:    { accentBar: 'var(--brand-pink-accent-bar)',    text: 'var(--brand-pink-text)',    badgeBg: 'var(--brand-pink-badge-bg)',    tint: 'var(--tint-pink)' },
  red:     { accentBar: 'var(--brand-red-accent-bar)',     text: 'var(--brand-red-text)',     badgeBg: 'var(--brand-red-badge-bg)',     tint: 'var(--tint-red)' },
  purple:  { accentBar: 'var(--brand-purple-accent-bar)',  text: 'var(--brand-purple-text)',  badgeBg: 'var(--brand-purple-badge-bg)',  tint: 'var(--tint-purple)' },
  neutral: { accentBar: 'var(--brand-neutral-accent-bar)', text: 'var(--brand-neutral-text)', badgeBg: 'var(--brand-neutral-badge-bg)', tint: 'var(--tint-neutral)' },
  amber:   { accentBar: 'var(--brand-amber-accent-bar)',   text: 'var(--brand-amber-text)',   badgeBg: 'var(--brand-amber-badge-bg)',   tint: 'var(--tint-amber)' },
} as const

export type BrandKey = keyof typeof brandVars

/**
 * The surface of a tinted note: `Callout`, and the takeaway boxes inside the
 * diagram components. It is the card shape on a tint, with the card hairline
 * drawn in the note's hue on all four sides. A note never carries an accent
 * on one edge. Without a hue the hairline is the plain card hairline.
 */
export function noteSurface(tint: string, hue?: string): CSSProperties {
  return {
    backgroundColor: tint,
    border: `1px solid ${hue ? `color-mix(in oklch, ${hue} 24%, transparent)` : 'var(--surface-border)'}`,
    borderRadius: 'var(--radius-card)',
  }
}

/**
 * Maps any accent/brand hex color used in MDX page props to the closest
 * BrandKey so components can resolve it to a WCAG-safe text or badge variant.
 */
const ACCENT_MAP: Record<string, BrandKey> = {
  // Pulse aqua family + legacy blues
  '#00b5e2': 'blue', '#0078bc': 'blue', '#00498a': 'blue',
  '#b0e9f8': 'blue', '#dcf3fa': 'blue',
  '#4fc3f7': 'blue', '#0369a1': 'blue', '#38bdf8': 'blue',
  '#4a90d9': 'blue', '#7dd3fc': 'blue',
  // Pulse green family + legacy greens
  '#078708': 'green', '#0fac27': 'green', '#005c00': 'green',
  '#9ce390': 'green', '#e5f5e5': 'green',
  '#2db843': 'green', '#22c55e': 'green', '#15803d': 'green',
  '#86efac': 'green', '#4ade80': 'green',
  // pinks / magentas (no Pulse equivalent)
  '#d03ad0': 'pink', '#ca01be': 'pink', '#a21caf': 'pink',
  '#f0abfc': 'pink', '#e879f9': 'pink',
  // neutral + amber
  '#727286': 'neutral', '#5a5a6e': 'neutral', '#444443': 'neutral',
  '#ecb801': 'amber', '#a25e00': 'amber', '#8a5a00': 'amber',
  // reds
  '#e23523': 'red', '#cd000a': 'red', '#b91c1c': 'red',
  '#e62338': 'red',
  // Pulse plum/purple family + legacy purples
  '#6240e8': 'purple', '#858df8': 'purple', '#a1b1fa': 'purple',
  '#5156f5': 'purple', '#3910b8': 'purple', '#422981': 'purple',
  '#351f65': 'purple', '#6b5cf5': 'purple', '#bccffc': 'purple',
  '#7b5eed': 'purple', '#6140e8': 'purple', '#6d28d9': 'purple',
  '#a78bfa': 'purple', '#c4b5fd': 'purple',
}

function accentToBrand(hex: string): BrandKey | undefined {
  return ACCENT_MAP[hex.toLowerCase()]
}

/** The role a page-prop hex names, or neutral when it names none. */
export function brandKey(hex: string): BrandKey {
  return accentToBrand(hex) ?? 'neutral'
}

/**
 * The colors of a tag: a short label for a property of what it sits beside,
 * such as a permission tier's approval rule or a hook event. A tag is the
 * note surface at chip size (the hue's tint, its hairline, its text color)
 * and never takes a solid fill, so it reads as a label, not a button. A
 * neutral tag uses the card hairline and the body text color.
 */
export function tagColors(key: BrandKey) {
  const neutral = key === 'neutral'
  return {
    background: brandVars[key].tint,
    border: neutral
      ? 'var(--surface-border)'
      : `color-mix(in oklch, ${brandVars[key].accentBar} 30%, transparent)`,
    text: neutral ? themeVars.text : brandVars[key].text,
  }
}

/** `tagColors` as an inline style for an HTML element. */
export function tagStyle(key: BrandKey): CSSProperties {
  const c = tagColors(key)
  return {
    backgroundColor: c.background,
    border: `1px solid ${c.border}`,
    borderRadius: 'var(--radius-chip)',
    color: c.text,
  }
}

const DARK_UNSAFE: Record<string, { accent: string; surface: string }> = {
  '#351f65': { accent: 'var(--accent-deep-purple)', surface: 'var(--surface-deep-purple)' },
  '#422981': { accent: 'var(--accent-deep-purple)', surface: 'var(--surface-deep-purple)' },
}

/**
 * A fill or stroke for an accent hex from page props. The hex only names a
 * role: a page that passes `#6240E8` gets the active theme's purple, not a
 * fixed violet. Unmapped colors pass through unchanged.
 */
function themed(hex: string): string {
  const key = accentToBrand(hex)
  return key ? brandVars[key].accentBar : hex
}

export function safeAccent(color: string): string {
  return DARK_UNSAFE[color.toLowerCase()]?.accent ?? themed(color)
}

export function safeSurface(color: string): string {
  return DARK_UNSAFE[color.toLowerCase()]?.surface ?? color
}

/**
 * Given any accent color from page props, returns a WCAG AA-safe text color
 * as a CSS var reference. The var resolves correctly per active theme.
 * For unmapped colors (already safe dark reds, dark purples, etc.) returns
 * the original hex unchanged.
 */
/**
 * Text color for a card accent. Neutral accents resolve to the current
 * session's hue (set by Layout as --session-hue) so comparison cards carry
 * their session's color without each page picking one; any other accent is
 * made WCAG-safe as usual.
 */
export function accentText(hex: string): string {
  return accentToBrand(hex) === 'neutral' ? 'var(--session-hue, var(--brand-neutral-text))' : wcagText(hex)
}

/** Fill color (bullets, chips) for a card accent, with the same neutral rule. */
export function accentFill(hex: string): string {
  return accentToBrand(hex) === 'neutral' ? 'var(--session-hue, var(--brand-neutral-accent-bar))' : themed(hex)
}

export function wcagText(hex: string): string {
  const key = accentToBrand(hex)
  return key ? brandVars[key].text : hex
}
