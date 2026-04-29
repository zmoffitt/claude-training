/**
 * Thin reading-progress bar that tracks document scroll via
 * `animation-timeline: scroll()`. No JavaScript needed — the keyframe
 * progress is driven entirely by scroll position.
 *
 * Graceful degradation: browsers without scroll-driven animation support
 * (<Chrome 115, <Safari 17, <Firefox 124) see scaleX(0) and nothing renders.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[51] h-0.5 origin-left bg-violet-500"
    />
  )
}
