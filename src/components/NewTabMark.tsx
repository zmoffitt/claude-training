/**
 * Marks a link that opens in a new tab: a small arrow for sighted readers
 * and words for screen readers, so the new tab is expected, not a surprise.
 * Place it last inside the link. The word joiner keeps the arrow on the line
 * of the word before it, and the inline-block keeps the link's underline from
 * running under the arrow.
 */
export function NewTabMark() {
  return (
    <>
      {'⁠'}
      <span aria-hidden="true" className="ml-[0.15em] inline-block text-[0.8em]">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  )
}
