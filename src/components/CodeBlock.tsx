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
        'flex h-6 w-6 items-center justify-center rounded-md text-current opacity-70 transition hover:bg-black/5 hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-white/10',
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
  const fence = className?.replace(/language-/, '') || 'text'
  // ```prompt is a plain-text block that is meant to be pasted into Claude.
  const language = fence === 'prompt' ? 'text' : fence
  const code = children.replace(/\n$/, '')
  const label = fence === 'text' ? 'plain text' : fence
  const customStyle: React.CSSProperties = {
    margin: 0,
    borderRadius: 0,
    fontSize: '0.8125rem',
    lineHeight: '1.7',
    overflow: 'auto',
    maxWidth: '100%',
    fontFamily:
      'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg"
      style={{ border: '1px solid var(--surface-border)' }}
    >
      {/* Header bar: language on the left, copy on the right. The tint ties
          code blocks to the rest of the system instead of floating as a
          third-party theme. */}
      <div
        className="flex items-center justify-between px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase"
        style={{ background: 'var(--tint-purple)', color: 'var(--brand-purple-text)' }}
      >
        <span>{label}</span>
        <CopyButton code={code} />
      </div>
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
