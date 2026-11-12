import { type Config } from 'tailwindcss'

export default {
  theme: {
    typography: ({ theme }) => ({
      DEFAULT: {
        css: {
          // Light prose reads the light theme's tokens from tailwind.css.
          '--tw-prose-body': 'var(--theme-text)',
          '--tw-prose-headings': 'var(--theme-heading)',
          '--tw-prose-links': 'var(--color-violet-500)',
          '--tw-prose-links-hover': 'var(--color-violet-700)',
          // The underline a link carries at rest; hover takes it to full color.
          '--tw-prose-links-underline':
            'color-mix(in oklab, var(--color-violet-500) 50%, transparent)',
          '--tw-prose-bold': 'var(--theme-heading)',
          '--tw-prose-counters': 'var(--theme-text-muted)',
          '--tw-prose-bullets': 'var(--color-zinc-300)',
          '--tw-prose-hr': 'var(--surface-border)',
          '--tw-prose-quotes': 'var(--theme-heading)',
          '--tw-prose-quote-borders': 'var(--color-zinc-200)',
          '--tw-prose-captions': 'var(--theme-text-muted)',
          '--tw-prose-code': 'var(--theme-heading)',
          '--tw-prose-code-bg': 'var(--tint-code)',
          '--tw-prose-code-ring': 'var(--surface-border)',
          '--tw-prose-th-borders': 'var(--color-zinc-300)',
          '--tw-prose-td-borders': 'var(--color-zinc-200)',

          // Dark prose reads the dark theme's tokens from tailwind.css.
          '--tw-prose-invert-body': 'var(--theme-text)',
          '--tw-prose-invert-headings': 'var(--theme-heading)',
          '--tw-prose-invert-links': 'var(--color-violet-400)',
          '--tw-prose-invert-links-hover': 'var(--color-violet-300)',
          '--tw-prose-invert-links-underline':
            'color-mix(in oklab, var(--color-violet-400) 50%, transparent)',
          '--tw-prose-invert-bold': 'var(--theme-heading)',
          '--tw-prose-invert-counters': 'var(--theme-text-muted)',
          '--tw-prose-invert-bullets': 'var(--color-zinc-600)',
          '--tw-prose-invert-hr': 'var(--surface-border)',
          '--tw-prose-invert-quotes': 'var(--theme-heading)',
          '--tw-prose-invert-quote-borders': 'var(--color-zinc-700)',
          '--tw-prose-invert-captions': 'var(--theme-text-muted)',
          '--tw-prose-invert-code': 'var(--theme-heading)',
          '--tw-prose-invert-code-bg': 'var(--tint-code)',
          '--tw-prose-invert-code-ring': 'var(--surface-border)',
          '--tw-prose-invert-th-borders': 'var(--color-zinc-600)',
          '--tw-prose-invert-td-borders': 'var(--color-zinc-700)',

          // Base
          color: 'var(--tw-prose-body)',
          fontSize: theme('fontSize.base')[0],
          lineHeight: theme('lineHeight.7'),

          // Text
          p: {
            marginTop: theme('spacing.6'),
            marginBottom: theme('spacing.6'),
          },
          '[class~="lead"]': {
            fontSize: theme('fontSize.base')[0],
            ...theme('fontSize.base')[1],
          },

          // Lists
          ol: {
            listStyleType: 'decimal',
            marginTop: theme('spacing.5'),
            marginBottom: theme('spacing.5'),
            paddingLeft: '1.625rem',
          },
          'ol[type="A"]': { listStyleType: 'upper-alpha' },
          'ol[type="a"]': { listStyleType: 'lower-alpha' },
          'ol[type="A" s]': { listStyleType: 'upper-alpha' },
          'ol[type="a" s]': { listStyleType: 'lower-alpha' },
          'ol[type="I"]': { listStyleType: 'upper-roman' },
          'ol[type="i"]': { listStyleType: 'lower-roman' },
          'ol[type="I" s]': { listStyleType: 'upper-roman' },
          'ol[type="i" s]': { listStyleType: 'lower-roman' },
          'ol[type="1"]': { listStyleType: 'decimal' },
          ul: {
            listStyleType: 'disc',
            marginTop: theme('spacing.5'),
            marginBottom: theme('spacing.5'),
            paddingLeft: '1.625rem',
          },
          li: {
            marginTop: theme('spacing.2'),
            marginBottom: theme('spacing.2'),
          },
          ':is(ol, ul) > li': {
            paddingLeft: theme('spacing[1.5]'),
          },
          'ol > li::marker': {
            fontWeight: '400',
            color: 'var(--tw-prose-counters)',
          },
          'ul > li::marker': {
            color: 'var(--tw-prose-bullets)',
          },
          '> ul > li p': {
            marginTop: theme('spacing.3'),
            marginBottom: theme('spacing.3'),
          },
          '> ul > li > *:first-child': { marginTop: theme('spacing.5') },
          '> ul > li > *:last-child': { marginBottom: theme('spacing.5') },
          '> ol > li > *:first-child': { marginTop: theme('spacing.5') },
          '> ol > li > *:last-child': { marginBottom: theme('spacing.5') },
          'ul ul, ul ol, ol ul, ol ol': {
            marginTop: theme('spacing.3'),
            marginBottom: theme('spacing.3'),
          },

          // Horizontal rules
          hr: {
            borderColor: 'var(--tw-prose-hr)',
            borderTopWidth: 1,
            marginTop: theme('spacing.16'),
            marginBottom: theme('spacing.16'),
          },

          // Quotes
          blockquote: {
            fontWeight: '500',
            fontStyle: 'italic',
            color: 'var(--tw-prose-quotes)',
            borderLeftWidth: '0.25rem',
            borderLeftColor: 'var(--tw-prose-quote-borders)',
            quotes: '"\\201C""\\201D""\\2018""\\2019"',
            marginTop: theme('spacing.8'),
            marginBottom: theme('spacing.8'),
            paddingLeft: theme('spacing.5'),
          },
          'blockquote p:first-of-type::before': { content: 'open-quote' },
          'blockquote p:last-of-type::after': { content: 'close-quote' },

          // Headings. The steps down from the title are each about a
          // quarter larger than the one below: body 1rem, H3 1.25rem, H2
          // 1.625rem, H1 2.5rem. H2 and H3 are fluid like H1, so on a phone
          // they come to 1.375rem and 1.125rem under a 1.875rem title.
          h1: {
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            lineHeight: '1.15',
            color: 'var(--tw-prose-headings)',
            fontWeight: '600',
            fontSize: 'clamp(1.875rem, 1.4rem + 1.4vw, 2.5rem)',
            marginBottom: theme('spacing.2'),
          },
          h2: {
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.015em',
            color: 'var(--tw-prose-headings)',
            fontWeight: '600',
            fontSize: 'clamp(1.375rem, 1.2rem + 0.75vw, 1.625rem)',
            lineHeight: '1.25',
            marginTop: theme('spacing.16'),
            marginBottom: theme('spacing.2'),
          },
          // H3 stays in the body face, at the size the card titles use, so a
          // sub-section reads as a heading and not as a bold lead-in. Card
          // titles are <h3> too and set their own size; they keep the line
          // height from here.
          h3: {
            color: 'var(--tw-prose-headings)',
            fontSize: 'clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)',
            ...theme('fontSize.base')[1],
            fontWeight: '600',
            marginTop: theme('spacing.10'),
            marginBottom: theme('spacing.2'),
          },

          // Media
          'img, video, figure': {
            marginTop: theme('spacing.8'),
            marginBottom: theme('spacing.8'),
          },
          'figure > *': { marginTop: '0', marginBottom: '0' },
          figcaption: {
            color: 'var(--tw-prose-captions)',
            fontSize: theme('fontSize.xs')[0],
            ...theme('fontSize.xs')[1],
            marginTop: theme('spacing.2'),
          },

          // Tables
          table: {
            fontVariantNumeric: 'tabular-nums',
            width: '100%',
            tableLayout: 'auto',
            textAlign: 'left',
            marginTop: theme('spacing.8'),
            marginBottom: theme('spacing.8'),
            lineHeight: theme('lineHeight.6'),
          },
          thead: {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-th-borders)',
          },
          // Every cell keeps its side padding, first and last included: the
          // header row is tinted, so a label flush against the edge of the
          // tint reads as unpadded. Body cells match so columns line up.
          'thead th': {
            color: 'var(--tw-prose-headings)',
            fontWeight: '600',
            verticalAlign: 'bottom',
            paddingTop: theme('spacing.2'),
            paddingRight: theme('spacing.3'),
            paddingBottom: theme('spacing.2'),
            paddingLeft: theme('spacing.3'),
          },
          'tbody tr': {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-td-borders)',
          },
          'tbody tr:last-child': { borderBottomWidth: '0' },
          'tbody td': { verticalAlign: 'baseline' },
          tfoot: {
            borderTopWidth: '1px',
            borderTopColor: 'var(--tw-prose-th-borders)',
          },
          'tfoot td': { verticalAlign: 'top' },
          ':is(tbody, tfoot) td': {
            paddingTop: theme('spacing.2'),
            paddingRight: theme('spacing.3'),
            paddingBottom: theme('spacing.2'),
            paddingLeft: theme('spacing.3'),
          },

          // Inline elements. A link is underlined at rest, not only on hover:
          // the link color is 1.64:1 from body text in light and 2.29:1 in
          // dark, under the 3:1 WCAG asks for when color alone marks a link.
          // The line sits at half strength and comes to full color on hover.
          // Glossary terms keep their own dotted line (`.term` in tailwind.css).
          a: {
            color: 'var(--tw-prose-links)',
            fontWeight: '500',
            textDecorationLine: 'underline',
            textDecorationColor: 'var(--tw-prose-links-underline)',
            textDecorationThickness: '1px',
            textUnderlineOffset: '0.2em',
            transitionProperty: 'color, text-decoration-color',
            transitionDuration: theme('transitionDuration.DEFAULT'),
            transitionTimingFunction: theme('transitionTimingFunction.DEFAULT'),
            '&:hover': {
              color: 'var(--tw-prose-links-hover)',
              textDecorationColor: 'currentColor',
            },
          },
          ':is(h1, h2, h3) a': { fontWeight: 'inherit' },
          strong: {
            color: 'var(--tw-prose-bold)',
            fontWeight: '600',
          },
          ':is(a, blockquote, thead th) strong': { color: 'inherit' },
          code: {
            color: 'var(--tw-prose-code)',
            borderRadius: theme('borderRadius.lg'),
            paddingTop: theme('padding.1'),
            paddingRight: theme('padding[1.5]'),
            paddingBottom: theme('padding.1'),
            paddingLeft: theme('padding[1.5]'),
            boxShadow: 'inset 0 0 0 1px var(--tw-prose-code-ring)',
            backgroundColor: 'var(--tw-prose-code-bg)',
            // Relative to the text it sits in, so code keeps its proportion
            // in the lead, a table cell, and a note alike.
            fontSize: '0.85em',
            // An environment variable or a path has no place to break. Let
            // it break inside the word before it pushes the page sideways.
            overflowWrap: 'break-word',
          },
          'pre code': {
            color: 'inherit',
            borderRadius: '0',
            padding: '0',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            fontSize: 'inherit',
          },
          ':is(a, h1, h2, h3, blockquote, thead th) code': {
            color: 'inherit',
          },
          'h2 code': {
            fontSize: '0.8em',
            fontWeight: 'inherit',
          },
          'h3 code': {
            fontSize: '0.85em',
            fontWeight: 'inherit',
          },

          // Overrides
          ':is(h1, h2, h3) + *': { marginTop: '0' },
          '> :first-child': { marginTop: '0 !important' },
          '> :last-child': { marginBottom: '0 !important' },
        },
      },
      invert: {
        css: {
          '--tw-prose-body': 'var(--tw-prose-invert-body)',
          '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
          '--tw-prose-links': 'var(--tw-prose-invert-links)',
          '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
          '--tw-prose-links-underline':
            'var(--tw-prose-invert-links-underline)',
          '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
          '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
          '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
          '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
          '--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
          '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
          '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
          '--tw-prose-code': 'var(--tw-prose-invert-code)',
          '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
          '--tw-prose-code-ring': 'var(--tw-prose-invert-code-ring)',
          '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
          '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
        },
      },
    }),
  },
} satisfies Config
