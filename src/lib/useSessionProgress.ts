import { allPages, type PageEntry } from '@/components/Navigation'
import { useVisitedPages } from '@/lib/progress'
import { sessionsByTrack, type Session, type Track } from '@/lib/sessions'

export interface SessionProgress {
  /** The session's pages after its landing page, in reading order. */
  pages: Array<PageEntry>
  /** The pages this learner has not opened yet, in the same order. */
  unopened: Array<PageEntry>
  /** The track's next session, when it has pages. */
  next?: Session
}

/**
 * How far a learner has got through one session, from the visited-pages
 * store. Like the store it reads, it is empty on the server and during
 * hydration, so a prerendered page shows the first-visit state: nothing
 * opened yet.
 */
export function useSessionProgress(track: Track, session: number): SessionProgress {
  const visited = useVisitedPages()
  const sessions = sessionsByTrack[track]
  const landing = sessions.find((s) => s.number === session)?.href
  const pages = landing ? allPages.filter((p) => p.href.startsWith(`${landing}/`)) : []
  return {
    pages,
    unopened: pages.filter((p) => !visited.has(p.href)),
    next: sessions.find((s) => s.number === session + 1 && s.href),
  }
}
