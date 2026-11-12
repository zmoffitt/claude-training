import { useEffect, useState } from 'react'

import { sessionOfPath, type Track } from '@/lib/sessions'

const STORAGE_KEY = 'training-progress'

export interface LastVisit {
  href: string
  session: number
}

/** The last session page a learner opened in each track. Kept in this browser only. */
type Progress = Partial<Record<Track, LastVisit>>

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
    const next: Progress = { ...read(), [where.track]: { href: pathname, session: where.number } }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage is unavailable (private mode, quota): there is nothing to remember.
  }
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
