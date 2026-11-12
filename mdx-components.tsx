import { isValidElement, type ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import clsx from 'clsx'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { InlineTableOfContents } from '@/components/TableOfContents'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // `scripts/remark-page-outline.mjs` adds this element to every page,
    // below the title and tagline.
    InlineTableOfContents,
    a({ href, children, ...props }) {
      // Next Link applies the configured deployment base path to docs links.
      if (href?.startsWith('/') && !href.startsWith('//')) {
        return <Link href={href} {...props}>{children}</Link>
      }
      return <a href={href} {...props}>{children}</a>
    },
    // Inline code only: `pre` below reads a fence's <code> element without
    // rendering it. A short piece of inline code stays on one line, so a
    // command such as `/model fable` is not split in two on a phone; longer
    // code may still wrap.
    code({ children, className, ...props }) {
      const short = typeof children === 'string' && children.length <= 28
      return (
        <code className={clsx(className, short && 'whitespace-nowrap')} {...props}>
          {children}
        </code>
      )
    },
    // Every fence compiles to <pre><code>, and only a fence that names a
    // language puts a `language-*` class on the code element. Routing from
    // the <pre> sends all of them to CodeBlock, which labels an untagged
    // fence as plain text.
    pre({ children }) {
      if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) {
        return <pre>{children}</pre>
      }
      return (
        <div>
          <CodeBlock className={children.props.className}>
            {String(children.props.children ?? '')}
          </CodeBlock>
        </div>
      )
    },
    // Wrap tables so dense markdown tables scroll horizontally on narrow
    // viewports instead of compressing every cell to one-word-per-line.
    table({ children, ...props }) {
      return (
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable table"
        >
          <table {...props}>{children}</table>
        </div>
      )
    },
  }
}
