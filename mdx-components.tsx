import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from '@/components/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
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
  }
}
