'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneLight,
  oneDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useThemeMode } from '@/lib/useThemeMode'

export function CodeBlock({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const mode = useThemeMode()
  const language = className?.replace(/language-/, '') || 'text'

  if (mode === 'light' && typeof window === 'undefined') {
    return (
      <pre
        style={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.8125rem',
          lineHeight: '1.7',
          padding: '1em',
          overflow: 'auto',
        }}
      >
        <code>{children.replace(/\n$/, '')}</code>
      </pre>
    )
  }

  return (
    <SyntaxHighlighter
      language={language}
      style={mode === 'dark' ? oneDark : oneLight}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.8125rem',
        lineHeight: '1.7',
      }}
    >
      {children.replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}
