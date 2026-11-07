import Link from 'next/link'

import { glossary, type GlossaryId } from '@/lib/glossary'

/**
 * Glossary chip: links a term's first use on a page to the section that
 * defines it, with the one-line definition as a tooltip. Use it in prose or
 * inside a Callout, once per term per page, and only where the term appears
 * before the reader has reached its definition in the program.
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
  return (
    <Link
      href={entry.href}
      className="term"
      title={entry.definition}
      data-term={id}
    >
      {children ?? entry.label}
    </Link>
  )
}
