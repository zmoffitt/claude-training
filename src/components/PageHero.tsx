import clsx from 'clsx'

/**
 * Landing-page hero. The headline is the page's one loud element: a fluid
 * display size that runs from 40px on a phone to 80px on a wide screen, set
 * tight, over a light-weight subtitle. Opts out of the prose defaults so the
 * title can break past the prose h1.
 *
 * A session landing page passes `numeral`. It opens the page the way a
 * chapter number opens a chapter: the session number in the session hue, a
 * hairline, and the eyebrow at the far end of it.
 *
 * Use on landing pages only. Lesson and reference pages keep the restrained
 * prose h1 so content scanning stays fast.
 *
 * The opener, headline, and subtitle rise in with a 60ms stagger on load
 * (`.hero-rise` in tailwind.css); reduced motion shows them in place.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  numeral,
  className,
}: {
  eyebrow?: React.ReactNode
  title: string
  subtitle?: string
  /** The session number, on session landing pages. */
  numeral?: number
  className?: string
}) {
  const hue = 'var(--session-hue, var(--brand-purple-text))'
  const eyebrowText = eyebrow && (
    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: hue }}>
      {eyebrow}
    </p>
  )

  return (
    <div className={clsx('not-prose mt-2 mb-12 flex flex-col gap-4', className)}>
      {numeral !== undefined ? (
        <div className="hero-rise flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span
            aria-hidden="true"
            className="font-display text-[5rem] leading-[0.8] font-bold tracking-[-0.04em] sm:text-[7rem] lg:text-[8.5rem]"
            style={{ color: hue }}
          >
            {numeral}
          </span>
          <span
            aria-hidden="true"
            className="h-px min-w-8 flex-1"
            style={{ backgroundColor: 'var(--surface-border)' }}
          />
          {eyebrowText}
        </div>
      ) : (
        eyebrow && <div className="hero-rise">{eyebrowText}</div>
      )}
      <h1
        className="hero-rise font-display text-balance break-words text-[clamp(2.5rem,1.5rem+4vw,5rem)] font-bold leading-[1] tracking-[-0.035em] text-zinc-900 dark:text-white"
        style={{ animationDelay: '60ms' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="hero-rise max-w-2xl text-pretty break-words text-lg font-light leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400"
          style={{ animationDelay: '120ms' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
