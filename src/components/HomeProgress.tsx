'use client'

import { Button } from '@/components/Button'
import { allPages } from '@/components/Navigation'
import { TrainingRoadmap } from '@/components/TrainingRoadmap'
import { useLastVisit } from '@/lib/progress'
import { claudeSessions, type Track } from '@/lib/sessions'

/**
 * The home page's starting points. A first visit gets "Start"; a learner who
 * has opened a session before gets "Continue", pointing at the page they
 * left. The place is read after hydration, so the prerendered page is the
 * first-visit one.
 */
function useResume(track: Track) {
  const visit = useLastVisit(track)
  const page = visit && allPages.find((p) => p.href === visit.href)
  // A stored page that has since been removed from the navigation is ignored.
  return visit && page ? { ...visit, title: page.title } : undefined
}

export function HomeActions() {
  const claude = useResume('claude')
  const codex = useResume('codex')
  const firstSession = claudeSessions[0].href ?? '/docs'

  return (
    <div className="not-prose mb-10 flex flex-wrap items-center gap-3">
      <Button
        href={claude?.href ?? firstSession}
        variant="filled"
        arrow="right"
        aria-label={claude ? `Continue Session ${claude.session}: ${claude.title}` : undefined}
      >
        {claude ? `Continue Session ${claude.session}` : 'Start Claude training'}
      </Button>
      <Button
        href={codex?.href ?? '/docs/training/codex-chatgpt'}
        variant="text"
        arrow="right"
        aria-label={codex ? `Continue Codex & ChatGPT: ${codex.title}` : undefined}
      >
        {codex ? 'Continue Codex & ChatGPT' : 'Explore Codex & ChatGPT'}
      </Button>
    </div>
  )
}

export function HomeRoadmap() {
  const claude = useResume('claude')
  return (
    <TrainingRoadmap
      activeStep={claude?.session ?? 1}
      activeLabel={claude ? 'Continue' : 'Start here'}
    />
  )
}
