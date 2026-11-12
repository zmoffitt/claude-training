'use client'

import { Button } from '@/components/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // Same shape as the 404 page: eyebrow, display headline, one line of
    // what to do, then the actions. Styled by its own classes, not the
    // article's.
    <div className="not-prose mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">
          Error
        </p>
        <h1 className="font-display text-balance break-words text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
          This page hit an error.
        </h1>
        <p className="max-w-xl text-pretty text-base text-zinc-600 dark:text-zinc-400">
          The rest of the site still works. Try the page again, or go home and
          come back to it.
        </p>
      </div>
      {error.digest && (
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
          Error reference: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button onClick={reset} variant="filled">Try again</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
    </div>
  )
}
