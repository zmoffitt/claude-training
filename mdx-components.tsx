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
    pre({ children }) {
      return <div>{children}</div>
    },
    code({ className, children, ...props }) {
      const isBlock = /language-/.test(className || '')
      if (isBlock) {
        return (
          <CodeBlock className={className}>
            {String(children)}
          </CodeBlock>
        )
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
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
