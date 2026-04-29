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
  blue:   { accentBar: 'var(--brand-blue-accent-bar)',   text: 'var(--brand-blue-text)',   badgeBg: 'var(--brand-blue-badge-bg)' },
  green:  { accentBar: 'var(--brand-green-accent-bar)',  text: 'var(--brand-green-text)',  badgeBg: 'var(--brand-green-badge-bg)' },
  pink:   { accentBar: 'var(--brand-pink-accent-bar)',   text: 'var(--brand-pink-text)',   badgeBg: 'var(--brand-pink-badge-bg)' },
  red:    { accentBar: 'var(--brand-red-accent-bar)',    text: 'var(--brand-red-text)',    badgeBg: 'var(--brand-red-badge-bg)' },
  purple: { accentBar: 'var(--brand-purple-accent-bar)', text: 'var(--brand-purple-text)', badgeBg: 'var(--brand-purple-badge-bg)' },
} as const

export type BrandKey = keyof typeof brandVars

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

const DARK_UNSAFE: Record<string, { accent: string; surface: string }> = {
  '#351f65': { accent: 'var(--accent-deep-purple)', surface: 'var(--surface-deep-purple)' },
}

export function safeAccent(color: string): string {
  return DARK_UNSAFE[color.toLowerCase()]?.accent ?? color
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
export function wcagText(hex: string): string {
  const key = accentToBrand(hex)
  return key ? brandVars[key].text : hex
}

/**
 * Returns a WCAG AA-safe badge background that pairs with white (#fff) text.
 * Falls back to the original color for unmapped values.
 */
export function wcagBadgeBg(hex: string): string {
  const key = accentToBrand(hex)
  return key ? brandVars[key].badgeBg : hex
}
