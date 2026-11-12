'use client'

import { Button } from '@/components/Button'
import { type Track } from '@/lib/sessions'
import { useSessionProgress } from '@/lib/useSessionProgress'

/**
 * A session landing page's one primary action, under the hero, so the way
 * into the session is above the fold. A first visit gets "Start Session N",
 * to the session's first page. A learner who has opened some of its pages
 * gets "Continue", to the first page they have not opened, in reading order;
 * one who has opened them all gets "Review". Visited pages are read after
 * hydration, so the prerendered page shows "Start".
 */
export function SessionActions({
  session,
  track = 'claude',
}: {
  session: number
  track?: Track
}) {
  const { pages, unopened } = useSessionProgress(track, session)
  if (pages.length === 0) return null

  const started = unopened.length < pages.length
  const resume = started && unopened.length > 0 ? unopened[0] : undefined

  const label = resume
    ? `Continue: ${resume.title}`
    : started
      ? `Review Session ${session}`
      : `Start Session ${session}`

  return (
    <div className="not-prose mb-10 flex flex-wrap items-center gap-3">
      <Button href={(resume ?? pages[0]).href} variant="filled" arrow="right">
        {label}
      </Button>
    </div>
  )
}
