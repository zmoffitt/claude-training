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
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        This page hit an error.
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The rest of the site still works.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
          Error reference: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
    </div>
  )
}
