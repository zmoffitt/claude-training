'use client'

import clsx from 'clsx'
import { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneLight,
  oneDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism'

import { focusRing } from '@/lib/focusRing'

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      },
      () => {},
    )
  }, [code])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code to clipboard'}
      className={clsx(
        'absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:opacity-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
        focusRing,
      )}
    >
      {copied ? (
        <svg key="check" className="animate-copy-pop text-violet-500 dark:text-violet-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg key="copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

export function CodeBlock({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const language = className?.replace(/language-/, '') || 'text'
  const code = children.replace(/\n$/, '')
  const customStyle: React.CSSProperties = {
    margin: 0,
    borderRadius: '0.5rem',
    fontSize: '0.8125rem',
    lineHeight: '1.7',
    overflow: 'auto',
    maxWidth: '100%',
    fontFamily:
      'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }

  return (
    <div className="group relative">
      <CopyButton code={code} />
      <div className="dark:hidden">
        <SyntaxHighlighter language={language} style={oneLight} customStyle={customStyle}>
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="hidden dark:block">
        <SyntaxHighlighter language={language} style={oneDark} customStyle={customStyle}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
