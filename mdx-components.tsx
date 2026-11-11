import { isValidElement, type ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a({ href, children, ...props }) {
      // Next Link applies the configured deployment base path to docs links.
      if (href?.startsWith('/') && !href.startsWith('//')) {
        return <Link href={href} {...props}>{children}</Link>
      }
      return <a href={href} {...props}>{children}</a>
    },
    // Every fence compiles to <pre><code>, and only a fence that names a
    // language puts a `language-*` class on the code element. Routing from
    // the <pre> sends all of them to CodeBlock, which labels an untagged
    // fence as plain text. Inline code, a <code> with no <pre> around it, has
    // no override and renders as the plain element.
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
