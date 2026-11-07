import Link from 'next/link'
import { useId } from 'react'

import { glossary, type GlossaryId } from '@/lib/glossary'

/**
 * Glossary chip: links a term's first use on a page to its glossary entry,
 * with the one-line definition as a tooltip for pointer users and as a
 * visually hidden description for assistive tech. Use it once per term per
 * page, and only where the term appears before the reader has reached its
 * definition in the program.
 *
 *   <Term id="opusplan">`/model opusplan`</Term>
 */
export function Term({
  id,
  children,
}: {
  id: GlossaryId
  children?: React.ReactNode
}) {
  const entry = glossary[id]
  const descId = useId()
  return (
    <>
      <Link
        href={`/docs/glossary#${id}`}
        className="term"
        title={entry.definition}
        aria-describedby={descId}
        data-term={id}
      >
        {children ?? entry.label}
      </Link>
      <span id={descId} className="sr-only">
        {entry.definition}
      </span>
    </>
  )
}
