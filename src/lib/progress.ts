import { useEffect, useState, useSyncExternalStore } from 'react'

import { sessionOfPath, type Track } from '@/lib/sessions'

const STORAGE_KEY = 'training-progress'

export interface LastVisit {
  href: string
  session: number
}

/**
 * The last session page a learner opened in each track, and every session
 * page they have opened. Kept in this browser only.
 */
type Progress = Partial<Record<Track, LastVisit>> & { visited?: string[] }

/** More than the site has pages; it only stops a damaged list from growing. */
const MAX_VISITED = 500

const listeners = new Set<() => void>()

function read(): Progress {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** Remembers `pathname` as the learner's place when it is a session page. */
export function recordVisit(pathname: string) {
  const where = sessionOfPath(pathname)
  if (!where) return
  try {
    const stored = read()
    const before = Array.isArray(stored.visited) ? stored.visited : []
    const visited = before.includes(pathname) ? before : [...before, pathname].slice(-MAX_VISITED)
    const next: Progress = {
      ...stored,
      [where.track]: { href: pathname, session: where.number },
      visited,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    listeners.forEach((notify) => notify())
  } catch {
    // Storage is unavailable (private mode, quota): there is nothing to remember.
  }
}

const NO_PAGES: ReadonlySet<string> = new Set()
let snapshot: { raw: string | null; pages: ReadonlySet<string> } | undefined

/** The visited pages as a set that keeps its identity until storage changes. */
function visitedPages(): ReadonlySet<string> {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return NO_PAGES
  }
  if (!snapshot || snapshot.raw !== raw) {
    const list = read().visited
    snapshot = {
      raw,
      pages: new Set(Array.isArray(list) ? list.filter((href) => typeof href === 'string') : []),
    }
  }
  return snapshot.pages
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  // Another tab of the site writes to the same store.
  window.addEventListener('storage', notify)
  return () => {
    listeners.delete(notify)
    window.removeEventListener('storage', notify)
  }
}

/**
 * The session pages this learner has opened, by path. Empty on the server and
 * during hydration, so the prerendered sidebar is the first-visit one, and it
 * updates as the learner moves through the site.
 */
export function useVisitedPages(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, visitedPages, () => NO_PAGES)
}

/**
 * The learner's last page in a track. Undefined on the server, on the first
 * client render, and for someone who has not opened a session yet, so the
 * prerendered page always shows the first-visit state.
 */
export function useLastVisit(track: Track): LastVisit | undefined {
  const [visit, setVisit] = useState<LastVisit>()
  useEffect(() => {
    const stored = read()[track]
    if (stored && typeof stored.href === 'string' && typeof stored.session === 'number') {
      setVisit(stored)
    }
  }, [track])
  return visit
}
