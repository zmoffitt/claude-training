import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

/**
 * Prism theme for code blocks, in both modes. It keeps oneDark's selectors, so
 * every language oneDark covers stays covered, and swaps each of its colors
 * for a `--code-*` token from tailwind.css. Those tokens are declared once per
 * theme, so the same markup is highlighted correctly in light and dark.
 */
const swatch: Record<string, string> = {
  'hsl(220, 13%, 18%)': 'var(--code-bg)',
  'hsl(220, 14%, 71%)': 'var(--code-fg)',
  'hsl(220, 10%, 40%)': 'var(--code-comment)',
  'hsl(286, 60%, 67%)': 'var(--code-keyword)',
  'hsl(95, 38%, 62%)': 'var(--code-string)',
  'hsl(29, 54%, 61%)': 'var(--code-number)',
  'hsl(207, 82%, 66%)': 'var(--code-function)',
  'hsl(355, 65%, 65%)': 'var(--code-tag)',
  'hsl(5, 48%, 51%)': 'var(--code-tag)',
  'hsl(187, 47%, 55%)': 'var(--code-meta)',
  'hsl(220, 13%, 28%)': 'var(--code-selection)',
}

const swapped: Record<string, React.CSSProperties> = Object.fromEntries(
  Object.entries(oneDark as Record<string, React.CSSProperties>).map(([selector, style]) => [
    selector,
    Object.fromEntries(
      Object.entries(style)
        // oneDark's text-shadow is tuned for its own gray; it muddies text on the theme backgrounds.
        .filter(([property]) => property !== 'textShadow')
        .map(([property, value]) => [property, swatch[String(value)] ?? value]),
    ),
  ]),
)

export const codeTheme: Record<string, React.CSSProperties> = {
  ...swapped,
  // oneDark colors keys like tags. In red, a JSON or YAML settings file reads
  // as one long error, so keys take the function color.
  property: { ...swapped.property, color: 'var(--code-function)' },
}
