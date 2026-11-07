import clsx from 'clsx'

/**
 * Dramatic landing-page hero: extreme size jump from body (text-sm ≈ 14px)
 * to display h1 (text-5xl/6xl ≈ 48–60px), paired with a light-weight subtitle.
 * Opts out of `.prose` defaults via `not-prose` so the title can break past
 * the 24px prose h1.
 *
 * Use on landing pages only — docs pages should keep the restrained prose h1
 * so content scanning stays fast.
 *
 * Eyebrow, headline, and subtitle rise in with a 60ms stagger on load
 * (`.hero-rise` in tailwind.css); reduced motion shows them in place.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: React.ReactNode
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={clsx('not-prose relative mt-2 mb-12 flex flex-col gap-4', className)}>
      {/* Faint brand wash behind the headline: a tint, not a hero gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -top-8 -bottom-6 -z-10 rounded-2xl"
        style={{
          background:
            'radial-gradient(75% 95% at 0% 0%, color-mix(in oklch, var(--color-violet-500) 9%, transparent), transparent 70%)',
        }}
      />
      {eyebrow && (
        <p
          className="hero-rise text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--session-hue, var(--brand-purple-text))' }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className="hero-rise font-display text-balance break-words text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white"
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
